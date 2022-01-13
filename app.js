const { createReadStream, statSync } = require("fs");
const http = require("http");
const server = http.createServer();
const port_ = process.env.PORT || "5400";
const static_ = `${__dirname}/public`;
//server
server.on("request", (req, res) => {
  const sendStaticStream = (contentType, extentionPath) => {
    res.writeHead(200, { "Content-type": contentType });
    createReadStream(`${static_}${extentionPath}`).pipe(res);
  };

  switch (req.url) {
    case "/":
      sendStaticStream("text/html", "/index.html");
      break;

    case "/css/enStyle.css":
      sendStaticStream("text/css", "/css/enStyle.css");
      break;

    case "/css/style.css":
      sendStaticStream("text/css", "/css/style.css");
      break;

    case "/js/selectors_.js":
      sendStaticStream("text/javascript", "/js/selectors_.js");
      break;

    case "/js/progressBAR_FTC.js":
      sendStaticStream("text/javascript", "/js/progressBAR_FTC.js");
      break;

    case "/js/app.js":
      sendStaticStream("text/javascript", "/js/app.js");
      break;

    case "/json/quran/":
      const mainPTH = `${req.url}${req.headers["content-local-path"]}`;
      const fullPTH = `${static_}${mainPTH}`;
      const size_ = statSync(fullPTH).size;

      res.writeHead(200, {
        "Content-type": "application/json",
        "Content-Length": size_,
      });

      createReadStream(fullPTH).pipe(res);
      break;

    case "/json/quran/surah_Index.json":
      const fullPTH_1 = `${static_}/json/quran/surah_Index.json`;
      const size_1 = statSync(fullPTH_1).size;

      res.writeHead(200, {
        "Content-type": "application/json",
        "Content-Length": size_1,
      });

      createReadStream(fullPTH_1).pipe(res);
      break;

    default:
      sendStaticStream("text/html", "/404.html");
      break;
  }
});

server.listen(port_, () => {
  console.log(`listening on port: ${port_} | ${Date()}`);
});
