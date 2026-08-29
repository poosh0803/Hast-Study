import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { SUBJECTS, regenerateManifest } from "@/lib/content-manifest";

export const runtime = "nodejs";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const FILENAME_RE = /^[a-zA-Z0-9_-]+\.js$/;

// Accepts either { items: [{ subject, filename }, ...] } for a bulk delete,
// or the older { subject, filename } shape for a single one.
function normalizeItems(body) {
  if (Array.isArray(body?.items)) return body.items;
  if (typeof body?.subject === "string" && typeof body?.filename === "string") {
    return [{ subject: body.subject, filename: body.filename }];
  }
  return [];
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const items = normalizeItems(body);

  if (items.length === 0) {
    return NextResponse.json({ error: "No files specified." }, { status: 400 });
  }

  const results = [];
  const touchedSubjects = new Set();

  for (const item of items) {
    const subject = item?.subject;
    const filename = item?.filename;

    if (typeof subject !== "string" || !SUBJECTS[subject]) {
      results.push({ subject, filename, ok: false, error: "Unknown subject." });
      continue;
    }
    if (typeof filename !== "string" || !FILENAME_RE.test(filename) || filename === "manifest.js") {
      results.push({ subject, filename, ok: false, error: "Invalid filename." });
      continue;
    }

    const target = path.join(CONTENT_ROOT, subject, filename);
    if (!fs.existsSync(target)) {
      results.push({ subject, filename, ok: false, error: "File not found." });
      continue;
    }

    fs.unlinkSync(target);
    results.push({ subject, filename, ok: true });
    touchedSubjects.add(subject);
  }

  for (const subject of touchedSubjects) {
    regenerateManifest(subject);
  }

  return NextResponse.json({ ok: results.every((r) => r.ok), results });
}
