import { Client as MSGraphClient } from '@microsoft/microsoft-graph-client';
import * as MSGraph from '@microsoft/microsoft-graph-types';

import { ImageBackend } from '..';
import { MicrosoftAuthenticationProvider } from '../../../util/authentication/microsoft';
import { ImageFetcher } from './ImageFetcher';

const authentication = new MicrosoftAuthenticationProvider();
const client = MSGraphClient.initWithMiddleware({
  authProvider: { getAccessToken: authentication.getAccessToken },
});

export class OneDrive implements ImageBackend {
  public listAllFiles = async (status: ((fetchedItems: number, itemsToFetch: number) => void) | undefined) => {
    const root = await this.graphGet<MSGraph.DriveItem>('/me/drive');

    const fetcher = new ImageFetcher({ ownerDriveId: root.id!, status });
    fetcher.start(10);
    return await fetcher.getResult();
  };

  private graphGet = async <T>(path: string): Promise<T> => {
    return (await client.api(path).get()) as T;
  };
}
