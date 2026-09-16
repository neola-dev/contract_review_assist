import {
  createNewContract,
  getUserContracts,
  getUserContract,
  deleteUserContract,
  getContractVersions,
  getContractVersion,
  getCurrentContractAnalysis,
} from "../services/contractService.js";

export const createContract = async (req, res) => {
  try {
    const { title, contractType } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "missing_fields",
        message: "Contract title is required.",
      });
    }

    const contract = await createNewContract({
      title: title.trim(),
      contractType,
      userId: req.user.id,
    });

    return res.status(201).json({
      contract,
    });
  } catch (error) {
    console.error("Create contract error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.code || "server_error",
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Failed to create contract.",
    });
  }
};

export const getContracts = async (req, res) => {
  try {
    const contracts = await getUserContracts(req.user.id);

    return res.json(contracts);
  } catch (error) {
    console.error("Get contracts error:", error);

    return res.status(500).json({
      error: "server_error",
      message: "Failed to retrieve contracts.",
    });
  }
};

export const getContract = async (req, res) => {
  try {
    const contract = await getUserContract(
      req.params.id,
      req.user.id
    );

    if (!contract) {
      return res.status(404).json({
        error: "not_found",
        message: "Contract not found.",
      });
    }

    return res.json(contract);
  } catch (error) {
    console.error("Get contract error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.code || "server_error",
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Failed to retrieve contract.",
    });
  }
};

export const deleteContract = async (req, res) => {
  try {
    const deletedContract = await deleteUserContract(
      req.params.id,
      req.user.id
    );

    if (!deletedContract) {
      return res.status(404).json({
        error: "not_found",
        message: "Contract not found.",
      });
    }

    return res.json({
      message: "Contract deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contract error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.code || "server_error",
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Failed to delete contract.",
    });
  }
};

export const getVersions = async (req, res) => {
  try {
    const versions = await getContractVersions(
      req.params.id,
      req.user.id
    );

    if (versions === null) {
      return res.status(404).json({
        error: "not_found",
        message: "Contract not found.",
      });
    }

    return res.json(versions);
  } catch (error) {
    console.error("Get contract versions error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.code || "server_error",
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Failed to retrieve contract versions.",
    });
  }
};

export const getVersion = async (req, res) => {
  try {
    const version = await getContractVersion(
      req.params.id,
      req.user.id
    );

    if (!version) {
      return res.status(404).json({
        error: "not_found",
        message: "Version not found.",
      });
    }

    return res.json(version);
  } catch (error) {
    console.error("Get contract version error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.code || "server_error",
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Failed to retrieve contract version.",
    });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const result = await getCurrentContractAnalysis(
      req.params.id,
      req.user.id
    );

    const {
      contract,
      version,
    } = result;

    return res.json({
      contractId: contract._id.toString(),
      contractTitle: contract.title,
      contractType: contract.contractType,

      versionId: version._id.toString(),
      versionNumber: version.versionNumber,
      fileName: version.fileName,
      uploadedAt: version.uploadedAt,

      analysisData: version.analysisData,

      riskScore: version.riskScore,
      riskLevel: version.riskLevel,
    });
  } catch (error) {
    console.error(
      "Get contract analysis error:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({
      error:
        error.code || "server_error",

      message:
        error.statusCode &&
        error.statusCode < 500
          ? error.message
          : "Failed to retrieve contract analysis.",
    });
  }
};