import mongoose from "mongoose";

import {
  findCurrentAnalysisByContractIdAndUser,
} from "../dao/contractDao.js";

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const formatDate = (value) => {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const safeText = (value, fallback = "Not specified") => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

export const getContractReportData = async (
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

  const {
    contract,
    version,
  } = result;

  const analysis = version.analysisData || {};

  return {
    contract: {
      id: contract._id,
      title: contract.title,
      contractType: contract.contractType,
      versionNumber: version.versionNumber,
      fileName: version.fileName,
      uploadedAt: version.uploadedAt,
    },

    overview: {
      documentType: safeText(
        analysis.documentType
      ),
      confidence: analysis.confidence ?? null,
      partiesInvolved: safeText(
        analysis.partiesInvolved
      ),
      effectiveDate: formatDate(
        analysis.effectiveDate
      ),
      expirationDate: formatDate(
        analysis.expirationDate
      ),
      governingLaw: safeText(
        analysis.governingLaw
      ),
      jurisdiction: safeText(
        analysis.jurisdiction
      ),
      contractHealth: safeText(
        analysis.contractHealth
      ),
    },

    risk: {
      score: version.riskScore ?? 0,
      level: version.riskLevel ?? "Unknown",
      statistics: analysis.statistics || {},
      clauses: Array.isArray(analysis.clauses)
        ? analysis.clauses
        : [],
    },

    summary: safeText(
      analysis.executiveSummary,
      "No executive summary available."
    ),

    importantTerms: {
      paymentTerms: safeText(
        analysis.paymentTerms
      ),
      terminationClause: safeText(
        analysis.terminationClause
      ),
      confidentiality: safeText(
        analysis.confidentiality
      ),
      renewal: safeText(
        analysis.renewal
      ),
    },

    timeline: Array.isArray(analysis.timeline)
      ? analysis.timeline
      : [],

    obligations: Array.isArray(
      analysis.obligations
    )
      ? analysis.obligations
      : [],

    recommendations: Array.isArray(
      analysis.recommendations
    )
      ? analysis.recommendations
      : [],

    generatedAt: new Date(),
  };
};