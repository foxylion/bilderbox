export interface AuthenticationProvider {
  isAuthenticated: () => Promise<boolean>;
  authenticate: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string>;
}
