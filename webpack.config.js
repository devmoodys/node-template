const path = require("path");

const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  target: "node",
  entry: "./app.js",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist")
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()]
};
