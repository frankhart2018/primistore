import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    aes_key: String,
    aes_iv: String,
    aes_last_rotated: String,
    pass_uid: String,
    charset_path: String,
    charset_last_rotated: String,
  },
  {
    collection: "passwords",
  }
);

export default schema;
