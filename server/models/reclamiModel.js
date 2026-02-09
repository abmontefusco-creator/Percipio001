import mongoose from "mongoose";

const reclamiSchema = new mongoose.Schema(
  { any: mongoose.Schema.Types.Mixed },
  { strict: false }
);

const Reclami = mongoose.model("Reclami", reclamiSchema, "Reclami");

export default Reclami;