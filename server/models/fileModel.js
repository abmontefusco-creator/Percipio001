import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  { any: mongoose.Schema.Types.Mixed },
  { strict: false }
);

const File = mongoose.model("File", fileSchema, "File");

export default File;