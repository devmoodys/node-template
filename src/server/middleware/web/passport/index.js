import passport from "passport";
import setupLocal from "./local";
import setupUserNameToken from "./usernameToken";

export default function setupPassport(router) {
  router.use(passport.initialize());
  setupLocal(router);
  setupUserNameToken(router);
}
