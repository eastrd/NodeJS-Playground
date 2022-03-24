const envExport = require("./config");
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");


const listener = (req, res) => {
  const parsedURL = url.parse(req.url, true);
  const path = parsedURL.pathname;

  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryStringObject = parsedURL.query;
  const headers = req.headers;

  const method = req.method.toLowerCase();

  const decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    const data = {
      method,
      headers,
      trimmedPath,
    };

    // Handle requests routing, default to 404 if not found
    const chosenHandler = router[trimmedPath] ?? handlers.notFound;

    const cb = (statusCode, payload) => {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);

      if (statusCode === 200) {
        res.end(JSON.stringify(data));
      }
        
      if (statusCode === 404) {
        res.end("Ops, end of the world");
      }
    };

    chosenHandler(data, cb);
  });
}

const httpServer = http.createServer(listener);

const sslOpts = {
  key: fs.readFileSync("certs/key.pem"),
  cert: fs.readFileSync("certs/cert.pem")
};
const httpsServer = https.createServer(sslOpts, listener);


httpServer.listen(envExport.portHTTP, () => {
  console.log(`${envExport.name} HTTP server is listening on port ${envExport.portHTTP}`);
});
httpsServer.listen(envExport.portHTTPS, () => {
  console.log(`${envExport.name} HTTPS server is listening on port ${envExport.portHTTPS}`);
});


const handlers = {};
handlers.sample = (data, cb) => {
  cb(200, {"name": "sample handler"});
};
handlers.notFound = (data, cb) => {
  cb(404);
};

const router = {
  "sample": handlers.sample,
};