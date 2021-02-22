import * as React from 'react';

import { Client as MSGraphClient } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { useParams } from 'react-router';

import { MicrosoftAuthenticationProvider } from '../../../util/authentication/microsoft';

export const Test: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const [result, setResult] = React.useState<any>();

  React.useEffect(() => {
    (async () => {
      const authentication = new MicrosoftAuthenticationProvider();
      const client = MSGraphClient.initWithMiddleware({
        authProvider: { getAccessToken: authentication.getAccessToken },
      });
      const result = (await client.api(path).get()) as MicrosoftGraph.User;
      setResult(result);
    })();
  }, [path]);
  return <pre>{JSON.stringify(result, undefined, 2)}</pre>;
};

// Root of drive: https://docs.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0&tabs=http#list-children-of-a-driveitem-with-a-known-id
// Example: https://localhost:3000/test/me/drive/root/children

// Files on own drive: https://docs.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0&tabs=http#list-children-in-the-root-of-the-current-users-drive
// Example: https://localhost:3000/test/me/drive/items/9C931AD91DD004A4!3872/children

// Shared drive: https://docs.microsoft.com/en-us/onedrive/developer/rest-api/concepts/using-sharing-links?view=odsp-graph-online#enumerate-the-contents-of-a-shared-folder
// Example: https://localhost:3000/test/drives/810805efb9fe5085/items/810805EFB9FE5085!105/children
