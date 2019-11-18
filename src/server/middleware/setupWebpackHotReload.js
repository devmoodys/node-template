export default function setupWebpackHotReload(router) {
  const webpack = require("webpack");
  const webpackConfig = require("../../../webpack.config/server");
  const compiler = webpack(webpackConfig);
  router.use(
    require("webpack-dev-middleware")(compiler, {
      publicPath: webpackConfig.output.publicPath,
      noInfo: true
    })
  );
  router.use(require("webpack-hot-middleware")(compiler));
}
