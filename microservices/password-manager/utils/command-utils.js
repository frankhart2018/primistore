import { execSync } from "child_process";
import {
  createWriteStream,
  existsSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";

const PIPE_PATH = "/command-runner";
const PIPE_OUTPUT_PATH = "/pipe-outputs/output.txt";
const PIPE_OUTPUT_CACHE_MINUTES = 3;
const PIPE_WAIT_SLEEP_TIME = 100; // milliseconds

const CommandOutputType = {
  Success: 0,
  Error: 1,
};

class CommandOutput {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

const runCommand = (cmd) => {
  try {
    const output = execSync(cmd).toString().trim();
    return new CommandOutput(CommandOutputType.Success, output);
  } catch (e) {
    return new CommandOutput(CommandOutputType.Error, e.message);
  }
};

const sleep = (ms) => {
  const start = Date.now();
  while (Date.now() - start < ms) {}
};

const getFileLastModified = (filePath) => {
  let stats = statSync(filePath);
  return stats.mtimeMs;
};

const getCachedOutput = (filePath) => {
  let lastModifiedCached = -1;
  let outputCached = null;
  if (existsSync(filePath)) {
    lastModifiedCached = getFileLastModified(filePath);
    const now = Date.now();
    const diff = (now - lastModifiedCached) / (1000 * 60);

    // If the last updated time was within threshold
    // Return the last result, no need to run the program again
    if (diff <= PIPE_OUTPUT_CACHE_MINUTES) {
      outputCached = new CommandOutput(
        CommandOutputType.Success,
        readFileSync(filePath).toString()
      );
    }

    return {
      lastModifiedCached,
      outputCached,
    };
  }
};

const runCommandInPipe = (
  cmd,
  withCache = false,
  outputPath = PIPE_OUTPUT_PATH
) => {
  if (!existsSync(PIPE_PATH)) {
    return new CommandOutput(
      CommandOutputType.Error,
      "Cannot run command inside pipe"
    );
  }

  let lastModified = -1;
  if (withCache && outputPath !== PIPE_OUTPUT_PATH) {
    const { lastModifiedCached, outputCached } = getCachedOutput(outputPath);
    if (lastModifiedCached !== -1) {
      return outputCached;
    }

    lastModified = lastModifiedCached;
  } else if (withCache && outputPath === PIPE_OUTPUT_PATH) {
    throw new Error(
      "If using cache, cannot use generic output path, as the contents are often overwritten!"
    );
  }

  writeFileSync(PIPE_PATH, cmd);

  // If output path does not exist, wait for it to be created
  // Edge case, will happen only first time
  if (lastModified === -1) {
    while (!existsSync(outputPath)) {
      sleep(PIPE_WAIT_SLEEP_TIME);
    }
  } else {
    // Otherwise wait for the file to be modified
    while (true) {
      const lastModifiedUpdated = getFileLastModified(outputPath);
      if (lastModified !== lastModifiedUpdated) {
        break;
      }
      sleep(PIPE_WAIT_SLEEP_TIME);
    }
  }

  const outputData = readFileSync(outputPath).toString();
  return new CommandOutput(CommandOutputType.Success, outputData);
};

const generateAESKeyIV = () => {
  const key = runCommand("openssl rand -hex 32");
  const iv = runCommand("openssl rand -hex 16");

  return {
    key,
    iv,
  };
};

const encryptWithAES = (key, iv, password) => {
  const encryptedOutput = runCommand(
    `echo "${password}" | openssl aes-256-cbc -e -a -K ${key} -iv ${iv}`
  );

  return encryptedOutput;
};

export {
  runCommand,
  runCommandInPipe,
  generateAESKeyIV,
  encryptWithAES,
  CommandOutputType,
};
