import renderUI from "server/middleware/web/renderUI";
import routes from "ui/routes";

export default renderUI(routes, "app", "app");
