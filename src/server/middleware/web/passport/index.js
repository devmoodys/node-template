import passport from "passport";
import setupLocal from "./local";

export default function setupPassport(router) {
  router.use(passport.initialize());
  setupLocal(router);
}
