import primistoreModel from "./primistore-model.js";

export const createPassword = (pass_uid, aes_key, aes_iv, charset_path) => {
  let query = { pass_uid };
  let update = {
    $setOnInsert: {
      pass_uid,
      aes_key,
      aes_iv,
      charset_path,
    },
  };

  let options = { upsert: true };
  return primistoreModel.findOneAndUpdate(query, update, options);
};
