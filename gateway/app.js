const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

app.use(
  "/api/users",
  proxy("http://localhost:3001", {
    proxyReqPathResolver: (req) => req.originalUrl,
  }),
);

app.use(
  "/api/captains",
  proxy("http://localhost:3002", {
    proxyReqPathResolver: (req) => req.originalUrl,
  }),
);

app.use(
  "/api/rides",
  proxy("http://localhost:3003", {
    proxyReqPathResolver: (req) => req.originalUrl,
  }),
);

app.listen(3000, () => {
  console.log("Gateway is running on http://localhost:3000");
});
