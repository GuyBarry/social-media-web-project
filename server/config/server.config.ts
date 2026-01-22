export const serverConfig = {
  port: Number(process.env.SERVER_PORT ?? 8000),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "mayanmayan",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "guyguyguy",
  authorizationHeader: "authorization",
};
