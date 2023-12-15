import { runCommand } from "./command-utils.js";

const getCpuTemp = () => {
  return runCommand("vcgencmd measure_temp");
};

export { getCpuTemp };
