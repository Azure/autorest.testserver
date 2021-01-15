import { Router } from "express";
import { AdminUrls } from "../constants";
import { logger } from "../logger";

const router = Router();

router.post(AdminUrls.stop, (_req, res) => {
  logger.info("Recieved signal to stop server. Exiting...");
  res.status(202).end();
  setTimeout(() => {
    process.exit(0);
  });
});

export const adminRoutes = router;
