# Leo's Lucha Learning Arena — standalone deploy package

This folder is the Arena packaged to run outside Muse, so it can live at
**https://play.enchantedlegacycreations.com** (the school Wi-Fi blocks the
Muse address; JC's website already links to this address from its
"¡A Jugar!" button).

Everything was test-run locally before packaging: the app boots, the class
roster loads with all progress intact, the teacher PIN gate still rejects
unauthenticated actions, hosted games answer, and the full 4,506-clip
audio pack seeds itself from the bundled files on a fresh start.

## What's inside

- `server.ts` — the standalone host (static client + action dispatch +
  blob serving). Starts with `bun run server.ts`, listens on `$PORT`.
- `worker/` — the action runtime bundle the host drives.
- `space/` — the Arena itself: built client, built server actions, the
  bundled content pack (audio clips, art, lesson videos), and `app.db`
  (the class database: roster, progress, teacher-PIN gate — copied
  row-for-row from the live Muse Arena on 2026-11-17).
- `Dockerfile` + `render.yaml` — the Render deploy definition (free tier).
- No secrets are needed and none are in this package: the teacher PIN and
  its recovery phrase live inside `app.db`, exactly as they do today.

## Deploy — the steps that need JC (about 10 minutes, all clicks)

1. **GitHub** (github.com): sign in (or create a free account), install
   **GitHub Desktop**, unzip this package, and in GitHub Desktop choose
   *Add an Existing Repository* → select the unzipped folder → *Publish
   repository* (name it e.g. `leo-lucha-arena`). This puts the code in a
   repo Render can read.
2. **Render** (render.com): sign up free (Google sign-in is fine — no
   card for the free tier). Choose **New → Blueprint**, connect GitHub,
   pick the `leo-lucha-arena` repo, and **Apply**. Render reads
   `render.yaml`, builds the Docker image, and starts the service.
   First build takes a while (the package is ~320 MB).
3. When the deploy finishes, the service is live at
   **https://leo-lucha-arena.onrender.com** — open it once to confirm
   the Arena loads.
4. **Custom domain**: in the Render service → **Settings → Custom
   Domains** → add `play.enchantedlegacycreations.com`. Render shows a
   DNS target (your service's `onrender.com` address). Then, wherever
   `enchantedlegacycreations.com` DNS is managed (the Porkbun account
   where the domain was bought, unless DNS was moved to Cloudflare):
   add one record — **Type: CNAME · Name/Host: `play` · Value:
   `leo-lucha-arena.onrender.com`** (use the exact value Render shows).
   Leave any proxy/CDN toggle **off** for this record. Render issues
   the HTTPS certificate automatically once the record resolves
   (can take up to an hour).
5. Open **https://play.enchantedlegacycreations.com** — the website's
   ¡A Jugar! button already points there. Then the real test: open it
   on the **school Wi-Fi**.

## Free-tier fine print (Render)

- **Spin-down:** a free service sleeps after ~15 minutes with no
  visitors. The first open after that takes about a minute to wake —
  after that it's fast while in use. In classroom terms: open the Arena
  a couple of minutes before the lesson, or expect a slow first load.
- **No permanent disk on free:** class progress made on this copy is
  kept while the service lives, but a redeploy/restart can reset it to
  the packaged copy (roster and starting points stay; progress from the
  test day may not). The Muse-hosted Arena remains the real home of the
  class data until the school test passes — this deploy is the test.
  If the test passes, the permanent fix is Step 3 of the original plan
  (Render paid ~$7.50/mo with a disk, or a hosted database).
- **Hours:** 750 free instance hours/month per workspace — plenty for
  one classroom service, since sleeping time doesn't count.

## Running it locally (for Juno)

```bash
bun install
bun run server.ts   # PORT env optional, default 10000
# health: GET /healthz
```

Environment knobs (all optional): `PORT`, `SPACE_DIR` (default `./space`),
`ARENA_DATA_DIR` (where app.db + generated blobs live; default = the
space folder). On Render, defaults are used.
