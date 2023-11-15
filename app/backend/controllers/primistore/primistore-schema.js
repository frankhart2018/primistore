import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    aes_key: String,
    aes_iv: String,
    pass_uid: String,
    charset_path: String,
  },
  {
    collection: "passwords",
  }
);

export default schema;
