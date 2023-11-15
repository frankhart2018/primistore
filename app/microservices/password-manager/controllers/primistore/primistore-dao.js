import primistoreModel from "./primistore-model.js";

export const createPassword = (pass_uid, aes_key, aes_iv, charset_path) => {
  let currentTime = Math.floor(Date.now() / 1000).toString();

  const query = { pass_uid };
  const update = {
    $setOnInsert: {
      pass_uid,
      aes_key,
      aes_iv,
      charset_path,
      aes_last_rotated: currentTime,
      charset_last_rotated: currentTime,
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
  const currentTime = Math.floor(Date.now() / 1000).toString();

  const update = {
    $set: {
      aes_key: aes_key,
      aes_iv: aes_iv,
      aes_last_rotated: currentTime,
    },
  };

  return primistoreModel.findOneAndUpdate(query, update, options);
};

export const updatePasswordCharset = (pass_uid) => {
  const query = { pass_uid };
  const options = { new: true };
  const currentTime = Math.floor(Date.now() / 1000).toString();

  const update = {
    $set: {
      charset_last_rotated: currentTime,
    },
  };

  return primistoreModel.findOneAndUpdate(query, update, options);
};
