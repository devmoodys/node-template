import { curry } from "ramda";
import pugTemplate from "server/middleware/web/templates/index";
import jsManifest from "server/middleware/web/jsManifest";
import buildServer from "ui/buildServer";

async function renderUI(
  routes,
  applicationCode,
  applicationStyleSheet,
  request,
  response
) {
  const renderResults = await buildServer(routes, request, response);
  const { context: { statusCode }, renderedString, storeState } = renderResults;

  // if (url) {
  //   request.session.previousUrl = request.originalUrl;
  //   response.redirect(statusCode || 302, url);
  //   return;
  // }
  const locals = {
    applicationCode,
    applicationStyleSheet,
    storeState,
    jsManifest,
    title: "MA CRE",
    html: renderedString,
    displayMap:
      Boolean(request.url.match(/^\/\W*/)) ||
      Boolean(request.url.match(/^\/widget\/map\W*/))
  };
  const html = pugTemplate(locals);
  response.status(statusCode || 200).send(html);
}

export default curry(renderUI);
