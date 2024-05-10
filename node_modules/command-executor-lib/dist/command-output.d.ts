declare enum CommandOutputType {
    Success = 0,
    Error = 1,
    TimedOut = 2
}
declare class CommandOutput {
    type: CommandOutputType;
    value: string;
    constructor(type: CommandOutputType, value: string);
}
export { CommandOutput, CommandOutputType };
//# sourceMappingURL=command-output.d.ts.map