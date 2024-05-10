"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandOutputType = exports.CommandOutput = void 0;
var CommandOutputType;
(function (CommandOutputType) {
    CommandOutputType[CommandOutputType["Success"] = 0] = "Success";
    CommandOutputType[CommandOutputType["Error"] = 1] = "Error";
    CommandOutputType[CommandOutputType["TimedOut"] = 2] = "TimedOut";
})(CommandOutputType || (exports.CommandOutputType = CommandOutputType = {}));
class CommandOutput {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
exports.CommandOutput = CommandOutput;
