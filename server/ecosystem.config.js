module.exports = {
  apps: [
    {
      name: "social-media",
      script: "./dist/app.js",
      node_args: "--env-file=.env.production",
    },
  ],
};
