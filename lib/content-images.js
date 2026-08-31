import fs from "node:fs";
import path from "node:path";
import { SUBJECTS } from "@/lib/content-manifest";

const IMAGE_ROOT = path.join(process.cwd(), "public", "content-images");
const FILENAME_RE = /^[a-zA-Z0-9_-]+\.(png|jpe?g|webp|gif|svg)$/i;

export const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB — real photos/scans, bigger than content-file text.

export function isValidImageFilename(filename) {
  return FILENAME_RE.test(filename);
}

export function subjectImageDir(subject) {
  return path.join(IMAGE_ROOT, subject);
}

export function ensureSubjectImageDir(subject) {
  const dir = subjectImageDir(subject);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Every uploaded image across all four subjects, as
// { subject, filename, url } — used by the Admin tab's image list.
// `url` is the static public/ path a content file's `images[].src` (a bare
// filename) resolves to at render time.
export function listContentImages() {
  const files = [];
  for (const subject of Object.keys(SUBJECTS)) {
    const dir = subjectImageDir(subject);
    if (!fs.existsSync(dir)) continue;
    const entries = fs
      .readdirSync(dir)
      .filter((f) => isValidImageFilename(f))
      .sort();
    for (const filename of entries) {
      files.push({ subject, filename, url: `/content-images/${subject}/${filename}` });
    }
  }
  return files;
}
