import React, { useState } from 'react';
import {
  Download,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { contractApi } from '../services/api';

export default function ExecutiveReport({ contract, onBack }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  if (!contract) return null;

  const highRisks =
    contract.clauses?.filter(
      (c) => c.riskLevel === 'High'
    ) || [];

  const mediumRisks =
    contract.clauses?.filter(
      (c) => c.riskLevel === 'Medium'
    ) || [];

  const lowRisks =
    contract.clauses?.filter(
      (c) => c.riskLevel === 'Low'
    ) || [];

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setMessage('Generating PDF...');

    try {
      const contractId =
        contract.contractId || contract._id;

      if (!contractId) {
        throw new Error(
          'No contract is available for report generation.'
        );
      }

      const blob = await contractApi.downloadReport(contractId);

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = downloadUrl;

      const sanitizedTitle =
        (contract.title || contract.contractTitle || 'Contract')
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_');

      const versionNum =
        contract.versionNumber || 'Current';

      link.download =
        `Contract_Review_Report_${sanitizedTitle}_V${versionNum}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setMessage(
        'PDF report downloaded successfully.'
      );

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error(
        'PDF report download failed:',
        error
      );

      setMessage(
        error.message ||
          'Unable to generate PDF report. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* TOP ACTION BAR */}
      <div className="flex justify-between items-center mb-6">

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-textSecondary font-semibold rounded-xl text-sm transition-all hover:bg-elevated"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-4">

          {message && (
            <span
              className={`text-sm font-semibold ${
                message.includes('successfully')
                  ? 'text-success'
                  : message.includes('Generating')
                  ? 'text-accent animate-pulse'
                  : 'text-danger'
              }`}
            >
              {message}
            </span>
          )}

          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-secondaryBg font-semibold rounded-xl text-sm transition-all hover:bg-accentSecondary disabled:opacity-50"
          >
            <Download className="w-4 h-4" />

            {isGenerating
              ? 'Generating PDF...'
              : 'Download PDF Report'}
          </button>

        </div>
      </div>

      {/* REPORT */}
      <div className="bg-white rounded-premium shadow-sm overflow-hidden border border-border">

        <div
          className="bg-white text-black text-sm p-8"
          style={{
            fontFamily: 'sans-serif',
            color: '#1f2937',
          }}
        >

          {/* HEADER */}
          <div
            className="border-b-2 border-gray-800 pb-6 mb-8 text-center"
            style={{ pageBreakInside: 'avoid' }}
          >
            <h1 className="text-3xl font-bold uppercase tracking-wide text-blue-900 mb-2">
              Contract Review Analyst
            </h1>

            <h2 className="text-2xl font-bold text-gray-900">
              {contract.title || 'Untitled Contract'}
            </h2>

            <div className="flex items-center justify-center gap-6 mt-4 text-gray-600 font-semibold">
              <span>
                Current Version: Version{' '}
                {contract.versionNumber || 'Current'}
              </span>

              <span>•</span>

              <span>
                Analysis Date:{' '}
                {new Date(
                  contract.uploadedAt || Date.now()
                ).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* 1. CONTRACT OVERVIEW */}
          <div
            className="mb-8"
            style={{ pageBreakInside: 'avoid' }}
          >
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">
              1. Contract Overview
            </h3>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">

              <div>
                <strong className="text-gray-700">
                  Contract Name:
                </strong>{' '}
                {contract.fileName ||
                  'Not specified'}
              </div>

              <div>
                <strong className="text-gray-700">
                  Contract Type:
                </strong>{' '}
                {contract.documentType ||
                  contract.contractType ||
                  'Not specified'}
              </div>

              <div className="col-span-2">
                <strong className="text-gray-700">
                  Parties:
                </strong>{' '}
                {contract.partiesInvolved ||
                  'Not specified'}
              </div>

              <div>
                <strong className="text-gray-700">
                  Effective Date:
                </strong>{' '}
                {contract.effectiveDate ||
                  'Not specified'}
              </div>

              <div>
                <strong className="text-gray-700">
                  Expiration Date:
                </strong>{' '}
                {contract.expirationDate ||
                  'Not specified'}
              </div>

              <div>
                <strong className="text-gray-700">
                  Governing Law:
                </strong>{' '}
                {contract.governingLaw ||
                  'Not specified'}
              </div>

              <div>
                <strong className="text-gray-700">
                  Jurisdiction:
                </strong>{' '}
                {contract.jurisdiction ||
                  'Not specified'}
              </div>

            </div>
          </div>

          {/* 2. EXECUTIVE SUMMARY */}
          <div
            className="mb-8"
            style={{ pageBreakInside: 'avoid' }}
          >
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">
              2. Executive Summary
            </h3>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="leading-relaxed text-gray-800">
                {contract.executiveSummary ||
                  'No executive summary provided.'}
              </p>
            </div>
          </div>

          {/* 3. OVERALL RISK ASSESSMENT */}
          <div
            className="mb-8"
            style={{ pageBreakInside: 'avoid' }}
          >
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">
              3. Overall Risk Assessment
            </h3>

            <div className="flex gap-6 mb-4">

              {/* SCORE */}
              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-sm font-bold text-gray-500 uppercase">
                  Risk Score
                </p>

                <p className="text-5xl font-bold text-gray-900 mt-2">
                  {contract.riskScore ?? 0}
                  <span className="text-xl text-gray-500">
                    {' '}
                    /100
                  </span>
                </p>
              </div>

              {/* LEVEL */}
              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center flex flex-col items-center justify-center">

                <p className="text-sm font-bold text-gray-500 uppercase">
                  Risk Level
                </p>

                <div
                  className={`mt-2 flex items-center justify-center gap-2 ${
                    contract.riskLevel === 'High'
                      ? 'text-red-600'
                      : contract.riskLevel === 'Medium'
                      ? 'text-orange-500'
                      : 'text-green-600'
                  }`}
                >
                  {contract.riskLevel === 'High' ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <ShieldCheck className="w-8 h-8" />
                  )}

                  <span className="text-3xl font-bold uppercase">
                    {contract.riskLevel ||
                      'Unknown'}
                  </span>
                </div>

              </div>
            </div>

            {/* RISK COUNTS */}
            <div className="grid grid-cols-3 gap-4 text-center">

              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 font-bold">
                <span className="block text-2xl">
                  {highRisks.length}
                </span>
                High Risk Clauses
              </div>

              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-orange-800 font-bold">
                <span className="block text-2xl">
                  {mediumRisks.length}
                </span>
                Medium Risk Clauses
              </div>

              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-green-800 font-bold">
                <span className="block text-2xl">
                  {lowRisks.length}
                </span>
                Low Risk Clauses
              </div>

            </div>
          </div>

          {/* 4. EXTRACTED CONTRACT CLAUSES */}
          <div
            className="mb-8"
            style={{ pageBreakBefore: 'always' }}
          >
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">
              4. Extracted Contract Clauses
            </h3>

            <div className="space-y-4">

              {contract.clauses?.map(
                (c, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-300 rounded-lg overflow-hidden"
                    style={{
                      pageBreakInside:
                        'avoid',
                    }}
                  >

                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">

                      <div>
                        <span className="font-bold text-gray-900">
                          {c.title}
                        </span>

                        <span className="text-gray-500 text-xs ml-2">
                          (
                          {c.category ||
                            'General'}
                          {c.section &&
                          c.section !==
                            'Not specified'
                            ? ` - ${c.section}`
                            : ''}
                          )
                        </span>
                      </div>

                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          c.riskLevel ===
                          'High'
                            ? 'bg-red-100 text-red-700'
                            : c.riskLevel ===
                              'Medium'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {c.riskLevel ||
                          'Unknown'}{' '}
                        Risk (
                        {c.riskScore ?? 0}
                        /100)
                      </span>

                    </div>

                    <div className="p-4 text-sm text-gray-700 bg-white">
                      <p className="italic text-gray-600">
                        "{c.description ||
                          'No description available.'}"
                      </p>
                    </div>

                  </div>
                )
              )}

              {(!contract.clauses ||
                contract.clauses.length === 0) && (
                <p className="text-gray-500">
                  No clauses extracted.
                </p>
              )}

            </div>
          </div>

          {/* 5. CLAUSE-LEVEL RISK DETAILS */}
          {highRisks.length > 0 && (
            <div
              className="mb-8"
              style={{
                pageBreakBefore:
                  'always',
              }}
            >
              <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">
                5. Clause-Level Risk Details
              </h3>

              <div className="space-y-6">

                {highRisks.map(
                  (c, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg"
                      style={{
                        pageBreakInside:
                          'avoid',
                      }}
                    >
                      <h4 className="font-bold text-red-900 text-lg mb-2">
                        {c.title}
                      </h4>

                      <p className="mb-2">
                        <strong className="text-red-800">
                          Why is this risky?
                        </strong>{' '}
                        <span className="text-gray-800">
                          {c.whyRisky ||
                            'Not specified'}
                        </span>
                      </p>

                      <p className="mb-2">
                        <strong className="text-red-800">
                          Potential Impact:
                        </strong>{' '}
                        <span className="text-gray-800">
                          {c.potentialImpact ||
                            'Not specified'}
                        </span>
                      </p>

                      <p>
                        <strong className="text-red-800">
                          Recommended Action:
                        </strong>{' '}
                        <span className="text-gray-800">
                          {c.recommendedAction ||
                            'Not specified'}
                        </span>
                      </p>
                    </div>
                  )
                )}

              </div>
            </div>
          )}

          {/* 6. IMPORTANT DATES & OBLIGATIONS */}
          <div
            className="mb-8"
            style={{ pageBreakInside: 'avoid' }}
          >
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">
              6. Important Dates & Obligations
            </h3>

            {/* DATES */}
            <h4 className="font-bold text-gray-800 mb-2">
              Key Dates
            </h4>

            {contract.timeline &&
            contract.timeline.length > 0 ? (
              <table className="w-full mb-6 border-collapse border border-gray-300 text-sm">

                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left w-1/4">
                      Date
                    </th>

                    <th className="border border-gray-300 p-2 text-left w-1/4">
                      Event
                    </th>

                    <th className="border border-gray-300 p-2 text-left w-1/2">
                      Description
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {contract.timeline.map(
                    (t, idx) => (
                      <tr
                        key={idx}
                        className="bg-white"
                      >
                        <td className="border border-gray-300 p-2 font-medium">
                          {t.date ||
                            'Not specified'}
                        </td>

                        <td className="border border-gray-300 p-2 font-bold text-blue-800">
                          {t.label ||
                            'Event'}
                        </td>

                        <td className="border border-gray-300 p-2">
                          {t.description ||
                            'Not specified'}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            ) : (
              <p className="text-gray-500 mb-6">
                No important dates found.
              </p>
            )}

            {/* OBLIGATIONS */}
            <h4 className="font-bold text-gray-800 mb-2">
              Obligations
            </h4>

            {contract.obligations &&
            contract.obligations.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 text-sm">

                <thead>
                  <tr className="bg-gray-100">

                    <th className="border border-gray-300 p-2 text-left">
                      Obligation
                    </th>

                    <th className="border border-gray-300 p-2 text-left">
                      Party
                    </th>

                    <th className="border border-gray-300 p-2 text-left">
                      Deadline
                    </th>

                    <th className="border border-gray-300 p-2 text-left">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {contract.obligations.map(
                    (o, idx) => (
                      <tr
                        key={idx}
                        className="bg-white"
                      >

                        <td className="border border-gray-300 p-2">
                          {o.obligation ||
                            'Not specified'}
                        </td>

                        <td className="border border-gray-300 p-2 font-medium">
                          {o.party ||
                            'Not specified'}
                        </td>

                        <td className="border border-gray-300 p-2">
                          {o.deadline ||
                            'Not specified'}
                        </td>

                        <td className="border border-gray-300 p-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              o.status ===
                              'Active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {o.status ||
                              'Not specified'}
                          </span>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            ) : (
              <p className="text-gray-500">
                No specific obligations found.
              </p>
            )}
          </div>

          {/* 7. VERSION HISTORY */}
          <div
            className="mb-8"
            style={{ pageBreakInside: 'avoid' }}
          >
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">
              7. Version History
            </h3>

            <table className="w-full border-collapse border border-gray-300 text-sm">

              <thead>
                <tr className="bg-gray-100">

                  <th className="border border-gray-300 p-2 text-left">
                    Version
                  </th>

                  <th className="border border-gray-300 p-2 text-left">
                    Date
                  </th>

                  <th className="border border-gray-300 p-2 text-left">
                    Risk Score
                  </th>

                  <th className="border border-gray-300 p-2 text-left">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>
                <tr className="bg-blue-50">

                  <td className="border border-gray-300 p-2 font-bold">
                    Version{' '}
                    {contract.versionNumber ||
                      'Current'}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {new Date(
                      contract.uploadedAt ||
                        Date.now()
                    ).toLocaleDateString()}
                  </td>

                  <td className="border border-gray-300 p-2 font-bold">
                    {contract.riskScore ??
                      0}
                  </td>

                  <td className="border border-gray-300 p-2 font-bold text-blue-700">
                    CURRENT VERSION
                  </td>

                </tr>
              </tbody>

            </table>
          </div>

          {/* 8. FINAL CONTRACT ASSESSMENT */}
          <div
            className="mb-4"
            style={{ pageBreakInside: 'avoid' }}
          >
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">
              8. Final Contract Assessment
            </h3>

            <div className="bg-gray-900 text-white p-6 rounded-lg">

              <p className="text-lg mb-4 text-center font-semibold">

                This contract is assessed as{' '}

                <span
                  className={`uppercase font-bold ${
                    contract.riskLevel ===
                    'High'
                      ? 'text-red-400'
                      : contract.riskLevel ===
                        'Medium'
                      ? 'text-orange-400'
                      : 'text-green-400'
                  }`}
                >
                  {contract.riskLevel ||
                    'Unknown'}{' '}
                  RISK
                </span>{' '}

                with an overall score of{' '}

                {contract.riskScore ?? 0}
/100.

              </p>

              <div className="grid grid-cols-2 gap-6 text-sm">

                {/* KEY RISK AREAS */}
                <div>

                  <h4 className="font-bold text-blue-300 border-b border-gray-700 pb-1 mb-2 uppercase">
                    Key Risk Areas
                  </h4>

                  <ul className="list-disc pl-4 space-y-1">

                    {highRisks
                      .slice(0, 3)
                      .map((r, i) => (
                        <li key={i}>
                          {r.title}
                        </li>
                      ))}

                    {highRisks.length ===
                      0 && (
                      <li className="text-gray-400">
                        No high-risk clauses detected.
                      </li>
                    )}

                  </ul>
                </div>

                {/* IMPORTANT TERMS */}
                <div>

                  <h4 className="font-bold text-blue-300 border-b border-gray-700 pb-1 mb-2 uppercase">
                    Important Terms
                  </h4>

                  <ul className="list-disc pl-4 space-y-1">

                    <li>
                      Payment terms:
                      {' '}
                      {contract.paymentTerms ||
                        'Not specified'}
                    </li>

                    <li>
                      Termination:
                      {' '}
                      {contract.terminationClause ||
                        'Not specified'}
                    </li>

                    <li>
                      Confidentiality:
                      {' '}
                      {contract.confidentiality ||
                        'Not specified'}
                    </li>

                  </ul>
                </div>

              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
              Generated by AI Contract Review Analyst •{' '}
              {new Date().toLocaleString()}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
