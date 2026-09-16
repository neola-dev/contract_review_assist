import express from "express";

import {
  generateContractReport,
} from "../controllers/reportController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/:id/report",
  generateContractReport
);

export default router;