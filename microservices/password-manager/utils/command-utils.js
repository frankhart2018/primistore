import { execSync } from "child_process";
import { createWriteStream, existsSync, readFileSync, unlinkSync } from "fs";

const PIPE_PATH = "/command-runner";
const PIPE_OUTPUT_PATH = "/output.txt";
const PIPED_CMD_TIMEOUT = 3000; // 3 seconds

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

const runCommandInPipe = (cmd) => {
  if (existsSync(PIPE_OUTPUT_PATH)) {
    unlinkSync(PIPE_OUTPUT_PATH);
  }

  const stream = createWriteStream(PIPE_PATH);
  stream.write(cmd);
  stream.close();

  const timeoutStart = Date.now();
  let output = null;
  const runLoop = setInterval(() => {
    if (Date.now() - timeoutStart > PIPED_CMD_TIMEOUT) {
      clearInterval(runLoop);
      output = new CommandOutput(CommandOutputType.Error, "Timed out");
    } else {
      if (existsSync(PIPE_OUTPUT_PATH)) {
        clearInterval(runLoop);
        const outputData = readFileSync(PIPE_OUTPUT_PATH).toString();
        if (existsSync(PIPE_OUTPUT_PATH)) {
          unlinkSync(PIPE_OUTPUT_PATH);
        }
        output = new CommandOutput(CommandOutputType.Success, outputData);
      } else {
        output = new CommandOutput(
          CommandOutputType.Error,
          "Failed to find run output"
        );
      }
    }
  }, PIPED_CMD_TIMEOUT);

  return output;
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
