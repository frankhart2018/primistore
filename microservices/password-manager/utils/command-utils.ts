import { execSync } from "child_process";
import path from "path";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { CommandExecutor, CommandOutputType, PipeExecuteStrategy } from "command-executor-lib"

const PIPE_PATH = "/command-runner";
const PIPE_COMM_DIR = "/pipe-comm";
const PIPE_OUTPUT_PATH = path.join(PIPE_COMM_DIR, "output.txt");
const PIPE_OUTPUT_CACHE_MINUTES = 3;
const PIPE_WAIT_SLEEP_TIME = 100; // milliseconds

// const CommandOutputType = {
//   Success: 0,
//   Error: 1,
// };

class CommandOutput {
  type: CommandOutputType
  value: string
  constructor(type: CommandOutputType, value: string) {
    this.type = type;
    this.value = value;
  }
}

class PipeCommand {
  private cmd: string
  private outputPath: string
  constructor(cmd: string, outputPath: string = path.basename(PIPE_OUTPUT_PATH)) {
    this.cmd = cmd;
    this.outputPath = outputPath;
  }

  serialize = () => {
    return JSON.stringify({
      cmd: this.cmd,
      outputPath: this.outputPath,
    });
  };
}

const runCommand = (cmd: string) => {
  try {
    const output = execSync(cmd).toString().trim();
    return new CommandOutput("success", output);
  } catch (e) {
    return new CommandOutput("success", e.message);
  }
};

const sleep = (ms: number) => {
  const start = Date.now();
  while (Date.now() - start < ms) {}
};

const getFileLastModified = (filePath: string) => {
  if (!existsSync(filePath)) {
    return -1;
  }
  let stats = statSync(filePath);
  return stats.mtimeMs;
};

const getCachedOutput = (filePath: string) => {
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
        "success",
        readFileSync(filePath).toString()
      );
    } else {
      lastModifiedCached = -1;
    }
  }

  return {
    lastModifiedCached,
    outputCached,
  };
};

const runCommandInPipe = (
  cmd: PipeCommand,
  withCache = false,
  outputPath = PIPE_OUTPUT_PATH
) => {
  if (!existsSync(PIPE_PATH)) {
    return new CommandOutput(
      "error",
      "Cannot run command inside pipe"
    );
  }

  let lastModified = getFileLastModified(outputPath);
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

  writeFileSync(PIPE_PATH, cmd.serialize());

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
  return new CommandOutput("success", outputData);
};

const runScriptInPipe = (scriptFileName: string, password: string = null, args?: string[]) => {
  const scriptPath = path.join("scripts", scriptFileName);
  const copyScriptResult = new CommandExecutor(`cp ${scriptPath} ${PIPE_COMM_DIR}`, new PipeExecuteStrategy()).execute();
  if (copyScriptResult.type === "error") {
    return copyScriptResult;
  }

  const newScriptPath = path.join("pipe-comm", scriptFileName);
  let scriptRunningCommand = `sh ${newScriptPath} ${args.join(" ")}`;
  if (password !== null) {
    scriptRunningCommand = `PASSWORD="${password}" ${scriptRunningCommand}`;
  }
  const runScriptResult = new CommandExecutor(scriptRunningCommand, new PipeExecuteStrategy()).execute();
  const newScriptPathOnDevice = path.join(PIPE_COMM_DIR, scriptFileName);
  new CommandExecutor(`rm -f ${newScriptPathOnDevice}`, new PipeExecuteStrategy()).execute();

  return runScriptResult;
};

const generateAESKeyIV = () => {
  const key = new CommandExecutor("openssl rand -hex 32", new PipeExecuteStrategy()).execute();
  const iv = new CommandExecutor("openssl rand -hex 16", new PipeExecuteStrategy()).execute();

  return {
    key,
    iv,
  };
};

const encryptWithAES = (key: string, iv: string, password: string): CommandOutput => {
  const encryptedOutput = new CommandExecutor(
    `echo "${password}" | openssl aes-256-cbc -e -a -K ${key} -iv ${iv}`
  , new PipeExecuteStrategy()).execute();

  return encryptedOutput;
};

export {
  runCommand,
  runCommandInPipe,
  generateAESKeyIV,
  encryptWithAES,
  CommandOutputType,
  PipeCommand,
  PIPE_COMM_DIR,
  runScriptInPipe,
};
