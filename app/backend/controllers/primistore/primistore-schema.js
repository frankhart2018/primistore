import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    aes_key: String,
    aes_iv: String,
    pass_uid: String,
    pms_path: { type: String, default: "" },
    charset_path: String,
  },
  {
    collection: "passwords",
  }
);

export default schema;
