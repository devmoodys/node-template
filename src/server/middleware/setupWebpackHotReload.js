export default function setupWebpackHotReload(router) {
  const webpack = require("webpack");
  const webpackClientConfig = require("../../../webpack.config/client");
  const compiler = webpack(webpackClientConfig);
  router.use(
    require("webpack-dev-middleware")(compiler, {
      publicPath: webpackClientConfig.output.publicPath,
      serverSideRender: true
    })
  );
  router.use(require("webpack-hot-middleware")(compiler));
}
