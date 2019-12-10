import { Router } from "express";
const router = Router();
import jwtVerify from "server/middleware/externalAPI/jwtVerify";
import { resetPassword } from "server/middleware/externalAPI/v1/controllers";
import wrapAsync from "server/middleware/wrapAsync";

router.post("/resetPassword", jwtVerify, wrapAsync(resetPassword));

export default router;
