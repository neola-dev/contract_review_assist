import express from "express";

import { getVersion } from "../controllers/contractController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", authenticateToken, getVersion);

export default router;