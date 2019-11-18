#!/usr/bin/env node

const path = require("path");
const webpack = require("webpack");
const { fork } = require("child_process");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") });

const webpackConfig = require("../webpack.config.js");

const compiler = webpack(webpackConfig);
let serverProcess = null;

console.log("Lauching Webpack watch...");
compiler.watch({}, (err, stats) => {
  if (err) {
    console.error("Webpack failure");
    console.error(err);
    process.exit(1);
  }
  console.log(stats.toString());
  if (!serverProcess && !stats.hasErrors()) {
    console.log("Launching built server...");
    serverProcess = fork("./build/server.js");
  }
});
