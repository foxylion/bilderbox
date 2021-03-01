import { Configuration, PublicClientApplication } from '@azure/msal-browser';
import { AuthenticationProvider } from '.';
import { baseUrl } from '../baseUrl';

export class MicrosoftAuthenticationProvider implements AuthenticationProvider {
  private msalConfig: Configuration = {
    auth: {
      clientId: 'df346ab3-6ba2-4c7a-a4b6-96986093b576',
      redirectUri: baseUrl,
    },
    cache: {
      cacheLocation: 'localStorage',
    },
  };

  private scopes = ['User.Read', 'Files.ReadWrite.All', 'offline_access'];
  private application = new PublicClientApplication(this.msalConfig);

  public authenticate = async (): Promise<void> => {
    if (!window.location.hash.startsWith('#code=')) {
      if (!(await this.isAuthenticated())) {
        this.application.acquireTokenRedirect({ scopes: this.scopes, account: this.application.getAllAccounts()[0] });
      }
    } else {
      const result = await this.application.handleRedirectPromise();
      if (!result) {
        throw new Error('Failed to authenticate, result ist NULL');
      }
    }
  };

  public isAuthenticated = async (): Promise<boolean> => {
    try {
      await this.application.acquireTokenSilent({
        account: this.application.getAllAccounts()[0],
        scopes: this.scopes,
      });
      return true;
    } catch (e) {
      return false;
    }
  };

  public getAccessToken = async (): Promise<string> => {
    try {
      const result = await this.application.acquireTokenSilent({
        account: this.application.getAllAccounts()[0],
        scopes: this.scopes,
      });
      return result.accessToken;
    } catch (e) {
      throw new Error('Failed to get access token, try sign-in again.');
    }
  };

  public logout = async () => {
    await this.application.logout();
  };
}
