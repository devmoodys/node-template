import { Router } from "express";
import pugTemplate from "./templates/cmm";

const router = Router();

router.get("/cmm", function(request, response) {
  const html = pugTemplate({});
  response.status(200).send(html);
});

export default router;
