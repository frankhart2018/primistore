import { ExecuteStrategy } from "./execute-strategy";
declare class CommandExecutor {
    cmd: string;
    strategy: ExecuteStrategy;
    constructor(cmd: string, strategy: ExecuteStrategy);
    execute: () => import("./command-output").CommandOutput;
}
export { CommandExecutor };
//# sourceMappingURL=command-executor.d.ts.map