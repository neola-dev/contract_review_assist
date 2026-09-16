import express from "express";

import {
  createContract,
  getContracts,
  getContract,
  deleteContract,
  getVersions,
  getAnalysis,
} from "../controllers/contractController.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createContract);

router.get("/", getContracts);

router.get("/:id/analysis", getAnalysis);

router.get("/:id", getContract);

router.delete("/:id", deleteContract);

router.get("/:id/versions", getVersions);

export default router;