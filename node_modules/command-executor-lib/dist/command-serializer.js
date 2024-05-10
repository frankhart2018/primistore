"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSerializer = void 0;
class JsonSerializer {
    constructor(outputPath) {
        this.serialize = (command) => {
            return JSON.stringify({
                cmd: command,
                outputPath: this.outputPath,
            });
        };
        this.outputPath = outputPath;
    }
}
exports.JsonSerializer = JsonSerializer;
