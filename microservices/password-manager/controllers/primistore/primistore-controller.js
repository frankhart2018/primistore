import fs, { existsSync } from "fs";
import path from "path";

import {
  CommandOutputType,
  PIPE_COMM_DIR,
  encryptWithAES,
  generateAESKeyIV,
  runCommand,
} from "../../utils/command-utils.js";
import {
  createPassword,
  getPasswordByPassUid,
  getPasswords,
  removePasswordByPassUid,
  updatePasswordAES,
  updatePasswordCharset,
} from "./primistore-dao.js";
import {
  encryptWithCharset,
  generateCharset,
} from "../../utils/charset-utils.js";
import { PRIMISTORE_DIR } from "../../utils/path-utils.js";
import { getCurrentTime } from "../../utils/date-utils.js";
import { generateBackup, getDeviceInfo } from "../../utils/device-utils.js";

const passwordCreationHandler = async (req, res, logger) => {
  const password_uid = req.body.identifier;

  const { key, iv } = generateAESKeyIV();
  if (
    key.type === CommandOutputType.Error ||
    iv.type === CommandOutputType.Error
  ) {
    let errorMessage = key.type == CommandOutputType.Error ? key.value : "";
    errorMessage += iv.type == CommandOutputType.Error ? iv.value : "";
    logger.error(`[${getCurrentTime()}] POST /password : Status 500`);
    res.status(500).send({
      error: errorMessage,
    });
    return;
  }

  const charset = generateCharset();
  const charset_path = path.join(PRIMISTORE_DIR, `charset-${password_uid}.txt`);
  fs.writeFileSync(charset_path, charset);

  await createPassword(password_uid, key.value, iv.value);

  logger.info(`[${getCurrentTime()}] POST /password : Status 200`);
  res.status(200).send({
    status: "success",
  });
};

const getAllPasswordsHandler = async (req, res, logger) => {
  const passwords = await getPasswords();
  logger.info(`[${getCurrentTime()}] GET /passwords : Status 200`);
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
    logger.error(
      `[${getCurrentTime()}] PUT /password/aes/${pass_uid} : Status 500`
    );
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

  logger.info(
    `[${getCurrentTime()}] PUT /password/aes/${pass_uid} : Status 200`
  );
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

  logger.info(
    `[${getCurrentTime()}] PUT /password/charset/${pass_uid} : Status 200`
  );
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
    logger.error(
      `[${getCurrentTime()}] POST /password/encrypt/${pass_uid} : Status 500`
    );
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

  logger.info(
    `[${getCurrentTime()}] POST /password/encrypt/${pass_uid} : Status 200`
  );
  res.status(200).send({
    encryptedPassword,
  });
};

const deletePasswordHandler = async (req, res, logger) => {
  const { pass_uid } = req.params;

  const passwordDetails = await getPasswordByPassUid(pass_uid);
  if (passwordDetails === null) {
    res.status(500).send({
      error: `Could not find password with id ${pass_uid}`,
    });
    return;
  }

  const charsetPath = path.join(PRIMISTORE_DIR, `charset-${pass_uid}.txt`);
  try {
    fs.unlinkSync(charsetPath);
  } catch (err) {
    logger.error(
      `[${getCurrentTime()}] DELETE /password/${pass_uid} : Status 500`
    );
    res.status(500).send({
      error: err.message,
    });
    return;
  }

  const output = await removePasswordByPassUid(pass_uid);

  logger.info(
    `[${getCurrentTime()}] DELETE /password/${pass_uid} : Status 200`
  );
  res.status(200).send({
    status: output.hasOwnProperty("acknowledged")
      ? output["acknowledged"]
      : false,
    pass_uid,
  });
};

const deviceInfoFetchHandler = async (req, res, logger) => {
  const deviceInfo = getDeviceInfo();

  logger.info(`[${getCurrentTime()}] GET /device/device-info : Status 200`);
  res.status(200).send({
    info: deviceInfo,
  });
};

const generateBackupHandler = (req, res, logger) => {
  const password = req.body.password;

  const genBackupOutput = generateBackup(password);
  if (genBackupOutput.type === CommandOutputType.Error) {
    logger.error(
      `[${getCurrentTime()}] POST /device/generate-backup : Status 500`
    );
    res.status(500).send({
      error: genBackupOutput.value,
    });
  } else {
    const snapshotName = genBackupOutput.value.trim();
    const snapshotPath = path.join(PIPE_COMM_DIR, snapshotName);
    if (!existsSync(snapshotPath)) {
      logger.error(
        `[${getCurrentTime()}] POST /device/generate-backup : Status 500`
      );
      res.status(500).send({
        error: `Snapshot ${snapshotPath} does not exist!`,
      });
    } else {
      logger.info(
        `[${getCurrentTime()}] POST /device/generate-backup : Status 200`
      );
      res.status(200).send({
        output: snapshotName,
      });
    }
  }
};

const downloadBackupHandler = (req, res, logger) => {
  const { snapshot_name } = req.params;

  const snapshotPath = path.join(PIPE_COMM_DIR, snapshot_name);
  if (!existsSync(snapshotPath)) {
    logger.error(
      `[${getCurrentTime()}] GET /device/generate-backup/download/${snapshot_name} : Status 500`
    );
    res.status(500).send({
      error: `Snapshot ${snapshot_name} does not exist!`,
    });
  } else {
    res.download(snapshotPath, snapshot_name, (err) => {
      if (err) {
        logger.error(
          `[${getCurrentTime()}] GET /device/generate-backup/download/${snapshot_name} : Status 500`
        );

        // Handle error, for example:
        res.status(500).send({
          message: "Error downloading file",
          error: err,
        });
      } else {
        logger.info(
          `[${getCurrentTime()}] GET /device/generate-backup/download/${snapshot_name} : Status 200`
        );
      }
    });
  }
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
  app.delete("/password/:pass_uid", (req, res) =>
    deletePasswordHandler(req, res, logger)
  );

  app.get("/device/device-info", (req, res) =>
    deviceInfoFetchHandler(req, res, logger)
  );
  app.post("/device/generate-backup", (req, res) =>
    generateBackupHandler(req, res, logger)
  );
  app.get("/device/generate-backup/download/:snapshot_name", (req, res) =>
    downloadBackupHandler(req, res, logger)
  );
};

export default PrimistoreController;
