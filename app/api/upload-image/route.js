import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { SUBJECTS } from "@/lib/content-manifest";
import { ensureSubjectImageDir, isValidImageFilename, MAX_IMAGE_SIZE } from "@/lib/content-images";

export const runtime = "nodejs";

// Accepts one or more real image files under the same "file" field, for a
// subject's picture pool — separate from upload-content's .js files. Each
// is validated and saved independently, same batch-tolerant shape as
// upload-content/route.js. Nothing here regenerates a manifest: images
// aren't content-file entries themselves, just static assets a content
// file's `images[].src` can later reference by filename.
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

  const dir = ensureSubjectImageDir(subject);
  const results = [];

  for (const file of files) {
    const filename = path.basename(file.name || "");
    const label = filename || file.name || "(unnamed)";

    if (!isValidImageFilename(filename)) {
      results.push({
        filename: label,
        ok: false,
        error: "Filename must use only letters, numbers, - or _, and end in .png/.jpg/.jpeg/.webp/.gif/.svg.",
      });
      continue;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      results.push({ filename, ok: false, error: "File is larger than 8MB." });
      continue;
    }

    const dest = path.join(dir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    results.push({ filename, ok: true });
  }

  return NextResponse.json({ ok: results.every((r) => r.ok), results });
}
