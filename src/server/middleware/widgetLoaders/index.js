import { Router } from "express";
import cors from "cors";

const router = Router();

// allow all cors on requests to the badge loader
router.use("/badgeLoader.js", cors());

export default router;
