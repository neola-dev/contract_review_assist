import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";

import parsePDF from "../pdf-parser.cjs";

import {
  findContractForUser,
  createContract,
  createContractVersion,
} from "../dao/analysisDao.js";


const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


export const analyzeContract = async ({
  file,
  contractId,
  userId,
}) => {
  /*
   * ============================================================
   * 1. VALIDATE UPLOADED FILE
   * ============================================================
   */

  if (!file) {
    const error = new Error("No PDF file uploaded.");
    error.statusCode = 400;
    error.code = "missing_file";
    throw error;
  }

  const isPdf =
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    const error = new Error(
      "Only PDF documents are supported."
    );
    error.statusCode = 400;
    error.code = "invalid_format";
    throw error;
  }


  /*
   * ============================================================
   * 2. EXTRACT TEXT FROM PDF
   * ============================================================
   */

  console.log(
    `Extracting text from: ${file.originalname}`
  );

  let cleanText = "";

  try {
    const extractedData = await parsePDF(file.buffer);

    cleanText = (
      extractedData.text || ""
    ).trim();

    console.log(
      `PDF parsed successfully. Extracted text length: ${cleanText.length}`
    );
  } catch (parseError) {
    console.error(
      "PDF parsing error:",
      parseError
    );

    const error = new Error(
      "Unable to extract text from this PDF. The file may be corrupt or password-protected."
    );

    error.statusCode = 400;
    error.code = "pdf_parse_error";

    throw error;
  }


  /*
   * ============================================================
   * 3. CHECK FOR SCANNED / EMPTY PDF
   * ============================================================
   */

  if (cleanText.length < 150) {
    console.log(
      "Warning: Extracted text is extremely short. Likely scanned PDF."
    );

    const error = new Error(
      "This PDF appears to be scanned or contains no selectable text. OCR processing is required."
    );

    error.statusCode = 400;
    error.code = "scanned";

    throw error;
  }

  console.log(
    "Document text extraction successful."
  );


  /*
   * ============================================================
   * 4. VALIDATE GEMINI API KEY
   * ============================================================
   */

  const geminiKey =
    process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    const error = new Error(
      "Gemini API key is not configured on the server."
    );

    error.statusCode = 500;
    error.code = "missing_api_key";

    throw error;
  }


  /*
   * ============================================================
   * 5. GEMINI MODEL
   * ============================================================
   *
   * Keep the model in .env:
   *
   * GEMINI_MODEL=your_available_model
   *
   */

  const modelName =
    process.env.GEMINI_MODEL;

  if (!modelName) {
    const error = new Error(
      "GEMINI_MODEL is not configured on the server."
    );

    error.statusCode = 500;
    error.code = "missing_model";

    throw error;
  }

  console.log(
    `Using Gemini model: ${modelName}`
  );


  /*
   * ============================================================
   * 6. BUILD CONTRACT ANALYSIS PROMPT
   * ============================================================
   */

  const prompt = `
You are a professional legal contract review analyst.

Analyze the following legal document text.

Extract:

- key terms
- parties
- important dates
- payment terms
- termination rules
- confidentiality provisions
- renewal provisions
- governing law
- jurisdiction
- obligations
- important clauses
- risks
- compliance information
- recommendations
- timeline milestones
- statistics

Use ONLY information contained in the supplied document.

Do not invent names, dates, salary/rent amounts, clauses, risks,
obligations, or other information.

If information is not present in the document or not applicable
for this type of agreement, set the value to "Not specified" or
"Not applicable".

Do not hallucinate.

First identify the document type.

Examples:

EMPLOYMENT / OFFER LETTER
RENTAL / LEASE AGREEMENT
NDA
SERVICE AGREEMENT
VENDOR AGREEMENT
PARTNERSHIP AGREEMENT
CONSULTING AGREEMENT
etc.

Return the analysis strictly as a single structured JSON object
following this schema:

{
  "documentType": "Detected contract/document type in uppercase",

  "confidence": 0,

  "partiesInvolved": "Comma-separated list of parties identified",

  "effectiveDate": "YYYY-MM-DD or Not specified",

  "expirationDate": "YYYY-MM-DD, Indefinite, or Not specified",

  "paymentTerms": "Description of payment terms, salary, rent, or Not applicable",

  "terminationClause": "Summary of termination rules or Not specified",

  "confidentiality": "Summary of confidentiality obligations or Not specified",

  "jurisdiction": "Governing courts/state or Not specified",

  "renewal": "Renewal rules or Not specified",

  "governingLaw": "Governing law or Not specified",

  "contractHealth": "Healthy / Medium Risk / High Risk",

  "riskScore": 0,

  "riskLevel": "Low / Medium / High",

  "executiveSummary": "A concise paragraph summarizing the key terms, balance of terms, and critical issues to watch out for.",

  "statistics": {
    "lowRisks": 0,
    "mediumRisks": 0,
    "highRisks": 0,
    "criticalClauses": 0
  },

  "timeline": [
    {
      "date": "Date string",
      "label": "Milestone name",
      "description": "Details about this milestone"
    }
  ],

  "obligations": [
    {
      "id": "Unique string id",
      "obligation": "Description of the compliance obligation",
      "party": "Party responsible for performing the obligation",
      "deadline": "Due date or condition",
      "frequency": "Continuous / Monthly / Once / etc.",
      "status": "Active / Upcoming / Overdue / Completed"
    }
  ],

  "clauses": [
    {
      "id": "Unique clause id",
      "title": "Clause title",

      "section": "Section number or Not specified",

      "riskLevel": "Low / Medium / High",

      "riskScore": 0,

      "category": "FINANCIAL / LEGAL / OPERATIONAL / COMPLIANCE / CONFIDENTIALITY / TERMINATION",

      "description": "The exact original extracted clause text or a close quote snippet from the document",

      "whyRisky": "Clear explanation of why this clause presents risk, or Standard clause",

      "potentialImpact": "Potential business or financial impact of this clause",

      "recommendedAction": "Actionable recommendation for negotiation or mitigation"
    }
  ],

  "chartData": [
    {
      "name": "Payment",
      "score": 0
    },
    {
      "name": "Termination",
      "score": 0
    },
    {
      "name": "Liability",
      "score": 0
    },
    {
      "name": "Confidentiality",
      "score": 0
    },
    {
      "name": "Force Majeure",
      "score": 0
    },
    {
      "name": "Indemnity",
      "score": 0
    },
    {
      "name": "Privacy",
      "score": 0
    },
    {
      "name": "Jurisdiction",
      "score": 0
    }
  ],

  "compliance": [
    {
      "id": "Unique string id",

      "provision": "Name of provision",

      "status": "PRESENT / PARTIAL / MISSING / AMBIGUOUS",

      "relatedClauseId": "id of the related clause from the clauses array, or null if missing",

      "explanation": "Why this provision is flagged as such",

      "impact": "Potential business or legal impact",

      "priority": "HIGH / MEDIUM / LOW"
    }
  ],

  "recommendations": [
    {
      "id": "Unique string id",

      "clauseId": "id of the related clause from the clauses array, or null if it is for a missing provision",

      "priority": "HIGH / MEDIUM / LOW",

      "issue": "Description of the risk or issue",

      "impact": "Potential impact",

      "recommendation": "Actionable recommendation for negotiation",

      "suggestedLanguage": "Suggested negotiation language or N/A"
    }
  ]
}

Important rules:

1. Do not invent information.
2. Do not assume missing dates.
3. Do not assume missing payment amounts.
4. Do not assume a clause exists if it does not.
5. Use "Not specified" when information cannot be found.
6. Use "Not applicable" when a field does not apply.
7. Risk assessments must be based only on the supplied document.
8. Return ONLY valid JSON.
9. Do not wrap the JSON in Markdown code fences.

Document Text:

${cleanText}
`;


  /*
   * ============================================================
   * 7. CALL CURRENT GEMINI SDK
   * ============================================================
   */

  let responseText = "";

  try {
    const ai = new GoogleGenAI({
      apiKey: geminiKey,
    });

    const response =
      await ai.models.generateContent({
        model: modelName,

        contents: prompt,

        config: {
          responseMimeType:
            "application/json",

          temperature: 0.2,
        },
      });

    responseText =
      response.text || "";

    console.log(
      `Gemini response received successfully. Response length: ${responseText.length}`
    );
  } catch (apiError) {
    console.error(
      "\n=== GEMINI API ERROR ==="
    );

    console.error(
      `Model used: ${modelName}`
    );

    console.error(
      `HTTP Status: ${apiError.status ?? "N/A"}`
    );

    console.error(
      `Message: ${apiError.message}`
    );

    console.error(
      "========================\n"
    );

    const error = new Error(
      "AI analysis service is currently unavailable. Please try again later."
    );

    error.statusCode = 502;
    error.code = "api_failed";

    throw error;
  }


  /*
   * ============================================================
   * 8. CHECK EMPTY RESPONSE
   * ============================================================
   */

  if (!responseText.trim()) {
    const error = new Error(
      "AI did not return any analysis results."
    );

    error.statusCode = 502;
    error.code = "empty_response";

    throw error;
  }


  /*
   * ============================================================
   * 9. PARSE AI JSON
   * ============================================================
   */

  let structuredResult;

  try {
    structuredResult =
      JSON.parse(
        responseText.trim()
      );
  } catch (parseError) {
    console.error(
      "AI returned invalid JSON:",
      parseError
    );

    const error = new Error(
      "AI response was not in a valid JSON format."
    );

    error.statusCode = 502;
    error.code = "malformed_json";

    throw error;
  }


  /*
   * ============================================================
   * 10. BASIC RESPONSE VALIDATION
   * ============================================================
   */

  if (
    !structuredResult.documentType ||
    !structuredResult.clauses
  ) {
    const error = new Error(
      "The AI returned an incomplete analysis."
    );

    error.statusCode = 502;
    error.code = "malformed_response";

    throw error;
  }


  /*
   * ============================================================
   * 11. ADD FILE METADATA
   * ============================================================
   */

  structuredResult.fileName =
    file.originalname;

  structuredResult.fileSize =
    `${(file.size / 1024).toFixed(1)} KB`;

  structuredResult.uploadTime =
    new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  structuredResult.contractText =
    cleanText;


  /*
   * ============================================================
   * 12. FIND EXISTING CONTRACT OR CREATE NEW CONTRACT
   * ============================================================
   */

  let currentContract;

  if (contractId) {
    /*
     * Existing contract → create a new version
     */

    if (!validateObjectId(contractId)) {
      const error = new Error(
        "Invalid contract ID."
      );

      error.statusCode = 400;
      error.code = "invalid_contract_id";

      throw error;
    }

    currentContract =
      await findContractForUser(
        contractId,
        userId
      );

    if (!currentContract) {
      const error = new Error(
        "Contract not found to add version."
      );

      error.statusCode = 404;
      error.code = "not_found";

      throw error;
    }
  } else {
    /*
     * New contract
     */

    const title =
      structuredResult.documentType
        ? `${structuredResult.documentType} - ${file.originalname}`
        : file.originalname;

    currentContract =
      await createContract({
        userId,
        title,
        contractType:
          structuredResult.documentType,
      });
  }


  /*
   * ============================================================
   * 13. CREATE CONTRACT VERSION
   * ============================================================
   */

  const newVersion =
    await createContractVersion({
      contractId:
        currentContract._id,

      fileName:
        file.originalname,

      analysisData:
        structuredResult,
    });


  /*
   * ============================================================
   * 14. RETURN RESPONSE
   * ============================================================
   */

  return {
    ...structuredResult,

    contractId:
      currentContract._id.toString(),

    versionId:
      newVersion._id.toString(),

    versionNumber:
      newVersion.versionNumber,

    contractTitle:
      currentContract.title,
  };
};