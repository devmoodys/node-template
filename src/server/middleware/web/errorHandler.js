import errorTemplate from "server/middleware/web/templates/error";
import jsManifest from "server/middleware/web/jsManifest";
import logger from "systems/logger";

export default function handleError(err, req, res, _next) {
  logger.error(error);
  const message = err.message;
  const error = req.app.get("env") === "development" ? err : {};
  const renderString = errorTemplate({ error, message, jsManifest });
  res.status(err.status || 500).send(renderString);
}
