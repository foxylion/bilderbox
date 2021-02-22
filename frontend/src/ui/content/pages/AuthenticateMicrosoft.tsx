import * as React from 'react';

import { Client as MSGraphClient } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import { MicrosoftAuthenticationProvider } from '../../../util/authentication/microsoft';

export const AuthenticateMicrosoft: React.FC = () => {
  const [result, setResult] = React.useState<MicrosoftGraph.User>();
  React.useEffect(() => {
    (async () => {
      const authentication = new MicrosoftAuthenticationProvider();
      const client = MSGraphClient.initWithMiddleware({
        authProvider: { getAccessToken: authentication.getAccessToken },
      });
      const result = (await client.api('/me').get()) as MicrosoftGraph.User;
      setResult(result);
    })();
  }, []);
  return <pre>{JSON.stringify(result, undefined, 2)}</pre>;
};
