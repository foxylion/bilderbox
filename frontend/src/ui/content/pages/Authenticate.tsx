import * as React from 'react';

const msalConfig = {
  auth: {
    clientId: 'your_client_id', // Client Id of the registered application
    redirectUri: 'your_redirect_uri',
  },
};
const graphScopes = ['user.read', 'mail.send']; // An array of graph scopes

// Important Note: This library implements loginPopup and acquireTokenPopup flow, remember this while initializing the msal
// Initialize the MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js#1-instantiate-the-useragentapplication
const msalApplication = new Msal.UserAgentApplication(msalConfig);
const options = new MicrosoftGraph.MSALAuthenticationProviderOptions(graphScopes);
const authProvider = new MicrosoftGraph.ImplicitMSALAuthenticationProvider(msalApplication, options);

export const Authenticate: React.FC = () => {
  return <div></div>;
};
