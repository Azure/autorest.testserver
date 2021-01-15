import { Router } from "express";
import { adminRoutes } from "./admin";
import { coverageRouter } from "./coverage";

const router = Router();
router.use("/", adminRoutes);
router.use("/", coverageRouter);

export const internalRouter = router;
