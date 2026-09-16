import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, FileText, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { contractApi } from '../services/api';

export default function VersionHistoryModal({ isOpen, onClose, contract, onViewVersion }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  const contractId = contract?._id || contract?.id;

  useEffect(() => {
    const fetchVersions = async () => {
      if (!isOpen || !contractId) return;
      setLoading(true);
      try {
        const data = await contractApi.getVersions(contractId);
        if (Array.isArray(data)) {
          setVersions(data);
        } else if (contract.versions) {
          setVersions(contract.versions);
        }
      } catch (err) {
        console.error('Failed to fetch versions:', err);
        if (contract.versions) {
          setVersions(contract.versions);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [isOpen, contractId]);

  if (!isOpen || !contract) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-background border border-border/60 shadow-2xl rounded-xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between bg-card/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-textPrimary">Version History</h2>
                <p className="text-xs text-textMuted mt-0.5">{contract.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-textMuted hover:text-textPrimary hover:bg-border/50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-background/30">
            {loading ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 text-accent animate-spin mb-2" />
                <span className="text-xs text-textMuted font-medium">Loading version history...</span>
              </div>
            ) : versions.length === 0 ? (
              <div className="py-12 text-center text-sm text-textMuted">
                No versions found for this contract.
              </div>
            ) : (
              <div className="space-y-4 relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-border z-0" />

                {versions.map((version, index) => {
                  const isCurrent = index === 0;
                  const versionId = version._id || version.id;
                  const riskLevel = version.riskLevel || 'Low';
                  const riskScore = version.riskScore ?? 0;
                  const riskColor = riskLevel === 'High' ? 'text-danger bg-danger/10 border-danger/20' :
                                    riskLevel === 'Medium' ? 'text-warning bg-warning/10 border-warning/20' : 'text-success bg-success/10 border-success/20';

                  return (
                    <div key={versionId || index} className="relative z-10 flex gap-4">
                      {/* Node */}
                      <div className="flex-shrink-0 w-12 flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full border-[3px] border-elevated mt-1 shadow-sm ${isCurrent ? 'bg-accent' : 'bg-border'}`} />
                      </div>

                      {/* Card */}
                      <div className={`flex-1 p-5 rounded-xl border transition-all ${isCurrent ? 'bg-card border-accent/40 shadow-sm ring-1 ring-accent/10' : 'bg-card border-border/50'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-textPrimary">
                                Version {version.versionNumber}
                              </h3>
                              {isCurrent && (
                                <span className="px-2 py-0.5 bg-accent text-secondaryBg text-[10px] font-bold uppercase rounded-full tracking-wide">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-textMuted mt-1">
                              File: <span className="font-semibold text-textSecondary">{version.fileName}</span> · Uploaded on {new Date(version.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${riskColor}`}>
                            {riskLevel === 'High' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                            Risk: {riskScore}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
                          <button
                            onClick={() => { onClose(); onViewVersion(contractId, versionId); }}
                            className="px-4 py-2 bg-background border border-border hover:bg-border text-textSecondary font-semibold rounded-lg text-sm transition-all flex items-center gap-1.5"
                          >
                            <FileText className="w-4 h-4 text-accent" />
                            <span>View Analysis Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
