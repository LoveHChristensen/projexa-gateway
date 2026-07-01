import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const PORT = Number(process.env.PORT) || 10000;

const upstreams = {
  main:
    process.env.MAIN_UPSTREAM ??
    "https://projectmanager-m9k9.onrender.com",
  afterglow:
    process.env.AFTERGLOW_UPSTREAM ??
    "https://afterglow-0cb6.onrender.com",
  ontherocks:
    process.env.ONTHEROCKS_UPSTREAM ??
    "https://ontherocks.onrender.com",
};

function createRouteProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq) => {
        const targetUrl = new URL(target);
        proxyReq.setHeader("host", targetUrl.host);
      },
      error: (error, req, res) => {
        console.error(`Proxy error for ${req.url}:`, error.message);
        if (!res.headersSent) {
          res.writeHead(502, { "Content-Type": "text/plain" });
        }
        res.end("Bad Gateway");
      },
    },
  });
}

const app = express();

app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

for (const prefix of ["/afterglow", "/ontherocks"]) {
  app.use(`${prefix}/`, createRouteProxy(upstreams[prefix.slice(1)]));
  app.get(prefix, (_req, res) => {
    res.redirect(301, `${prefix}/`);
  });
}

app.use("/", createRouteProxy(upstreams.main));

app.listen(PORT, () => {
  console.log(`projexa-gateway listening on port ${PORT}`);
  for (const [name, url] of Object.entries(upstreams)) {
    console.log(`  ${name}: ${url}`);
  }
});
