import { Router } from "express";
import cors from "cors";
import jwtVerify from "server/middleware/externalAPI/jwtVerify";
import {
  geoCode,
  reverseGeoCode,
  emailSalesToSetupCLSUser,
  resetPassword
} from "server/middleware/externalAPI/v1/controllers";

import {
  getCLSBadge,
  getCLSBadgeFromLatLong
} from "server/middleware/api/clsBadge";
import wrapAsync from "server/middleware/wrapAsync";

const router = Router();

router.get("/geo/:index", jwtVerify, wrapAsync(geoCode));
router.get("/geo/reverse/:index", jwtVerify, wrapAsync(reverseGeoCode));

// internal endpoints that do not need to be in apigee
router.get("/badge", cors(), jwtVerify, wrapAsync(getCLSBadge));
router.get(
  "/badge/reverse",
  cors(),
  jwtVerify,
  wrapAsync(getCLSBadgeFromLatLong)
);

router.post("/sales", jwtVerify, wrapAsync(emailSalesToSetupCLSUser));
router.post("/resetPassword", jwtVerify, wrapAsync(resetPassword));

export default router;
