import { NextResponse } from "next/server";

// Gates the whole site (every page AND every API route — no matcher
// exported means Proxy runs on every request) behind a single shared
// password via HTTP Basic Auth. This is a personal single-user app now
// published on a public domain; the API routes (upload/delete/export/
// progress/draft/import-evaluation) have no auth of their own, so this
// is the only thing standing between the internet and Tristan's study
// data. The browser's native login prompt caches credentials for the
// session and re-sends them automatically on every subsequent request
// to this origin — no cookie/session code needed.
const REALM = "Hast Study";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"` },
  });
}

export function proxy(request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    // Fail closed, not open — better a confusing 401 locally until
    // .env.local is set up than an accidentally-open site in prod.
    return unauthorized();
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    const suppliedPassword = separatorIndex === -1 ? decoded : decoded.slice(separatorIndex + 1);
    if (suppliedPassword === password) {
      return NextResponse.next();
    }
  }

  return unauthorized();
}
