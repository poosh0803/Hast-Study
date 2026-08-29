import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { SUBJECTS, regenerateManifest } from "@/lib/content-manifest";

export const runtime = "nodejs";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const MAX_SIZE = 2 * 1024 * 1024; // 2MB — content files are hand-written data, not big.
const FILENAME_RE = /^[a-zA-Z0-9_-]+\.js$/;

// Accepts one or more files under the same "file" field. Each is validated
// and saved independently — one bad file in a batch doesn't block the rest
// — then the subject's manifest is regenerated once, after every valid
// file has landed, instead of once per file.
export async function POST(request) {
  const formData = await request.formData();
  const subject = formData.get("subject");
  const files = formData.getAll("file").filter((f) => f instanceof File);

  if (typeof subject !== "string" || !SUBJECTS[subject]) {
    return NextResponse.json({ error: "Unknown subject." }, { status: 400 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const results = [];
  let savedAny = false;

  for (const file of files) {
    const filename = path.basename(file.name || "");
    const label = filename || file.name || "(unnamed)";

    if (!FILENAME_RE.test(filename) || filename === "manifest.js") {
      results.push({
        filename: label,
        ok: false,
        error: "Filename must use only letters, numbers, - or _, end in .js, and can't be manifest.js.",
      });
      continue;
    }
    if (file.size > MAX_SIZE) {
      results.push({ filename, ok: false, error: "File is larger than 2MB." });
      continue;
    }

    const dest = path.join(CONTENT_ROOT, subject, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    results.push({ filename, ok: true });
    savedAny = true;
  }

  if (savedAny) {
    regenerateManifest(subject);
  }

  return NextResponse.json({ ok: results.every((r) => r.ok), results });
}
