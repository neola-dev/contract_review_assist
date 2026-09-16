import Contract from "../models/Contract.js";
import ContractVersion from "../models/ContractVersion.js";

export const findContractForUser = async (
  contractId,
  userId
) => {
  return await Contract.findOne({
    _id: contractId,
    userId,
  });
};

export const createContract = async ({
  userId,
  title,
  contractType,
}) => {
  return await Contract.create({
    userId,
    title,
    contractType,
    latestVersionNumber: 0,
    currentVersionId: null,
  });
};

export const createContractVersion = async ({
  contractId,
  fileName,
  analysisData,
}) => {
  const contract = await Contract.findById(contractId);

  if (!contract) {
    throw new Error("Contract not found.");
  }

  const versionNumber =
    contract.latestVersionNumber + 1;

  const version = await ContractVersion.create({
    contractId,
    versionNumber,
    fileName,
    analysisData,
    riskScore: analysisData.riskScore ?? 0,
    riskLevel: analysisData.riskLevel ?? "Unknown",
  });

  contract.latestVersionNumber = versionNumber;
  contract.currentVersionId = version._id;

  await contract.save();

  return version;
};