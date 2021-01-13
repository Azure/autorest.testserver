import { Router } from "express";
import { coverageRouter } from "./coverage";

const router = Router();
router.use("/", coverageRouter);

export const internalRouter = router;
