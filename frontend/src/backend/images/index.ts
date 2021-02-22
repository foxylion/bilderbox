export interface ImageBackend {
  listAllFiles: (status: ((fetchedItems: number, itemsToFetch: number) => void) | undefined) => Promise<Image[]>;
}

export interface Image {
  id: string;
  name: string;
  size: number;
  path: string;
}
