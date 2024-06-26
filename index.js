const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const PORT = 8000;

const BASE_PATH =
  "https://vercel-clone-s3-ritesh.s3.ap-south-1.amazonaws.com/__outputs";

const proxy = httpProxy.createProxy();

app.use("/:subdomain", (req, res) => {
  console.log("data", req.originalUrl);
  const subdomain = req.originalUrl;

  // Custom Domain - DB Query

  const resolvesTo = `${BASE_PATH}${subdomain}`;

  console.log(resolvesTo);
  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  console.log("req url", url);
  console.log("call", proxyReq.path);
  if (url === "/") {
    console.log("if call");
    proxyReq.path += "index.html";
  } else {
    const splitUrl = url.split("/");
    const pathSplit = proxyReq.path.split("/");
    for (let i = 0; i < splitUrl.length - 1; i++) {
      pathSplit.pop();
    }
    proxyReq.path = pathSplit.join("/");
  }
  console.log("final", proxyReq.path);
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
