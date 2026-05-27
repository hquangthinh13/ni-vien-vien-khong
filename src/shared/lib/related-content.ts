type WithDocumentId = {
  documentId: string;
};

interface MergeRelatedItemsOptions<T extends WithDocumentId> {
  manualItems: T[];
  latestItems: T[];
  currentDocumentId: string;
  limit?: number;
}

export function mergeRelatedItems<T extends WithDocumentId>({
  manualItems,
  latestItems,
  currentDocumentId,
  limit = 5,
}: MergeRelatedItemsOptions<T>): T[] {
  const merged: T[] = [];
  const seen = new Set<string>();

  const pushIfValid = (item: T) => {
    if (!item?.documentId || item.documentId === currentDocumentId) return;
    if (seen.has(item.documentId)) return;
    seen.add(item.documentId);
    merged.push(item);
  };

  manualItems.forEach(pushIfValid);
  latestItems.forEach(pushIfValid);

  return merged.slice(0, limit);
}
