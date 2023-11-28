import fs from "fs";
import path from "path";

import {
  CommandOutputType,
  encryptWithAES,
  generateAESKeyIV,
} from "../../utils/command-utils.js";
import {
  createPassword,
  getPasswordByPassUid,
  getPasswords,
  updatePasswordAES,
  updatePasswordCharset,
} from "./primistore-dao.js";
import {
  encryptWithCharset,
  generateCharset,
} from "../../utils/charset-utils.js";
import { PRIMISTORE_DIR } from "../../utils/path-utils.js";

const passwordCreationHandler = async (req, res, logger) => {
  const password_uid = req.body.identifier;

  const { key, iv } = generateAESKeyIV();
  if (
    key.type === CommandOutputType.Error ||
    iv.type === CommandOutputType.Error
  ) {
    let errorMessage = key.type == CommandOutputType.Error ? key.value : "";
    errorMessage += iv.type == CommandOutputType.Error ? iv.value : "";
    logger.error("POST /password : Status 500");
    res.status(500).send({
      error: errorMessage,
    });
    return;
  }

  const charset = generateCharset();
  const charset_path = path.join(PRIMISTORE_DIR, `charset-${password_uid}.txt`);
  fs.writeFileSync(charset_path, charset);

  await createPassword(password_uid, key.value, iv.value);

  logger.info("POST /password : Status 200");
  res.status(200).send({
    status: "success",
  });
};

const getAllPasswordsHandler = async (req, res, logger) => {
  const passwords = await getPasswords();
  logger.info("GET /passwords : Status 200");
  return res.status(200).send(passwords);
};

const rotateAESKeyIVHandler = async (req, res, logger) => {
  const { pass_uid } = req.params;

  const { key, iv } = generateAESKeyIV();
  if (
    key.type === CommandOutputType.Error ||
    iv.type === CommandOutputType.Error
  ) {
    let errorMessage = key.type == CommandOutputType.Error ? key.value : "";
    errorMessage += iv.type == CommandOutputType.Error ? iv.value : "";
    logger.error(`PUT /password/aes/${pass_uid} : Status 500`);
    res.status(500).send({
      error: errorMessage,
    });
    return;
  }

  const updatedPassword = await updatePasswordAES(
    pass_uid,
    key.value,
    iv.value
  );

  logger.info(`PUT /password/aes/${pass_uid} : Status 200`);
  res.status(200).send({
    password: updatedPassword,
  });
};

const rotateCharsetHandler = async (req, res, logger) => {
  const { pass_uid } = req.params;

  const charsetPath = path.join(PRIMISTORE_DIR, `charset-${pass_uid}.txt`);
  const charset = generateCharset();

  fs.writeFileSync(charsetPath, charset);
  const updatedPassword = await updatePasswordCharset(pass_uid);

  logger.info(`PUT /password/charset/${pass_uid} : Status 200`);
  res.status(200).send({
    updatedCharset: charset,
    password: updatedPassword,
  });
};

const encryptPasswordHandler = async (req, res, logger) => {
  const { pass_uid } = req.params;
  const raw_password = req.body.password;

  const passwordDetails = await getPasswordByPassUid(pass_uid);
  const { aes_key, aes_iv } = passwordDetails;

  let encryptedPassword = encryptWithAES(aes_key, aes_iv, raw_password);
  if (encryptedPassword.type == CommandOutputType.Error) {
    logger.error(`POST /password/encrypt/${pass_uid} : Status 500`);
    res.status(500).send({
      error: encryptedPassword.value,
    });
    return;
  }

  const charsetPath = path.join(PRIMISTORE_DIR, `charset-${pass_uid}.txt`);
  let charset = fs
    .readFileSync(charsetPath)
    .toString("utf-8")
    .split("\n")
    .slice(0, -1);
  encryptedPassword = encryptWithCharset(charset, encryptedPassword.value);

  logger.info(`POST /password/encrypt/${pass_uid} : Status 200`);
  res.status(200).send({
    encryptedPassword,
  });
};

const PrimistoreController = (app, logger) => {
  app.post("/password", (req, res) =>
    passwordCreationHandler(req, res, logger)
  );
  app.get("/passwords", (req, res) => getAllPasswordsHandler(req, res, logger));
  app.put("/password/aes/:pass_uid", (req, res) =>
    rotateAESKeyIVHandler(req, res, logger)
  );
  app.put("/password/charset/:pass_uid", (req, res) =>
    rotateCharsetHandler(req, res, logger)
  );
  app.post("/password/encrypt/:pass_uid", (req, res) =>
    encryptPasswordHandler(req, res, logger)
  );
};

export default PrimistoreController;
