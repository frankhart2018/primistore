"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegularExecuteStrategy = void 0;
const child_process_1 = require("child_process");
const command_output_1 = require("./command-output");
class RegularExecuteStrategy {
    constructor() {
        this.execute = (cmd) => {
            try {
                const output = (0, child_process_1.execSync)(cmd.trim()).toString().trim();
                return new command_output_1.CommandOutput(command_output_1.CommandOutputType.Success, output);
            }
            catch (error) {
                return new command_output_1.CommandOutput(command_output_1.CommandOutputType.Error, error.message);
            }
        };
    }
}
exports.RegularExecuteStrategy = RegularExecuteStrategy;
