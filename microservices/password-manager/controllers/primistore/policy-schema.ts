import mongoose from "mongoose";

interface IPolicy {
    policy_name: string;
    update_window_min: number;
    update_window_max: number;
}

const schema = new mongoose.Schema<any>(
  {
    policy_name: String,
    update_window_min: Number,
    update_window_max: Number,
  },
  {
    collection: "policies",
  },
);

export default schema;
export { IPolicy };
