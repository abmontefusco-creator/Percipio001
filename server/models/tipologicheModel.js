
import mongoose from "mongoose";

const tipologicheSchema = new mongoose.Schema(
  { any: mongoose.Schema.Types.Mixed },
  { strict: false }
);

const Tipologiche = mongoose.model("Tipologiche", tipologicheSchema, "Tipologiche");

export default Tipologiche;