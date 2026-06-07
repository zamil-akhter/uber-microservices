import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const BlacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema);

export default BlacklistToken;
