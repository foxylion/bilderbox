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
