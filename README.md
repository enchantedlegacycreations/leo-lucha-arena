# Leo's Lucha Learning Arena — standalone deploy package (v4)

This folder is the Arena packaged to run outside Muse, so it can live at
**https://play.enchantedlegacycreations.com** (the school Wi-Fi blocks the
Muse address; JC's website already links to this address from its
"¡A Jugar!" button).

The v4 package was test-run locally before packaging (2026-11-19): the
standalone host boots, the health check answers, the class roster gate
rejects unauthenticated calls (no roster data before the class code,
exactly like the live site), the teacher gate reports itself configured,
and the game data serves. The bundled content pack — now **5,031 audio
clips**, art, and lesson videos — is the same pack verified clip-by-clip
during the v4 build.

## What's inside

- `server.ts` — the standalone host (static client + action dispatch +
  blob serving). Starts with `bun run server.ts`, listens on `$PORT`.
- `worker/` — the action runtime bundle the host drives.
- `space/` — the Arena itself: built client, built server actions, the
  bundled content pack (audio clips, art, lesson videos), and `app.db`
  (the class database: roster, progress, teacher-PIN gate — copied
  row-for-row from the live Muse Arena on 2026-11-19).
- `Dockerfile` + `render.yaml` — the Render deploy definition (free tier).
- No secrets are needed and none are in this package: the teacher PIN and
  its recovery phrase live inside `app.db`, exactly as they do today.
  The database connection string (below) is pasted by JC directly into
  Render — it is never written into this package.

## Updating to v4 + turning on the database (the steps that need JC)

v4 adds a permanent home for the class data. Until now, the roster,
Puntos/Rayos, belts, teacher settings, secret pictures and assignments
lived in the Render service's own storage, which a redeploy can wipe
back to the packaged copy. With the database connected, all of that
lives in the database and survives redeploys, sleeps and updates.
**This v4 push is the last wipe-risk deploy** — do the database steps
right after pushing it.

1. **Push v4 (GitHub Desktop):** unzip this package, and in GitHub
   Desktop open the existing `leo-lucha-arena` repository. Replace the
   repository folder's contents with this package's contents (keep the
   hidden `.git` folder that's already there — that's what makes it the
   same repository). Commit the changes (summary: `Arena v4`) and
   **Push**. Render sees the push and redeploys on its own; give it a
   few minutes.
2. **Create the database (Neon — neon.tech):** sign up free (Google
   sign-in is fine — no credit card, the free plan does not expire).
   Create a project (name it `leo-lucha-arena`); Neon creates the
   database automatically. On the project Dashboard, find the
   **Connection string** box and copy the whole string (it starts with
   `postgresql://`).
3. **Connect it (Render — render.com):** open the `leo-lucha-arena`
   service → **Environment** in the left menu → **Add Environment
   Variable**. Key: `DATABASE_URL` · Value: paste the Neon connection
   string → **Save Changes**. The service restarts itself.
4. **Check it:** open **https://play.enchantedlegacycreations.com**,
   wait out the wake-up, and look at the Arena: the welcome doors show
   as always, and after the class code the roster is there. The first
   load against a brand-new database can take a few extra seconds while
   the Arena sets the database up — after that it just works, and class
   progress is permanent from then on.

If step 2–3 are skipped, v4 still runs — it simply keeps its data the
old way (in the service's own storage, wiped on redeploy). The database
is what makes progress permanent, so don't leave it undone.

## Deploy from scratch — the original setup steps (already done in 2026-11)

1. **GitHub** (github.com): sign in (or create a free account), install
   **GitHub Desktop**, unzip this package, and in GitHub Desktop choose
   *Add an Existing Repository* → select the unzipped folder → *Publish
   repository* (name it e.g. `leo-lucha-arena`). This puts the code in a
   repo Render can read.
2. **Render** (render.com): sign up free (Google sign-in is fine — no
   card for the free tier). Choose **New → Blueprint**, connect GitHub,
   pick the `leo-lucha-arena` repo, and **Apply**. Render reads
   `render.yaml`, builds the Docker image, and starts the service.
   First build takes a while (the package is ~300 MB).
3. When the deploy finishes, the service is live at
   **https://leo-lucha-arena.onrender.com** — open it once to confirm
   the Arena loads.
4. **Custom domain**: in the Render service → **Settings → Custom
   Domains** → add `play.enchantedlegacycreations.com`. Render shows a
   DNS target (your service's `onrender.com` address). Then, wherever
   `enchantedlegacycreations.com` DNS is managed (Cloudflare): add one
   record — **Type: CNAME · Name/Host: `play` · Value:
   `leo-lucha-arena.onrender.com`** (use the exact value Render shows),
   with the Cloudflare proxy **on** for this record. Render issues the
   HTTPS certificate automatically once the record resolves (can take
   up to an hour).
5. Open **https://play.enchantedlegacycreations.com** — the website's
   ¡A Jugar! button already points there. Then the real test: open it
   on the **school Wi-Fi**.

## Free-tier fine print

- **Spin-down (Render):** a free service sleeps after ~15 minutes with
  no visitors. The first open after that takes about a minute to wake —
  after that it's fast while in use. In classroom terms: open the Arena
  a couple of minutes before the lesson, or expect a slow first load.
- **The database (Neon free):** free forever, no credit card, no time
  limit, and your data is never deleted on the free plan. The database
  also sleeps when idle (after ~5 minutes) and wakes on its own in
  about a second when the Arena asks for it — the first page load after
  a quiet spell can take a moment longer; that's the wake-up, not a
  problem. 1 GB of storage is far more than a class roster and a year
  of progress will ever use.
- **Without the database:** class progress made on this copy is kept
  while the service lives, but a redeploy/restart can reset it to the
  packaged copy. That is the v3 behavior — the database steps above are
  the fix.
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
space folder), `DATABASE_URL` (when set, ALL persistent state — roster,
progress, teacher settings, secret pictures, assignments — lives in
that external Postgres database instead of the local files; when unset,
behavior is exactly the v3 local behavior). On Render, the defaults are
used, plus the `DATABASE_URL` JC pastes in.
