import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  { any: mongoose.Schema.Types.Mixed },
  { strict: false }
);

export function getViewModel(viewName) {
  return (
    mongoose.models[viewName] ||
    mongoose.model(viewName, viewSchema, viewName)
  );
}