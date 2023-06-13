import { Schema, model } from "mongoose";

const tokenSchema = new Schema({
  email: {
    type: String,
    ref: "User",
    require: true,
    unique: true,
  },
  token: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

export default model("token", tokenSchema);