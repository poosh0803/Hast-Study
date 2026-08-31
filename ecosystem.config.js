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
      cwd: __dirname,
      instances: 1,
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
