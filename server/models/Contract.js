import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    contractType: {
      type: String,
      trim: true
    },

    currentVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractVersion',
      default: null
    },

    latestVersionNumber: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;