import { Router } from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { path } from "ramda";

import wrapAsync from "server/middleware/wrapAsync";
import jwtVerify from "server/middleware/api/jwtVerify";

import { acceptTerms } from "server/middleware/api/acceptTerms";
import { getUserLatLong } from "server/middleware/api/map";
import { addUserToIndivSubWaitlist } from "server/middleware/api/individualSubscription";

import {
  users,
  newUser,
  toggleStatus,
  customizeWeights,
  getCustomizedWeights,
  requestPasswordChange
} from "server/middleware/api/users";

import {
  companies,
  newCompany,
  updateCompany
} from "server/middleware/api/companies";

import { hasAdminAccess, hasSuperAdminAccess } from "helpers/authorization";

import logger from "systems/logger";

// auth
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
    },
    jwtVerify
  )
);

const router = Router();

router.use(passport.initialize());

const authenticate = passport.authenticate("jwt", { session: false });

function adminOnly(req, res, next) {
  const role = path(["user", "role"], req);
  if (hasAdminAccess(role)) {
    next();
  } else {
    res.send(401);
  }
}

function superAdminOnly(req, res, next) {
  const role = path(["user", "role"], req);
  if (hasSuperAdminAccess(role)) {
    next();
  } else {
    res.send(401);
  }
}

// Companies API
router.get("/companies", authenticate, superAdminOnly, wrapAsync(companies));
router.post(
  "/companies/new",
  authenticate,
  superAdminOnly,
  wrapAsync(newCompany)
);
router.put(
  "/companies/update",
  authenticate,
  superAdminOnly,
  wrapAsync(updateCompany)
);

//  Users API
router.post("/users/new", authenticate, adminOnly, wrapAsync(newUser));
router.post("/users/customWeights", authenticate, wrapAsync(customizeWeights));
router.get(
  "/users/customWeights",
  authenticate,
  wrapAsync(getCustomizedWeights)
);
router.put(
  "/users/toggleStatus",
  authenticate,
  adminOnly,
  wrapAsync(toggleStatus)
);
router.get("/users", authenticate, adminOnly, wrapAsync(users));
router.post("/accept_terms", authenticate, wrapAsync(acceptTerms));

router.get("/getUserLatLong", authenticate, wrapAsync(getUserLatLong));

router.post(
  "/individ_subscription_interest/new",
  wrapAsync(addUserToIndivSubWaitlist)
);

router.post("/requestPassChange", wrapAsync(requestPasswordChange));

router.put("*", function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

router.use(function(err, req, res, _next) {
  let error = err;
  if (!error) {
    error = new Error("Unknown error");
  }
  logger.error(error.stack || error.message || error);
  const message = error.message;
  const status = error.status || 500;

  res.status(status);
  res.json({
    error: {
      message,
      status
    }
  });
});

export default router;
