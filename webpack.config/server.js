const path = require("path");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const nodeConfig = require("./node");
const globImporter = require("node-sass-glob-importer");

const commonConfig = merge.smartStrategy({
  "module.rules": "append",
  "resolve.extensions": "append"
})(nodeConfig, {
  entry: [
    "@babel/polyfill",
    "isomorphic-fetch",
    "./config/dotenv.js",
    "./src/server/index.js"
  ],
  output: {
    path: path.resolve("./build"),
    filename: "server.js"
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "dist/images/",
              publicPath: "/"
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: { importer: globImporter() }
          }
        ]
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: {
          loader: "pug-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".pug"],
    alias: {
      "ui/store/actions/runSearch": "ui/store/actions/runSearch.server.js"
    }
  }
});

const developmentConfig = merge.smartStrategy({
  entry: "prepend",
  plugins: "append"
})(commonConfig, {
  entry: ["webpack/hot/poll?1000"],
  externals: nodeExternals({ whitelist: ["webpack/hot/poll?1000"] }),
  plugins: [new webpack.HotModuleReplacementPlugin()]
});

const productionConfig = merge(commonConfig, {
  externals: nodeExternals()
});

module.exports =
  process.env.NODE_ENV == "production" ? productionConfig : developmentConfig;
