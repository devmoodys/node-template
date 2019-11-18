const path = require("path");
const webpack = require("webpack");

const nodeConfig = {
  module: {
    rules: [
      {
        test: /\.js.?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
    modules: [path.resolve("./src"), "node_modules"]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ],
  devtool: "source-map",
  target: "node",
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
};

module.exports = nodeConfig;
