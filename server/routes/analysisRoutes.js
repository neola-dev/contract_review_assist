import express from "express";
import multer from "multer";

import {
  analyze,
} from "../controllers/analysisController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

router.post(
  "/",
  authenticateToken,
  upload.any(),
  analyze
);

export default router;