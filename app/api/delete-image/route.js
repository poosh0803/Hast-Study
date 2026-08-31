import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { SUBJECTS } from "@/lib/content-manifest";
import { isValidImageFilename, subjectImageDir } from "@/lib/content-images";

export const runtime = "nodejs";

// Accepts either { items: [{ subject, filename }, ...] } for a bulk delete,
// or the older { subject, filename } shape for a single one — same as
// delete-content/route.js.
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

  for (const item of items) {
    const subject = item?.subject;
    const filename = item?.filename;

    if (typeof subject !== "string" || !SUBJECTS[subject]) {
      results.push({ subject, filename, ok: false, error: "Unknown subject." });
      continue;
    }
    if (typeof filename !== "string" || !isValidImageFilename(filename)) {
      results.push({ subject, filename, ok: false, error: "Invalid filename." });
      continue;
    }

    const target = path.join(subjectImageDir(subject), filename);
    if (!fs.existsSync(target)) {
      results.push({ subject, filename, ok: false, error: "File not found." });
      continue;
    }

    fs.unlinkSync(target);
    results.push({ subject, filename, ok: true });
  }

  return NextResponse.json({ ok: results.every((r) => r.ok), results });
}
