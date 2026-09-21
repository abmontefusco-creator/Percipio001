import mongoose from "mongoose";

const reclamiRischiSchema = new mongoose.Schema(
  { any: mongoose.Schema.Types.Mixed },
  { strict: false }
);

const ReclamiRischi = mongoose.model("ReclamiRischi", reclamiRischiSchema, "ReclamiRischi");

export default ReclamiRischi;