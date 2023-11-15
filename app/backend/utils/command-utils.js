import { execSync } from "child_process";

const runCommand = (cmd) => {
  try {
    return execSync(cmd).toString().trim();
  } catch {
    return null;
  }
};

const generateAESKeyIV = () => {
  const key = runCommand("openssl rand -hex 32");
  const iv = runCommand("openssl rand -hex 16");

  return {
    key,
    iv,
  };
};

export { runCommand, generateAESKeyIV };
