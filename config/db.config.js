const config = {
  dbHost: process.env.DB_HOST ?? "127.0.0.1",
  dbPort: process.env.DB_PORT ?? "27017",
  dbName: process.env.DB_NAME ?? "social-media-local",
  dbUsername: process.env.DB_USERNAME ?? "",
  dbPassword: process.env.DB_PASSWORD ?? "",
};

const dbAuth =
  config.dbUsername && config.dbPassword
    ? `${encodeURIComponent(config.dbUsername)}:${encodeURIComponent(
        config.dbPassword
      )}@`
    : "";

export default {
  connectionUrl: `mongodb://${dbAuth}${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=admin`,
};
