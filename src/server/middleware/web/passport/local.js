import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { authenticate, find, updateUserLoginTypes } from "services/users";
import logger from "systems/logger";

export default function setupPassport(router) {
  passport.use(new LocalStrategy(verify));
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);

  router.use(passport.session());

  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
  );

  router.post("/widget/login", function(req, res, next) {
    passport.authenticate("local", function(err, user, _info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.redirect("/widget/login");
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        const redirectUrl = "/widget/search";
        req.session.previousUrl = undefined;
        return res.redirect(redirectUrl);
      });
    })(req, res, next);
  });

  router.get("/logout", logout);
}

export function logout(request, response) {
  request.logout();
  response.redirect("/login");
}

function verify(username, password, done) {
  authenticate(username, password)
    .then(user => {
      return updateUserLoginTypes(user, "local");
    })
    .then(user => {
      console.log(user);
      return done(null, user);
    })
    .catch(error => {
      logger.error(error.stack);
      done(null, false, { message: error.message });
    });
}

function serialize(user, done) {
  done(null, user.id);
}

function deserialize(id, done) {
  find(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      logger.error(error.stack);
      done(null, false);
    });
}
