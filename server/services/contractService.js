import mongoose from "mongoose";

import {
  createContract,
  findContractsByUserId,
  findContractByIdAndUser,
  findContractDocumentByIdAndUser,
  deleteContractByIdAndUser,
  createContractVersion,
  findVersionsByContractId,
  findVersionByIdAndUser,
  updateContractAfterVersion,
  findCurrentAnalysisByContractIdAndUser,
} from "../dao/contractDao.js";

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const createNewContract = async ({
  title,
  contractType,
  userId,
}) => {
  if (!userId) {
    const error = new Error("User ID is required.");
    error.statusCode = 401;
    error.code = "unauthorized";
    throw error;
  }

  return await createContract({
    userId,
    title: title || "Untitled Contract",
    contractType: contractType || "UNKNOWN",
    latestVersionNumber: 0,
    currentVersionId: null,
  });
};

export const getUserContracts = async (userId) => {
  return await findContractsByUserId(userId);
};

export const getUserContract = async (
  contractId,
  userId
) => {
  if (!validateObjectId(contractId)) {
    const error = new Error("Invalid contract ID.");
    error.statusCode = 400;
    error.code = "invalid_contract_id";
    throw error;
  }

  return await findContractByIdAndUser(
    contractId,
    userId
  );
};

export const deleteUserContract = async (
  contractId,
  userId
) => {
  if (!validateObjectId(contractId)) {
    const error = new Error("Invalid contract ID.");
    error.statusCode = 400;
    error.code = "invalid_contract_id";
    throw error;
  }

  return await deleteContractByIdAndUser(
    contractId,
    userId
  );
};

export const addContractVersion = async ({
  contractId,
  fileName,
  analysisData,
  userId,
}) => {
  if (!validateObjectId(contractId)) {
    const error = new Error("Invalid contract ID.");
    error.statusCode = 400;
    error.code = "invalid_contract_id";
    throw error;
  }

  const contract = await findContractDocumentByIdAndUser(
    contractId,
    userId
  );

  if (!contract) {
    const error = new Error("Contract not found.");
    error.statusCode = 404;
    error.code = "not_found";
    throw error;
  }

  const newVersionNumber =
    contract.latestVersionNumber + 1;

  const newVersion = await createContractVersion({
    contractId: contract._id,
    versionNumber: newVersionNumber,
    fileName,
    analysisData,
    riskScore: analysisData?.riskScore || 0,
    riskLevel: analysisData?.riskLevel || "Unknown",
  });

  await updateContractAfterVersion(
    contract._id,
    newVersion._id,
    newVersionNumber
  );

  return {
    version: newVersion,
    contract,
  };
};

export const getContractVersions = async (
  contractId,
  userId
) => {
  if (!validateObjectId(contractId)) {
    const error = new Error("Invalid contract ID.");
    error.statusCode = 400;
    error.code = "invalid_contract_id";
    throw error;
  }

  return await findVersionsByContractId(
    contractId,
    userId
  );
};

export const getContractVersion = async (
  versionId,
  userId
) => {
  if (!validateObjectId(versionId)) {
    const error = new Error("Invalid version ID.");
    error.statusCode = 400;
    error.code = "invalid_version_id";
    throw error;
  }

  return await findVersionByIdAndUser(
    versionId,
    userId
  );
};


export const getCurrentContractAnalysis = async (
  contractId,
  userId
) => {
  if (!validateObjectId(contractId)) {
    const error = new Error("Invalid contract ID.");
    error.statusCode = 400;
    error.code = "invalid_contract_id";
    throw error;
  }

  const result =
    await findCurrentAnalysisByContractIdAndUser(
      contractId,
      userId
    );

  if (!result) {
    const error = new Error("Contract not found.");
    error.statusCode = 404;
    error.code = "not_found";
    throw error;
  }

  if (!result.version) {
    const error = new Error(
      "No analysis is available for this contract."
    );
    error.statusCode = 404;
    error.code = "analysis_not_found";
    throw error;
  }

  return result;
};