import debug from "debug";
import http from "http";

import app from "server/app";

const metropolisServerDebug = debug("metropolis:server");
const port = normalizePort(process.env.PORT || "4200");
let server;

function launch() {
  app.set("port", port);
  server = http.createServer(app);
  server.on("error", onError);
  server.on("listening", onListening);

  process.once("SIGINT", function() {
    server.close();
    process.exit();
  });

  server.listen(port);
}

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  /* eslint-disable no-console */
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
  /* eslint-enable no-console */
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  metropolisServerDebug("Listening on " + bind);
}

launch();
