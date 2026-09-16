import { analyzeContract } from "../services/analysisService.js";

export const analyze = async (req, res) => {
  try {
    const contractId = req.body?.contractId || null;
    const file = req.file || (req.files && req.files[0]);

    const result = await analyzeContract({
      file,
      contractId,
      userId: req.user.id,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Contract analysis error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.code || "server_error",
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Failed to analyze contract.",
    });
  }
};