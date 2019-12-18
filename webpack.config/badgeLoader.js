const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const commonConfig = {
  entry: "./src/badgeLoader/index.js",
  output: {
    path: path.resolve("./build/dist"),
    publicPath: "/dist/",
    filename: "badgeLoader.js"
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
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(otf|woff2|ttf)$/,
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
  plugins: [new ExtractTextPlugin("badgeLoader.css")],
  resolve: {
    extensions: [".jsx", ".js", ".json"],
    modules: [path.resolve("./src"), "node_modules"]
  },
  devtool: "eval-source-map"
};

const developmentConfig = merge.smartStrategy({
  plugins: "append"
})(commonConfig, {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("development"),
        GOOGLE_ANALYTICS_ID: JSON.stringify("UA-127182065-1"),
        METROPOLIS_URL: JSON.stringify("http://localhost:8080/"),
        CORS_ALLOWED_ORIGINS: JSON.stringify("http://localhost:8080")
      }
    })
  ]
});

const productionConfig = merge.smartStrategy({
  plugins: "append"
})(commonConfig, {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("production"),
        GOOGLE_ANALYTICS_ID: JSON.stringify("UA-127182065-1"),
        METROPOLIS_URL: JSON.stringify(process.env.METROPOLIS_URL),
        CORS_ALLOWED_ORIGINS: JSON.stringify(process.env.CORS_ALLOWED_ORIGINS)
      }
    }),
    new UglifyJSPlugin({ sourceMap: true })
  ],
  devtool: "source-map"
});

module.exports =
  process.env.NODE_ENV == "production" ? productionConfig : developmentConfig;
