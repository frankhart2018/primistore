import path from "path";
import {
  CommandExecutor,
  CommandOutputType,
  RegularExecuteStrategy,
  PipeExecuteStrategy,
  CommandOutput,
} from "command-executor-lib";

const PIPE_PATH = process.env.PIPE_PATH || "./command-runner";
const PIPE_COMM_DIR = process.env.PIPE_COMM_DIR || "./pipe-comm";
const PIPE_OUTPUT_PATH = path.join(PIPE_COMM_DIR, "output.txt");
const DEVICE_INFO_PIPE_OUTPUT_PATH = path.join(
  PIPE_COMM_DIR,
  "device-info-output.txt",
);

const runScriptInPipe = (
  scriptFileName: string,
  password: string | null = null,
  args: string[] = [],
): CommandOutput => {
  const executorStrategy = new RegularExecuteStrategy();
  const executor = new CommandExecutor(executorStrategy);

  const scriptPath = path.join("scripts", scriptFileName);
  const copyScriptResult = executor.execute(
    `cp ${scriptPath} ${PIPE_COMM_DIR}`,
  );
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

const convertStringToObject = (
  rawOutput: string,
  keyTransformer: object,
): object => {
  const systemInfo = {};
  const lines = rawOutput.split("\n");

  for (const line of lines) {
    const [key, val] = line.split(":", 2);
    const trimmedKey = key.trim();

    if (!(trimmedKey in keyTransformer)) {
      continue;
    }

    const transformedKey = keyTransformer[trimmedKey];
    const trimmedVal = val.trim();

    systemInfo[transformedKey] = trimmedVal;
  }

  return systemInfo;
};

const getDeviceInfo = (): object => {
  const executeStrategy = PipeExecuteStrategy.builder()
    .withPipePath(PIPE_PATH)
    .withCache(true)
    .withOutputPath(DEVICE_INFO_PIPE_OUTPUT_PATH)
    .build();
  const executor = new CommandExecutor(executeStrategy);
  const output = executor.execute("/usr/bin/landscape-sysinfo");

  const keyTransformer = {
    "System load": "System load",
    "Usage of /": "Storage",
    "Memory usage": "RAM usage",
    "Swap usage": "Swap usage",
    Temperature: "CPU Temperature",
    Processes: "Active Processes",
  };

  let systemInfo = {};
  if (output.type == CommandOutputType.Success) {
    systemInfo = convertStringToObject(output.value, keyTransformer);
    systemInfo["CPU Temperature"] = systemInfo["CPU Temperature"].split(" ")[0];
  } else {
    Object.values(keyTransformer).forEach((value) => {
      systemInfo[value] = "Cannot determine";
    });
  }

  return systemInfo;
};

export { PIPE_COMM_DIR, runScriptInPipe, getDeviceInfo };
