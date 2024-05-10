import { CommandOutput } from "./command-output";
import { ExecuteStrategy } from "./execute-strategy";
declare class RegularExecuteStrategy implements ExecuteStrategy {
    execute: (cmd: string) => CommandOutput;
}
export { RegularExecuteStrategy };
//# sourceMappingURL=regular-execute-strategy.d.ts.map