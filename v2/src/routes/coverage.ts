import { Router } from "express";
import { coverageService } from "../services";

const router = Router();
export const coverageRouter = router;

router.get("/report/:category?", (req, res) => {
  const category = req.params.category?.toString();
  return res.json(coverageService.getAllForCategory(category)).end();
});
