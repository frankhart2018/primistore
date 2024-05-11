import mongoose from "mongoose";
const schema = new mongoose.Schema<IPassword>(
  {},
  {
    collection: "passwords",
  }
);

export interface IPassword {
  aes_key: string,
  aes_iv: string,
  aes_last_rotated: string,
  pass_uid: string,
  charset_last_rotated: string,
}

export default schema;
