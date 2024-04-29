import mongoose from "mongoose";

import primistoreSchema from "./primistore-schema.js";

const primistoreModel = mongoose.model("PrimistoreModel", primistoreSchema);

export default primistoreModel;