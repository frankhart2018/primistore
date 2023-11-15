import primistoreModel from "./primistore-model.js";

export const createPassword = (pass_uid, aes_key, aes_iv, charset_path) => {
  const query = { pass_uid };
  const update = {
    $setOnInsert: {
      pass_uid,
      aes_key,
      aes_iv,
      charset_path,
    },
  };

  const options = { upsert: true };
  return primistoreModel.findOneAndUpdate(query, update, options);
};

export const getPasswords = () => {
  return primistoreModel.find();
};

export const updatePasswordAES = (pass_uid, aes_key, aes_iv) => {
  const query = { pass_uid };
  const options = { new: true };

  const update = {
    $set: {
      aes_key: aes_key,
      aes_iv: aes_iv,
    },
  };

  return primistoreModel.findOneAndUpdate(query, update, options);
};
