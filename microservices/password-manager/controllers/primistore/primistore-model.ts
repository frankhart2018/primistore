import mongoose from "mongoose";

import passwordSchema from "./password-schema.js";
import policySchema from "./policy-schema.js";

const passwordModel = mongoose.model("PrimistoreModel", passwordSchema);
const policyModel = mongoose.model("PolicyModel", policySchema);

export { passwordModel, policyModel };
