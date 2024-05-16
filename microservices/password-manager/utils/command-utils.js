import path from "path";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { CommandExecutor, CommandOutputType, RegularExecuteStrategy, CommandOutput, PipeExecuteStrategy } from "command-executor-lib";

const PIPE_PATH = process.env.PIPE_PATH || "./command-runner";
const PIPE_COMM_DIR = process.env.PIPE_COMM_DIR || "./pipe-comm";
const PIPE_OUTPUT_PATH = path.join(PIPE_COMM_DIR, "output.txt");
const PIPE_OUTPUT_CACHE_MINUTES = 3;
const PIPE_WAIT_SLEEP_TIME = 100; // milliseconds

class PipeCommand {
  constructor(cmd, outputPath = path.basename(PIPE_OUTPUT_PATH)) {
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

const sleep = (ms) => {
  const start = Date.now();
  while (Date.now() - start < ms) {}
};

const getFileLastModified = (filePath) => {
  if (!existsSync(filePath)) {
    return -1;
  }
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
  return new CommandOutput(CommandOutputType.Success, outputData);
};

const runScriptInPipe = (scriptFileName, password = null, args = []) => {
  const executorStrategy = new RegularExecuteStrategy();
  const executor = new CommandExecutor(executorStrategy);

  const scriptPath = path.join("scripts", scriptFileName);
  const copyScriptResult = executor.execute(`cp ${scriptPath} ${PIPE_COMM_DIR}`);
  if (copyScriptResult.type === CommandOutputType.Error) {
    return copyScriptResult;
  }

  const newScriptPath = path.join("pipe-comm", scriptFileName);
  let scriptRunningCommand = `sh ${newScriptPath} ${args.join(" ")}`;
  if (password !== null) {
    scriptRunningCommand = `PASSWORD="${password}" ${scriptRunningCommand}`;
  }

  const pipeExecutorStrategty = PipeExecuteStrategy.builder()
    .withPipePath(PIPE_PATH)
    .withCache(false) 
    .withOutputPath(PIPE_OUTPUT_PATH)
    .build();
  const pipeExecutor = new CommandExecutor(pipeExecutorStrategty);
  console.log(`Running script: ${scriptRunningCommand}`);
  const runScriptResult = pipeExecutor.execute(scriptRunningCommand);
  const newScriptPathOnDevice = path.join(PIPE_COMM_DIR, scriptFileName);
  executor.execute(`rm -f ${newScriptPathOnDevice}`);

  return runScriptResult;
};

export {
  runCommandInPipe,
  PipeCommand,
  PIPE_COMM_DIR,
  runScriptInPipe,
};
