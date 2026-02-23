import mongoose from "mongoose";

const reclamiLettereSchema = new mongoose.Schema(
  { any: mongoose.Schema.Types.Mixed },
  { strict: false }
);

const ReclamiLettere = mongoose.model("ReclamiLettere", reclamiLettereSchema, "ReclamiLettere");

export default ReclamiLettere;