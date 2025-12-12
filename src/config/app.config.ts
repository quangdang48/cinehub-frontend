export type AppConfig = {
  apiPrefix: string;
  googleClientId: string;
  googleRedirectUri: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
};

const appConfig: AppConfig = {
  apiPrefix: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || "",
  authenticatedEntryPath: "/",
  unAuthenticatedEntryPath: "/login",
};

export default appConfig;
