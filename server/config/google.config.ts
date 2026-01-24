export const googleOAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  callbackEndpoint: process.env.GOOGLE_CALLBACK_ENDPOINT ?? "",
};