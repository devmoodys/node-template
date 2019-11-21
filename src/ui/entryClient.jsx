import "ui/styles/app.scss";

import buildClient from "./buildClient";
import routes from "./routes";

const render = buildClient();
render(routes);

if (module.hot) {
  module.hot.accept("ui/routes", () => {
    const routes = require("ui/routes").default;
    render(routes);
  });
}
