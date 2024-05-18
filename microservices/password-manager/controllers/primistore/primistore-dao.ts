import { passwordModel, policyModel } from "./primistore-model.js";
import { IPassword } from "./password-schema.js";
import { IPolicy } from "./policy-schema.js";

export const createPassword = (
  pass_uid: string,
  aes_key: string,
  aes_iv: string
): Promise<IPassword | any> => {
  let currentTime = Math.floor(Date.now() / 1000).toString();

  const query = { pass_uid };
  const update = {
    $setOnInsert: {
      pass_uid,
      aes_key,
      aes_iv,
      aes_last_rotated: currentTime,
      charset_last_rotated: currentTime,
    },
  };

  const options = { upsert: true };
  return passwordModel.findOneAndUpdate(query, update, options);
};

export const getPasswords = (): Promise<IPassword[]> => {
  return passwordModel.find();
};

export const updatePasswordAES = (
  pass_uid: string,
  aes_key: string,
  aes_iv: string
): Promise<IPassword | null> => {
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

  return passwordModel.findOneAndUpdate(query, update, options);
};

export const updatePasswordCharset = (
  pass_uid: string
): Promise<IPassword | null> => {
  const query = { pass_uid };
  const options = { new: true };
  const currentTime = Math.floor(Date.now() / 1000).toString();

  const update = {
    $set: {
      charset_last_rotated: currentTime,
    },
  };

  return passwordModel.findOneAndUpdate(query, update, options);
};

export const getPasswordByPassUid = (
  pass_uid: string
): Promise<IPassword | null> => {
  return passwordModel.findOne({ pass_uid: pass_uid });
};

export const removePasswordByPassUid = (
  pass_uid: string
): Promise<IPassword | {}> => {
  return passwordModel.deleteOne({ pass_uid: pass_uid });
};

export const createPolicy = (
  policy_name: string,
  update_window_min: number,
  update_window_max: number
): Promise<IPolicy | any> => {
  const query = { policy_name };
  const update = {
    $setOnInsert: {
      policy_name,
      update_window_min,
      update_window_max,
    },
  };

  const options = { upsert: true, new: true };
  return policyModel.findOneAndUpdate(query, update, options);
};
