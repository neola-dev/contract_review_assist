import Contract from "../models/Contract.js";
import ContractVersion from "../models/ContractVersion.js";

export const createContract = async (contractData) => {
  return await Contract.create(contractData);
};

export const findContractsByUserId = async (userId) => {
  const contracts = await Contract.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  for (const contract of contracts) {
    contract.versions = await ContractVersion.find({
      contractId: contract._id,
    })
      .sort({ versionNumber: -1 })
      .select(
        "_id versionNumber fileName uploadedAt riskScore riskLevel"
      )
      .lean();
  }

  return contracts;
};

export const findContractByIdAndUser = async (
  contractId,
  userId
) => {
  const contract = await Contract.findOne({
    _id: contractId,
    userId,
  }).lean();

  if (!contract) {
    return null;
  }

  contract.versions = await ContractVersion.find({
    contractId,
  })
    .sort({ versionNumber: -1 })
    .select(
      "_id versionNumber fileName uploadedAt riskScore riskLevel"
    )
    .lean();

  return contract;
};

export const findContractDocumentByIdAndUser = async (
  contractId,
  userId
) => {
  return await Contract.findOne({
    _id: contractId,
    userId,
  });
};

export const deleteContractByIdAndUser = async (
  contractId,
  userId
) => {
  return await Contract.findOneAndDelete({
    _id: contractId,
    userId,
  });
};

export const createContractVersion = async (
  versionData
) => {
  return await ContractVersion.create(versionData);
};

export const findVersionsByContractId = async (
  contractId,
  userId
) => {
  const contract = await Contract.findOne({
    _id: contractId,
    userId,
  }).select("_id");

  if (!contract) {
    return null;
  }

  return await ContractVersion.find({ contractId })
    .sort({ versionNumber: -1 })
    .lean();
};

export const findVersionByIdAndUser = async (
  versionId,
  userId
) => {
  const version = await ContractVersion.findById(
    versionId
  ).lean();

  if (!version) {
    return null;
  }

  const contract = await Contract.findOne({
    _id: version.contractId,
    userId,
  }).select("_id");

  if (!contract) {
    return null;
  }

  return version;
};

export const updateContractAfterVersion = async (
  contractId,
  versionId,
  versionNumber
) => {
  return await Contract.findByIdAndUpdate(
    contractId,
    {
      currentVersionId: versionId,
      latestVersionNumber: versionNumber,
    },
    { new: true }
  );
};

/*
 * Phase 6
 * Retrieves the current/latest analysis for a user's contract.
 */
export const findCurrentAnalysisByContractIdAndUser =
  async (contractId, userId) => {
    const contract = await Contract.findOne({
      _id: contractId,
      userId,
    })
      .select(
        "_id title contractType currentVersionId latestVersionNumber"
      )
      .lean();

    if (!contract) {
      return null;
    }

    let version = null;

    // First try the version explicitly marked as current.
    if (contract.currentVersionId) {
      version = await ContractVersion.findOne({
        _id: contract.currentVersionId,
        contractId: contract._id,
      }).lean();
    }

    // Fallback to the latest version if currentVersionId
    // is missing or no longer points to a version.
    if (!version) {
      version = await ContractVersion.findOne({
        contractId: contract._id,
      })
        .sort({ versionNumber: -1 })
        .lean();
    }

    return {
      contract,
      version,
    };
  };