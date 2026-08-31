// An `images` entry: { caption?, src, alt? } — a real picture file, uploaded
// separately via Admin → Images (see CONTENT-GUIDE.md "images") and
// referenced here by filename only. `src` resolves to
// /content-images/<subject>/<src>, a static file under public/. This is the
// one visual field an AI writing the content file can't fulfill on its
// own — it can only write the reference, a human has to upload the actual
// picture.
export default function FigureImage({ image, subject }) {
  if (!image?.src) return null;
  return (
    <div className="rounded-2xl border border-foreground/10 p-5">
      {image.caption && (
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{image.caption}</p>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- runtime-uploaded file with arbitrary dimensions, not a build-time asset */}
      <img
        src={`/content-images/${subject}/${image.src}`}
        alt={image.alt || image.caption || "figure"}
        className={"mx-auto max-h-[480px] w-auto max-w-full rounded-lg" + (image.caption ? " mt-2" : "")}
      />
    </div>
  );
}
