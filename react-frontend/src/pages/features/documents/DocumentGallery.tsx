import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DocumentGalleryProps, DocumentItem } from "@/types/documentType";

type Kind = "image" | "video" | "pdf" | "file";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|ogg)$/i;
const PDF_EXT = /\.pdf$/i;

const getUrl = (path: string) =>
  `${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${path}`;

const getName = (doc: DocumentItem) =>
  doc.original_name || doc.path.split("/").pop() || "Document";

// Extension is checked first, because mime_type in the data can be wrong
// (e.g. side.jpeg stored as image/png)
const getKind = (doc: DocumentItem): Kind => {
  const name = getName(doc);
  const mime = doc.mime_type ?? "";

  if (IMAGE_EXT.test(name) || mime.startsWith("image/")) return "image";
  if (VIDEO_EXT.test(name) || mime.startsWith("video/")) return "video";
  if (PDF_EXT.test(name) || mime === "application/pdf") return "pdf";
  return "file";
};

const formatSize = (bytes?: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DocumentGallery({
  documents,
  emptyMessage = "No documents uploaded.",
  className = "",
}: DocumentGalleryProps) {
  const [preview, setPreview] = useState<DocumentItem | null>(null);

  const docs = documents ?? [];

  if (docs.length === 0) {
    return emptyMessage ? (
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    ) : null;
  }

  const images = docs.filter((doc) => getKind(doc) === "image");
  const videos = docs.filter((doc) => getKind(doc) === "video");
  const files = docs.filter((doc) => {
    const kind = getKind(doc);
    return kind === "pdf" || kind === "file";
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Images: thumbnail grid, click to enlarge */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => setPreview(doc)}
              className="group overflow-hidden rounded-md border bg-muted text-left focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={doc.url ?? getUrl(doc.path)}
                  alt={getName(doc)}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>

              <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                {getName(doc)}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Videos: inline player */}
      {videos.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {videos.map((doc) => (
            <div key={doc.id} className="overflow-hidden rounded-md border">
              <video
                src={getUrl(doc.path)}
                controls
                preload="metadata"
                className="aspect-video w-full bg-black"
              />
              <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                {getName(doc)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* PDFs and other files: link list */}
      {files.length > 0 && (
        <ul className="divide-y rounded-md border">
          {files.map((doc) => (
            <li key={doc.id}>
              <a
                href={getUrl(doc.path)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3 text-sm hover:bg-muted/50"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                    {getKind(doc) === "pdf"
                      ? "PDF"
                      : getName(doc).split(".").pop()?.slice(0, 4) || "FILE"}
                  </span>
                  <span className="truncate font-medium">{getName(doc)}</span>
                </span>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatSize(doc.size)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Image preview popup */}
      <Dialog
        open={Boolean(preview)}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-6">
              {preview ? getName(preview) : ""}
            </DialogTitle>
          </DialogHeader>

          {preview && (
            <img
              src={getUrl(preview.path)}
              alt={getName(preview)}
              className="max-h-[75vh] w-full rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}