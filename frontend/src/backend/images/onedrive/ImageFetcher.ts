import { Client as MSGraphClient } from '@microsoft/microsoft-graph-client';
import * as MSGraph from '@microsoft/microsoft-graph-types';
import { Image } from '..';
import { MicrosoftAuthenticationProvider } from '../../../util/authentication/microsoft';

const authentication = new MicrosoftAuthenticationProvider();
const client = MSGraphClient.initWithMiddleware({
  authProvider: { getAccessToken: authentication.getAccessToken },
});

export class ImageFetcher {
  private pendingItems: MSGraph.DriveItem[] = [];
  private foundItems: MSGraph.DriveItem[] = [];

  private ownerDriveId: string;
  private status: ((fetchedItems: number, itemsToFetch: number) => void) | undefined;

  public constructor(config: {
    ownerDriveId: string;
    status: ((fetchedItems: number, itemsToFetch: number) => void) | undefined;
  }) {
    this.ownerDriveId = config.ownerDriveId;
    this.status = config.status;
  }

  public start = async (forkCount: number) => {
    const children = await this.graphGet<DriveItemChildren>('/me/drive/root/children');
    this.pendingItems.push(...children.value);

    for (let i = 0; i < forkCount; i++) {
      setTimeout(() => {
        this.fetchItem();
      }, 0);
    }
  };

  public getResult = async (): Promise<Array<Image>> => {
    await this.waitForCompletion();
    return this.foundItems.map((item) => ({
      id: `${this.getDriveId(item)}/${this.getItemId(item)}`,
      name: item.name!,
      size: item.size!,
      path: `${item.parentReference?.path}/${item.name}`,
    }));
  };

  private waitForCompletion = (): Promise<void> =>
    new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (this.foundItems.length > 0 && this.pendingItems.length === 0) {
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
    });

  private fetchItem = async () => {
    this.status && this.status(this.foundItems.length, this.pendingItems.length);

    if (this.foundItems.length > 100) {
      // Return early for testing purposes
      this.pendingItems = [];
      return;
    }

    const item = this.pendingItems.shift();
    if (item) {
      const itemPath = this.getItemPath(item);
      const fetchedItem = await this.graphGet<MSGraph.DriveItem>(`${itemPath}`);

      if (fetchedItem.folder) {
        const children = await this.graphGet<DriveItemChildren>(`${itemPath}/children`);
        this.pendingItems.push(...children.value);
      } else if (fetchedItem.file) {
        this.foundItems.push(fetchedItem);
      } else {
        console.error('Found an unknown item.', fetchedItem);
      }

      // Call recursively until no more items are in list
      await this.fetchItem();
    }
  };

  private getDriveId = (item: MSGraph.DriveItem) =>
    item.remoteItem?.parentReference?.driveId
      ? item.remoteItem?.parentReference?.driveId
      : item.parentReference?.driveId;

  private getItemId = (item: MSGraph.DriveItem) => (item.remoteItem?.id ? item.remoteItem?.id : item.id);

  private getItemPath = (item: MSGraph.DriveItem) => `/drives/${this.getDriveId(item)}/items/${this.getItemId(item)}`;

  private graphGet = async <T>(path: string): Promise<T> => {
    return (await client.api(path).get()) as T;
  };
}

type DriveItemChildren = { value: MSGraph.DriveItem[] };
