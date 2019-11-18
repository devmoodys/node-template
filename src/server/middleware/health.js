import { Router } from "express";
require("services/check");

const router = Router();

router.get("/health", function(request, response) {
  response.status(200).json({
    status: "OK"
  });
});

export default router;
