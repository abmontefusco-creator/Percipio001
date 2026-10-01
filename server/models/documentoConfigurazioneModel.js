import mongoose from "mongoose";

const documentoConfigurazioneSchema = new mongoose.Schema(
  {
    nomeFile: {
      type: String,
      required: true
    },

    tipoDocumento: {
      type: String,
      required: true,
      enum: [
        "TIPOLOGIE",
        "ARERA",
        "LETTERE",
        "TEMPLATE_FINITE"
      ]
    },

    reclamo: {
      type: Number,
      required: true,
      default: 0
    },

    valido: {
      type: Boolean,
      default: false
    },

    path: {
      type: String
    },

    fullPath: {
      type: String
    },

    publicUrl: {
      type: String
    },

    versione: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "DocumentoConfigurazione",
  documentoConfigurazioneSchema
);