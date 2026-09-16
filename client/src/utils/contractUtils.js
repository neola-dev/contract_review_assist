export const normalizeContract = (data) => {
  if (!data) return null;

  // If data wraps analysis inside data.analysisData (like GET /api/contracts/:id/analysis or GET /api/versions/:id)
  const base = data.analysisData ? data.analysisData : data;

  const contractId = data.contractId || data._id || base.contractId || base._id || null;
  const versionId = data.versionId || base.versionId || base._id || null;
  const versionNumber = data.versionNumber || base.versionNumber || 1;
  const title = data.contractTitle || data.title || base.contractTitle || base.title || base.documentType || 'Contract';
  const fileName = data.fileName || base.fileName || 'document.pdf';
  const uploadedAt = data.uploadedAt || base.uploadedAt || new Date().toISOString();

  const riskScore = data.riskScore ?? base.riskScore ?? 0;
  const riskLevel = data.riskLevel || base.riskLevel || 'Low';

  const clauses = base.clauses || data.clauses || [];

  const statistics = base.statistics || data.statistics || {
    lowRisks: clauses.filter(c => c.riskLevel === 'Low').length,
    mediumRisks: clauses.filter(c => c.riskLevel === 'Medium').length,
    highRisks: clauses.filter(c => c.riskLevel === 'High').length,
    criticalClauses: clauses.filter(c => c.riskLevel === 'High').length,
  };

  const chartData = base.chartData || data.chartData || [
    { name: 'Payment', score: 80 },
    { name: 'Termination', score: 70 },
    { name: 'Liability', score: 65 },
    { name: 'Confidentiality', score: 90 },
    { name: 'Governing Law', score: 85 },
  ];

  return {
    ...base,
    _id: contractId,
    contractId,
    versionId,
    versionNumber,
    title,
    contractTitle: title,
    contractType: base.documentType || data.contractType || 'Legal Agreement',
    documentType: base.documentType || data.contractType || 'Legal Agreement',
    fileName,
    uploadedAt,
    riskScore,
    riskLevel,
    executiveSummary: base.executiveSummary || 'No executive summary provided.',
    partiesInvolved: base.partiesInvolved || 'Not specified',
    effectiveDate: base.effectiveDate || 'Not specified',
    expirationDate: base.expirationDate || 'Not specified',
    paymentTerms: base.paymentTerms || 'Not specified',
    terminationClause: base.terminationClause || 'Not specified',
    confidentiality: base.confidentiality || 'Not specified',
    jurisdiction: base.jurisdiction || 'Not specified',
    renewal: base.renewal || 'Not specified',
    governingLaw: base.governingLaw || 'Not specified',
    contractHealth: base.contractHealth || (riskLevel === 'High' ? 'High Risk' : riskLevel === 'Medium' ? 'Medium Risk' : 'Healthy'),
    statistics,
    timeline: base.timeline || [],
    obligations: base.obligations || [],
    clauses,
    chartData,
  };
};
