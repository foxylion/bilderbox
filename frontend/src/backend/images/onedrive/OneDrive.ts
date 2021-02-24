import { ImageBackend } from '..';
import { ImageFetcher } from './ImageFetcher';

export class OneDrive implements ImageBackend {
  public listAllFiles = async (status: ((fetchedItems: number, itemsToFetch: number) => void) | undefined) => {
    const fetcher = new ImageFetcher({ status });
    fetcher.start(5);
    return await fetcher.getResult();
  };
}
