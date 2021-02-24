import { Client as MSGraphClient, PageIterator } from '@microsoft/microsoft-graph-client';
import * as MSGraph from '@microsoft/microsoft-graph-types';
import { get, set } from 'idb-keyval';
import { Image } from '..';
import { MicrosoftAuthenticationProvider } from '../../../util/authentication/microsoft';

const authentication = new MicrosoftAuthenticationProvider();
const client = MSGraphClient.initWithMiddleware({
  authProvider: { getAccessToken: authentication.getAccessToken },
});

export class ImageFetcher {
  private pendingItems: MSGraph.DriveItem[] = [];
  private foundItems: MSGraph.DriveItem[] = [];

  private status: ((fetchedItems: number, itemsToFetch: number) => void) | undefined;

  public constructor(config: { status: ((fetchedItems: number, itemsToFetch: number) => void) | undefined }) {
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
      id: `${this.getDriveId(item)}:${this.getItemId(item)}`,
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
    let item = this.pendingItems.shift();
    while (item) {
      if (item.folder) {
        const cachedItems = await get<MSGraph.DriveItem[]>(`children:${this.getDriveId(item)}:${this.getItemId(item)}`);
        if (cachedItems) {
          this.pendingItems.push(...cachedItems);
        } else {
          const items = await this.fetchAllChildren(item);
          await set(`children:${this.getDriveId(item)}:${this.getItemId(item)}`, items);
          this.pendingItems.push(...items);
        }
      } else if (item.remoteItem) {
        const remoteItem = await this.graphGet<MSGraph.DriveItem>(this.getItemPath(item));
        this.pendingItems.push(remoteItem);
      } else if (item.file) {
        this.foundItems.push(item);
      } else {
        console.error('Found an unknown item.', item);
      }
      item = this.pendingItems.shift();
      this.status && this.status(this.foundItems.length, this.pendingItems.length);
    }
  };

  private fetchAllChildren = async (item: MSGraph.DriveItem): Promise<MSGraph.DriveItem[]> => {
    const result: MSGraph.DriveItem[] = [];
    const itemPath = this.getItemPath(item);
    const children = await this.graphGet<DriveItemChildren>(`${itemPath}/children`);
    const iterator = new PageIterator(client, children, (data: MSGraph.DriveItem) => {
      result.push(data);
      return true;
    });
    await iterator.iterate();
    return result;
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
