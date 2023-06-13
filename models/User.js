import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
      email: {
        type: String,
        min: 6,
        max: 50,
        require: true,
        unique: true,
      },
      username: {
        type: String,
        min: 6,
        max: 20,
        require: true,
        unique: true,
      },
      password: {
        type: String,
        require: true,
        unique: true,
      },
    },
    { timestamps: true }
  );
  
  export default model("User", userSchema);