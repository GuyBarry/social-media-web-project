export const serverConfig = {
  port: Number(process.env.SERVER_PORT ?? 8000),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "mayanmayan",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "guyguyguy",
  authorizationHeader: "authorization",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  environment: process.env.NODE_ENV ?? "dev",
  serverUrl: process.env.SERVER_URL ?? "http://localhost:8000",
};
