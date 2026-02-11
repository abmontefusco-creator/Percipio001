import mongoose from "mongoose";

const reclamiAreraSchema = new mongoose.Schema(
  { any: mongoose.Schema.Types.Mixed },
  { strict: false }
);

const ReclamiArera = mongoose.model("ReclamiArera", reclamiAreraSchema, "ReclamiArera");

export default ReclamiArera;