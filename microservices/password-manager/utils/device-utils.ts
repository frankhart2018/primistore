import path from "path";
import {
  CommandOutputType,
  PIPE_COMM_DIR,
  PipeCommand,
  runCommandInPipe,
  runCommand,
  runScriptInPipe,
} from "./command-utils.js";
import { CommandOutput } from "command-executor-lib/dist/command-output.js";

const DEVICE_INFO_PIPE_OUTPUT_PATH = path.join(
  PIPE_COMM_DIR,
  "device-info-output.txt"
);

const convertStringToObject = (rawOutput: string, keyTransformer: StringMap) => { // is keyTransformer string array?
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

const getDeviceInfo = () => {
  let output: CommandOutput;
  const command = new PipeCommand(
    "/usr/bin/landscape-sysinfo",
    "device-info-output.txt"
  );
  try {
    output = runCommandInPipe(command, true, DEVICE_INFO_PIPE_OUTPUT_PATH);
  } catch (e) {
    console.log(e);
    return {};
  }

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

export { getDeviceInfo };
