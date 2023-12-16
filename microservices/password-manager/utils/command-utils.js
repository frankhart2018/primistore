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

function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

const runCommandInPipe = (cmd) => {
  const stream = createWriteStream(PIPE_PATH);
  stream.write(cmd);
  stream.close();

  let output = new CommandOutput(
    CommandOutputType.Error,
    "Cannot run command inside pipe"
  );

  sleep(1000);
  if (existsSync(PIPE_OUTPUT_PATH)) {
    const outputData = readFileSync(PIPE_OUTPUT_PATH).toString();
    output = new CommandOutput(CommandOutputType.Success, outputData);
  }

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
