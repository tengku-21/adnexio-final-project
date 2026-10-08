export type DocumentItem = {
  id: number;
  disk?: string;
  path: string;
  original_name?: string | null;
  mime_type?: string | null;
  size?: number | null;
  url?: string | null;
};

export type DocumentOwnerType = "order" | "package" | "payment";

export type DocumentEditGalleryProps = {
  type: DocumentOwnerType;
  itemId: number;
  documents?: DocumentItem[] | null;
  onChange?: () => void; // called after an upload or delete, e.g. refetch
  accept?: string;
  maxSizeMB?: number;
  readOnly?: boolean; // hides upload and delete
  className?: string;
};

export type DocumentGalleryProps = {
  documents?: DocumentItem[] | null;
  emptyMessage?: string | null; // pass null to render nothing when empty
  className?: string;
};