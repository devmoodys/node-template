import { Router } from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";

import wrapAsync from "server/middleware/wrapAsync";
import setupPassport from "server/middleware/web/passport";
import errorHandler from "./errorHandler";
import redisClient from "systems/redis";
import renderMainUI from "server/middleware/web/renderMainUI";
import jwtCookieGenerator from "server/middleware/web/jwtCookieGenerator";

const router = Router();
const RedisStore = connectRedis(session);

router.use(cookieParser(process.env.SESSION_KEY));
router.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
  })
);

router.use(function(request, response, next) {
  if (!request.session) {
    return next(new Error("Unable to connect to session store"));
  }
  next();
});

setupPassport(router);

router.use(jwtCookieGenerator);

// all other GETing goes to server side rendering
router.get("*", wrapAsync(renderMainUI));
router.use(errorHandler);

router._metropolisName = "metropolis";

export default router;
