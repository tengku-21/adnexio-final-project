import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from "@/components/ui/dialog";

import {useCreateDocumentMutation,useDeleteDocumentMutation} from "@/APIs/document/documentsApi";
import type { DocumentEditGalleryProps, DocumentItem, DocumentOwnerType } from "@/types/documentType";


// type -> the field the backend expects
const OWNER_FIELD: Record<DocumentOwnerType, "order_id" | "package_id" | "payment_id"> = {
  order: "order_id",
  package: "package_id",
  payment: "payment_id",
};


const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
const PDF_EXT = /\.pdf$/i;

const getUrl = (doc: DocumentItem) =>
  doc.url ??
  `${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${doc.path}`;

const getName = (doc: DocumentItem) =>
  doc.original_name || doc.path.split("/").pop() || "Document";

// Extension first, because mime_type in the data can be wrong
const isImage = (doc: DocumentItem) =>
  IMAGE_EXT.test(getName(doc)) || Boolean(doc.mime_type?.startsWith("image/"));

const getLabel = (doc: DocumentItem) =>
  PDF_EXT.test(getName(doc)) || doc.mime_type === "application/pdf"
    ? "PDF"
    : getName(doc).split(".").pop()?.slice(0, 4).toUpperCase() || "FILE";

const formatSize = (bytes?: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DocumentEditGallery({
  type,
  itemId,
  documents,
  onChange,
  accept = "image/*,application/pdf",
  maxSizeMB = 10,
  readOnly = false,
  className = "",
}: DocumentEditGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [createDocument] = useCreateDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<DocumentItem | null>(null);
  const [toDelete, setToDelete] = useState<DocumentItem | null>(null);

  const docs = documents ?? [];

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = ""; // lets the same file be picked again later

    if (selected.length === 0) return;
    setError("");

    const tooBig = selected.find((file) => file.size > maxSizeMB * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than ${maxSizeMB} MB.`);
      return;
    }

    setUploading(true);

    const failed: string[] = [];
    let uploaded = 0;

    // One request per file, because the API takes a single `file`
    for (const file of selected) {
      try {
        await createDocument({
          file,
          [OWNER_FIELD[type]]: itemId,
        }).unwrap();
        uploaded++;
      } catch {
        failed.push(file.name);
      }
    }

    setUploading(false);

    if (failed.length > 0) {
      setError(`Failed to upload: ${failed.join(", ")}`);
    }

    if (uploaded > 0) onChange?.();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setError("");

    try {
      await deleteDocument(toDelete.id).unwrap();
      setToDelete(null);
      onChange?.();
    } catch (err: any) {
      setToDelete(null);
      setError(err?.data?.message || "Failed to delete document.");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {docs.map((doc) => {
          const image = isImage(doc);

          const content = (
            <>
              <div className="aspect-square overflow-hidden bg-muted">
                {image ? (
                  <img
                    src={getUrl(doc)}
                    alt={getName(doc)}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1">
                    <span className="rounded bg-background px-2 py-1 text-xs font-semibold text-muted-foreground">
                      {getLabel(doc)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatSize(doc.size)}
                    </span>
                  </div>
                )}
              </div>

              <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                {getName(doc)}
              </p>
            </>
          );

          return (
            <div
              key={doc.id}
              className="group relative overflow-hidden rounded-md border"
            >
              {image ? (
                <button
                  type="button"
                  onClick={() => setPreview(doc)}
                  className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {content}
                </button>
              ) : (
                <a
                  href={getUrl(doc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {content}
                </a>
              )}

              {!readOnly && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1.5 top-1.5 h-7 w-7"
                  onClick={() => setToDelete(doc)}
                  aria-label={`Delete ${getName(doc)}`}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                </Button>
              )}
            </div>
          );
        })}

        {/* Add tile */}
        {!readOnly && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <HugeiconsIcon icon={Loading03Icon} size={20} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Add01Icon} size={20} />
                Add file
              </>
            )}
          </button>
        )}
      </div>

      {docs.length === 0 && readOnly && (
        <p className="text-sm text-muted-foreground">No documents uploaded.</p>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFiles}
        className="hidden"
      />

      {/* Image preview */}
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
              src={getUrl(preview)}
              alt={getName(preview)}
              className="max-h-[75vh] w-full rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && !isDeleting && setToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete document?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">
                {toDelete ? getName(toDelete) : ""}
              </span>{" "}
              will be permanently removed. This can't be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={18}
                    className="mr-2 animate-spin"
                  />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}