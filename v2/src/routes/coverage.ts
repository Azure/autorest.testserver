import { Router } from "express";
import { coverageService } from "../services";

const router = Router();
export const coverageRouter = router;

router.get("/report/:category", (req, res) => {
  const category = req.query.category?.toString();
  return res.status(200).json(coverageService.getAllForCategory(category)).end();
});
