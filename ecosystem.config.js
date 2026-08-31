const fs = require("fs");

// Next.js 16 requires Node >=20.9.0. On the LAN server this runs on, the
// system Node is older (18.x) and isn't being upgraded — that would affect
// every other pm2 app on that box. A Node 20 was installed via nvm in
// isolation just for this app instead (not set as the system default).
// Elsewhere (e.g. local dev), the default `node` on PATH already satisfies
// the version requirement, so fall back to it there rather than hard-
// failing on a path that only exists on that one server.
function resolveInterpreter() {
  const isolatedNode20 = "/root/.nvm/versions/node/v20.20.2/bin/node";
  if (fs.existsSync(isolatedNode20)) return isolatedNode20;
  return "node";
}

// pm2 config — runs `next dev` (not a production build) on purpose: the
// Upload button's content only takes effect live under dev mode (see
// README "Adding study content" — a production build bakes content/
// imports into the compiled bundle, so a new upload wouldn't show up
// until a rebuild + restart). For a single-user LAN app, dev mode's
// lower performance doesn't matter; keeping uploads instant does.
//
// Runs Next's bin script directly rather than `npm run dev` — on Windows,
// pm2 tries to execute npm.cmd through Node's own module loader instead
// of a shell and fails with "SyntaxError: Unexpected token ':'". Pointing
// at node_modules/next/dist/bin/next sidesteps that entirely and is the
// same command `npm run dev` would have run anyway.
//
// exec_mode is explicitly "fork" — on at least pm2 v7.0.3, omitting
// exec_mode entirely still defaulted to cluster mode, which doesn't work
// with `next dev` (single-instance, file-watching, in-memory build cache)
// and caused a crash-restart loop. Don't remove this line or add `-i`.
//
// Usage:
//   pm2 start ecosystem.config.js
//   pm2 save        # persist across reboots
//   pm2 startup     # (one-time) generate the OS boot-hook command
//
// To switch to a production build instead (better performance, but you
// must `npm run build && pm2 restart hast-study` after every content
// upload for it to appear): change `args` below to "start -p 3333", and
// run `npm run build` once before starting pm2.
module.exports = {
  apps: [
    {
      name: "hast-study",
      script: "node_modules/next/dist/bin/next",
      args: "dev -p 3333",
      interpreter: resolveInterpreter(),
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      // Next's own dev server already reloads on file changes (including
      // uploaded content) — pm2 also watching would restart the whole
      // process (and drop the in-memory bits) on every single upload.
      watch: false,
      time: true,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
