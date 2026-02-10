import mongoose from "mongoose";

const areraSchema = new mongoose.Schema(
  { any: mongoose.Schema.Types.Mixed },
  { strict: false }
);

const ARERA = mongoose.model("ARERA", areraSchema, "ARERA");

export default ARERA;