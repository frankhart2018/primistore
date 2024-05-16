import { CommandExecutor, RegularExecuteStrategy } from "command-executor-lib";

const generateAESKeyIV = () => {
  const executeStrategy = new RegularExecuteStrategy();
  const executor = new CommandExecutor(executeStrategy);

  const key = executor.execute("openssl rand -hex 32");
  const iv = executor.execute("openssl rand -hex 16");

  return {
    key,
    iv,
  };
};

const encryptWithAES = (key: string, iv: string, password: string) => {
  const executeStrategy = new RegularExecuteStrategy();
  const executor = new CommandExecutor(executeStrategy);

  return executor.execute(
    `echo "${password}" | openssl enc -aes-256-cbc -a -K ${key} -iv ${iv}`,
  );
};

export { generateAESKeyIV, encryptWithAES };
