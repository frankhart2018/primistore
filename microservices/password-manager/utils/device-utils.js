import path from "path";
import {
  CommandOutputType,
  PIPE_COMM_DIR,
  PipeCommand,
  runCommandInPipe,
  runCommand,
} from "./command-utils.js";

const DEVICE_INFO_PIPE_OUTPUT_PATH = path.join(
  PIPE_COMM_DIR,
  "device-info-output.txt"
);

const convertStringToObject = (rawOutput, keyTransformer) => {
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
  let output;
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

const generateBackup = (password) => {
  const scriptFileName = "download-backup.sh";
  const scriptPath = path.join("scripts", scriptFileName);
  const copyScriptResult = runCommand(`cp ${scriptPath} ${PIPE_COMM_DIR}`);
  if (copyScriptResult.type === CommandOutputType.Error) {
    return copyScriptResult;
  }

  const newScriptPath = path.join("pipe-comm", scriptFileName);
  const pipedCommand = new PipeCommand(
    `echo "${password}" | sudo -S sh ${newScriptPath}`
  );
  const runScriptResult = runCommandInPipe(pipedCommand);
  const newScriptPathOnDevice = path.join(PIPE_COMM_DIR, scriptFileName);
  runCommand(`rm -f ${newScriptPathOnDevice}`);

  return runScriptResult;
};

export { getDeviceInfo, generateBackup };
