import React, { useState } from 'react';
import { FileText, UploadCloud, History, ArrowRight, AlertTriangle, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyContracts({ contracts, onOpenContract, onUploadNewVersion, onViewHistory, onDeleteContract }) {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (!contracts || contracts.length === 0) {
    return null;
  }

  const handleDelete = async (contractId, e) => {
    e.stopPropagation();
    setDeletingId(contractId);
    try {
      await onDeleteContract(contractId);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary">My Contracts</h2>
          <p className="text-xs text-textMuted mt-1">Manage and view your analyzed legal documents.</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-elevated border border-border rounded-lg text-textSecondary">
          {contracts.length} {contracts.length === 1 ? 'Contract' : 'Contracts'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map(contract => {
          const contractId = contract._id || contract.id;
          const currentVersion = (contract.versions && contract.versions.length > 0) ? contract.versions[0] : null;
          const versionId = currentVersion ? (currentVersion._id || currentVersion.id) : null;

          const riskLevel = currentVersion?.riskLevel || 'Low';
          const riskScore = currentVersion?.riskScore ?? 0;

          const riskColor = riskLevel === 'High' ? 'text-danger bg-danger/10 border-danger/20' :
                            riskLevel === 'Medium' ? 'text-warning bg-warning/10 border-warning/20' : 'text-success bg-success/10 border-success/20';

          const isDeleting = deletingId === contractId;
          const isConfirmingDelete = confirmDeleteId === contractId;

          return (
            <motion.div
              key={contractId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:border-border/80 relative"
            >
              <div>
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-background border border-border rounded-lg text-accent flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-textPrimary text-base leading-tight truncate" title={contract.title}>
                        {contract.title}
                      </h3>
                      <p className="text-xs text-textMuted mt-1 font-medium truncate">
                        {contract.contractType || 'Legal Document'}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex-shrink-0">
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 bg-danger/10 border border-danger/30 rounded-lg p-1">
                        <button
                          onClick={(e) => handleDelete(contractId, e)}
                          disabled={isDeleting}
                          className="px-2 py-1 bg-danger text-white text-[10px] font-bold rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                        >
                          {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                          className="px-1.5 py-1 text-[10px] font-bold text-textMuted hover:text-textPrimary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(contractId); }}
                        className="p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                        title="Delete Contract"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {currentVersion && (
                  <div className="bg-background border border-border rounded-lg p-3.5 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Current Version</span>
                      <span className="px-2 py-0.5 bg-elevated rounded text-[10px] font-bold text-textSecondary border border-border">
                        v{currentVersion.versionNumber || 1}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-border/50">
                      <span className="text-xs font-medium text-textSecondary">Risk Assessment</span>
                      <div className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 font-bold border ${riskColor}`}>
                        {riskLevel === 'High' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        {riskScore} / 100
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => onOpenContract(contractId, versionId)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-accent text-secondaryBg font-semibold rounded-lg text-sm hover:bg-accentSecondary transition-all"
                >
                  <span>Open Contract</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUploadNewVersion(contractId, contract.title)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-background hover:bg-elevated border border-border text-textSecondary font-medium rounded-lg text-xs transition-all"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    New Version
                  </button>
                  <button
                    onClick={() => onViewHistory(contractId)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-background hover:bg-elevated border border-border text-textSecondary font-medium rounded-lg text-xs transition-all"
                  >
                    <History className="w-3.5 h-3.5" />
                    History
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
