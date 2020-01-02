const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const globImporter = require("node-sass-glob-importer");

const commonConfig = {
  entry: {
    app: ["./src/ui/entryClient.jsx"],
    vendor: [
      "@babel/polyfill",
      "react",
      "react-dom",
      "prop-types",
      "redux",
      "redux-thunk",
      "redux-logger",
      "redux-form"
    ]
  },
  output: {
    path: path.resolve("./build/dist"),
    publicPath: "/dist/",
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js.?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
              publicPath: "/dist/"
            }
          }
        ]
      },
      {
        test: /\.(otf|woff2|ttf|woff|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
              publicPath: "/dist/"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
    modules: [path.resolve("./src"), "node_modules"],
    alias: {
      "ui/store/actions/runSearch": "ui/store/actions/runSearch.client.js"
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new ManifestPlugin({ fileName: "../manifest.json" }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      minChunks: Infinity
    })
  ],
  devtool: "eval-source-map"
};

const developmentConfig = merge.smartStrategy({
  "entry.app": "prepend",
  "moudle.rules.use": "replace"
})(commonConfig, {
  entry: {
    app: ["react-hot-loader/patch", "webpack-hot-middleware/client"]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              importer: globImporter()
            }
          }
        ]
      },
      {
        test: /\.js.?$/,
        exclude: /node_modules/,
        use: ["react-hot-loader/webpack", "babel-loader"]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("development"),
        GOOGLE_ANALYTICS_ID: JSON.stringify("UA-127182065-1"),
        METROPOLIS_URL: JSON.stringify("http://localhost:8080/"),
        CLS_URL: JSON.stringify("http://localhost:4200/"),
        CORS_ALLOWED_ORIGINS: JSON.stringify("http://localhost:8080")
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});

const productionConfig = merge(commonConfig, {
  output: {
    filename: "[name].[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            "css-loader",
            "postcss-loader",
            "resolve-url-loader",
            {
              loader: "sass-loader",
              options: { importer: globImporter() }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("production"),
        GOOGLE_ANALYTICS_ID: JSON.stringify("UA-127182065-1"),
        METROPOLIS_URL: JSON.stringify(process.env.METROPOLIS_URL),
        CLS_URL: JSON.stringify(process.env.CLS_URL),
        CORS_ALLOWED_ORIGINS: JSON.stringify(process.env.CORS_ALLOWED_ORIGINS)
      }
    }),
    new UglifyJSPlugin({ sourceMap: true })
  ],
  devtool: "source-map"
});

module.exports =
  process.env.NODE_ENV == "production" ? productionConfig : developmentConfig;
