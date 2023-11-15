import fs from "fs";
import path from "path";

import { generateAESKeyIV } from "../../utils/command-utils.js";
import { createPassword, getPasswords } from "./primistore-dao.js";
import { generateCharset } from "../../utils/charset-utils.js";
import { PRIMISTORE_DIR } from "../../utils/path-utils.js";

const opensslNotInstalledError = (res) => {
  res.status(500).send({
    status: "OpenSSL not installed, cannot proceed!",
  });
};

const passwordCreationHandler = async (req, res) => {
  const password_uid = req.body.identifier;

  const { key, iv } = generateAESKeyIV();
  if (key === null || iv === null) {
    opensslNotInstalledError(res);
    return;
  }

  const charset = generateCharset();
  const charset_path = path.join(PRIMISTORE_DIR, `charset-${password_uid}.txt`);
  fs.writeFileSync(charset_path, charset);

  await createPassword(password_uid, key, iv, charset_path);

  res.status(200).send({
    status: "success",
  });
};

const getAllPasswordsHandler = async (req, res) => {
  const passwords = await getPasswords();
  return res.status(200).send(passwords);
};

const PrimistoreController = (app) => {
  app.post("/password", passwordCreationHandler);
  app.get("/passwords", getAllPasswordsHandler);
};

export default PrimistoreController;
