"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandExecutor = void 0;
class CommandExecutor {
    constructor(cmd, strategy) {
        this.execute = () => {
            return this.strategy.execute(this.cmd);
        };
        this.cmd = cmd;
        this.strategy = strategy;
    }
}
exports.CommandExecutor = CommandExecutor;
