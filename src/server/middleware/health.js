import { Router } from "express";

const router = Router();

router.get("/health", function(request, response) {
  response.status(200).json({
    status: "OK"
  });
});

export default router;
