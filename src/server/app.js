import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
// import pathRegexp from "path-to-regexp";
import flash from "connect-flash";
// import setupWebpackHotReload from "server/middleware/setupWebpackHotReload";
// require("util").inspect.defaultOptions.depth = null;
import setupWebpackHotReload from "server/middleware/setupWebpackHotReload";
import compression from "compression";
const app = express();

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(compression());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(require("server/middleware/health").default);
app.use(
  "/dist",
  require("server/middleware/widgetLoaders").default,
  express.static(path.join(__dirname, "dist"))
);
app.use("/public", express.static("public"));
// app.use("/sandbox", require("server/middleware/sandbox").default);
app.use("/api", require("server/middleware/api").default);
app.use("/api/v1", require("server/middleware/externalAPI/v1").default);

if (process.env.NODE_ENV === "development") {
  setupWebpackHotReload(app);
}
app.use("/", require("server/middleware/web").default);

export default app;

if (module.hot) {
  module.hot.accept();
}
