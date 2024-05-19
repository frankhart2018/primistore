import mongoose from "mongoose";

interface IPassword {
  aes_key: string;
  aes_iv: string;
  aes_last_rotated: string;
  pass_uid: string;
  charset_last_rotated: string;
  policy_id: string;
}

const schema = new mongoose.Schema<IPassword>(
  {
    aes_key: String,
    aes_iv: String,
    aes_last_rotated: String,
    pass_uid: String,
    charset_last_rotated: String,
    policy_id: String,
  },
  {
    collection: "passwords",
  },
);

export default schema;
export { IPassword };
