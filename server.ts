// Standalone host for Leo's Lucha Learning Arena.
//
// The Arena was built as a Muse "TS space": its server logic lives in a
// prebuilt actions bundle (space/server/dist/actions.js) that expects the
// platform worker runtime. This file recreates that runtime's wire
// protocol over HTTP so the same bundle runs on any Bun host (Render):
//
//   GET  /                 -> the built client (space/client/dist)
//   POST /actions          -> {action, args} in, {data} | {error} out
//   GET  /blobs/<token>    -> blob bytes (token = base64url of the key)
//
// The action worker is the platform's own worker (worker/bundle.js),
// spawned as a child process speaking NDJSON on stdin / FD 3, exactly
// like the platform daemon drives it. Privileged contracts (the app's
// read-only access to its bundled asset pack) are executed in-process
// from the app's own handlers bundle (space/server/dist/privileged.js)
// over a local Unix socket — no Muse services are contacted.
//
// Environment:
//   PORT            HTTP port (Render sets this; default 10000)
//   SPACE_DIR       space root (default: ./space next to this file)
//   ARENA_DATA_DIR  writable dir for app.db + blobs (default: SPACE_DIR)
//                   Point this at a persistent disk to keep class data.

import { spawn, type ChildProcess } from "node:child_process";
import { createServer as createNetServer, type Socket } from "node:net";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { createClient } from "@libsql/client";

const ROOT = resolve(import.meta.dir);
const SPACE_DIR = resolve(process.env.SPACE_DIR ?? join(ROOT, "space"));
const DATA_DIR = resolve(process.env.ARENA_DATA_DIR ?? SPACE_DIR);
const CLIENT_DIR = join(SPACE_DIR, "client", "dist");
const DB_PATH = join(DATA_DIR, "app.db");
const BLOB_DIR = join(DATA_DIR, "blobs");
const PORT = Number(process.env.PORT ?? 10000);
const SLUG = "leo-s-lucha-learning-arena";
const PRIV_SOCK = join(
  process.env.TMPDIR ?? "/tmp",
  `arena-priv-${process.pid}.sock`,
);

await mkdir(DATA_DIR, { recursive: true });
await mkdir(BLOB_DIR, { recursive: true });

/* ------------------------------------------------------------------ */
/* Privileged contracts: serve the app's own handlers in-process.      */
/* ------------------------------------------------------------------ */

type PrivilegedHandlers = {
  format: string;
  entries: readonly { contract: { name: string }; handler: Function }[];
};

const privMod = (await import(
  join(SPACE_DIR, "server", "dist", "privileged.js")
)) as Record<string, unknown>;
const handlersObj = Object.values(privMod).find(
  (v): v is PrivilegedHandlers =>
    typeof v === "object" &&
    v !== null &&
    (v as PrivilegedHandlers).format === "hatch-space-privileged-handlers-v1",
);
if (!handlersObj) throw new Error("privileged handlers bundle not found");
const privHandlers = new Map(
  handlersObj.entries.map((e) => [e.contract.name, e.handler]),
);

const privServer = createNetServer((socket: Socket) => {
  // One request per connection: the client writes one frame, reads one
  // framed response, and the socket ends (mirrors the daemon's RPC).
  let buf = Buffer.alloc(0);
  socket.on("data", (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    if (buf.length < 4) return;
    const bodyLen = buf.readUInt32BE(0);
    if (buf.length < 4 + bodyLen) return;
    const payload = buf.subarray(4, 4 + bodyLen).toString("utf8");
    buf = Buffer.alloc(0);
    void (async () => {
      let response: Record<string, unknown>;
      try {
        const req = JSON.parse(payload) as {
          contract_name: string;
          args: unknown;
        };
        const handler = privHandlers.get(req.contract_name);
        if (!handler) throw new Error(`unknown contract ${req.contract_name}`);
        const result = await handler(req.args);
        response = { ok: true, result: { kind: "call", result } };
      } catch (err) {
        response = {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
      const out = Buffer.from(JSON.stringify(response), "utf8");
      const frame = Buffer.alloc(4 + out.length);
      frame.writeUInt32BE(out.length, 0);
      out.copy(frame, 4);
      socket.end(frame);
    })();
  });
  socket.on("error", () => {});
});
await new Promise<void>((res) => privServer.listen(PRIV_SOCK, res));

/* ------------------------------------------------------------------ */
/* Worker child process (platform NDJSON protocol).                    */
/* ------------------------------------------------------------------ */

type Pending = {
  resolve: (data: unknown) => void;
  reject: (err: Error) => void;
};

let reqSeq = 0;
const pending = new Map<string, Pending>();
let worker: ChildProcess;

function handleFrame(line: string) {
  let frame: Record<string, unknown>;
  try {
    frame = JSON.parse(line);
  } catch {
    return;
  }
  const id = frame.request_id as string | undefined;
  if (!id) return;
  const p = pending.get(id);
  if (!p) return;
  if (frame.kind === "data") {
    pending.delete(id);
    p.resolve(frame.data);
  } else if (frame.kind === "error") {
    pending.delete(id);
    p.reject(new Error(String(frame.error ?? "action failed")));
  }
  // "end" and "invalidate_queries" frames need no handling: with no push
  // channel, the client's normal refetch-on-focus keeps views fresh.
}

function spawnWorker() {
  worker = spawn(
    process.execPath,
    ["run", join(ROOT, "worker", "bundle.js")],
    {
      cwd: ROOT,
      env: {
        ...process.env,
        HATCH_SPACE_DIR: SPACE_DIR,
        HATCH_SPACE_SLUG: SLUG,
        HATCH_SPACE_DB_PATH: DB_PATH,
        HATCH_SPACE_BLOB_DIR: BLOB_DIR,
        HATCH_SPACE_PRIVILEGED_SOCKET: PRIV_SOCK,
        HATCH_ACTION_PROTOCOL_FD: "3",
      },
      stdio: ["pipe", "pipe", "inherit", "pipe"],
    },
  );
  const fd3 = (worker.stdio as unknown[])[3] as NodeJS.ReadableStream;
  let text = "";
  fd3.on("data", (chunk: Buffer) => {
    text += chunk.toString("utf8");
    let nl = text.indexOf("\n");
    while (nl >= 0) {
      handleFrame(text.slice(0, nl));
      text = text.slice(nl + 1);
      nl = text.indexOf("\n");
    }
  });
  worker.on("exit", (code) => {
    for (const p of pending.values()) p.reject(new Error("worker exited"));
    pending.clear();
    console.error(`[arena] worker exited (${code}); restarting in 1s`);
    setTimeout(spawnWorker, 1000).unref();
  });
}

function invokeAction(action: string, args: unknown): Promise<unknown> {
  const requestId = `http-${++reqSeq}-${Date.now().toString(36)}`;
  return new Promise((resolvePromise, rejectPromise) => {
    pending.set(requestId, { resolve: resolvePromise, reject: rejectPromise });
    const cmd = {
      kind: "invoke",
      action,
      args: args ?? {},
      invocation_id: requestId,
      request_id: requestId,
      slug: SLUG,
      transport: "request",
    };
    worker.stdin?.write(JSON.stringify(cmd) + "\n");
    setTimeout(() => {
      if (pending.delete(requestId)) {
        rejectPromise(new Error(`action ${action} timed out`));
      }
    }, 120_000).unref?.();
  });
}

/* ------------------------------------------------------------------ */
/* Blob serving (mirrors the worker blob store layout).                */
/* ------------------------------------------------------------------ */

const blobIndex = createClient({
  url: `file:${join(BLOB_DIR, "index.sqlite")}`,
});

async function serveBlob(token: string): Promise<Response> {
  let key: string;
  try {
    key = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return new Response("bad blob token", { status: 400 });
  }
  const result = await blobIndex.execute({
    sql: "SELECT content_type, object_id FROM blobs WHERE key = ?",
    args: [key],
  });
  const row = result.rows[0];
  if (!row) return new Response("not found", { status: 404 });
  const objectId = row.object_id as string | null;
  const file = objectId
    ? join(BLOB_DIR, "objects", objectId.slice(0, 2), objectId)
    : join(BLOB_DIR, "objects", key);
  if (!existsSync(file)) return new Response("not found", { status: 404 });
  const data = await readFile(file);
  return new Response(data, {
    headers: {
      "content-type": String(row.content_type ?? "application/octet-stream"),
      "cache-control": "no-store",
      "content-security-policy": "sandbox",
      "x-content-type-options": "nosniff",
    },
  });
}

/* ------------------------------------------------------------------ */
/* Static client + HTTP surface.                                       */
/* ------------------------------------------------------------------ */

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
};

async function serveStatic(pathname: string): Promise<Response> {
  const rel = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = resolve(join(CLIENT_DIR, rel));
  if (file !== CLIENT_DIR && !file.startsWith(CLIENT_DIR + sep)) {
    return new Response("not found", { status: 404 });
  }
  const target = existsSync(file) && (await stat(file)).isFile()
    ? file
    : join(CLIENT_DIR, "index.html");
  const data = await readFile(target);
  return new Response(data, {
    headers: {
      "content-type": MIME[extname(target)] ?? "application/octet-stream",
      "cache-control": target.endsWith("index.html")
        ? "no-cache"
        : "public, max-age=3600",
    },
  });
}

spawnWorker();

const server = Bun.serve({
  port: PORT,
  idleTimeout: 180,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/healthz") {
      return Response.json({ ok: true, slug: SLUG });
    }
    if (url.pathname === "/actions" && req.method === "POST") {
      try {
        const body = (await req.json()) as { action?: string; args?: unknown };
        if (!body.action) {
          return Response.json(
            { error: "missing action" },
            { status: 400 },
          );
        }
        const data = await invokeAction(body.action, body.args);
        return Response.json({ data });
      } catch (err) {
        return Response.json({
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    if (url.pathname.startsWith("/blobs/")) {
      return serveBlob(url.pathname.slice("/blobs/".length));
    }
    if (req.method === "GET" || req.method === "HEAD") {
      return serveStatic(url.pathname);
    }
    return new Response("not found", { status: 404 });
  },
});

console.log(
  `[arena] Leo's Lucha Learning Arena listening on :${server.port} (space: ${SPACE_DIR}, data: ${DATA_DIR})`,
);
