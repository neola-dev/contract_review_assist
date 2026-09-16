import mongoose from 'mongoose';

const contractVersionSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true
    },

    versionNumber: {
      type: Number,
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    uploadedAt: {
      type: Date,
      default: Date.now
    },

    analysisData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    riskScore: {
      type: Number,
      default: 0
    },

    riskLevel: {
      type: String,
      default: 'Low'
    }
  },
  {
    timestamps: true
  }
);

const ContractVersion = mongoose.model(
  'ContractVersion',
  contractVersionSchema
);

export default ContractVersion;