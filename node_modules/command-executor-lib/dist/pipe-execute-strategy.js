"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeExecuteStrategy = void 0;
const fs_1 = require("fs");
const command_output_1 = require("./command-output");
const command_serializer_1 = require("./command-serializer");
const GENERIC_OUTPUT_PATH = "output.txt";
const PIPE_OUTPUT_CACHE_MINUTES = 3;
const PIPE_WAIT_SLEEP_TIME = 100; // 100ms
const DEFAULT_EXECUTION_TIMEOUT = 10000; // 10_000ms = 10s
class PipeExecuteStrategy {
    constructor() {
        this.getFileLastModified = (filePath) => {
            if (!(0, fs_1.existsSync)(filePath)) {
                return -1;
            }
            let stats = (0, fs_1.statSync)(filePath);
            return stats.mtimeMs;
        };
        this.getCachedOutput = (filePath) => {
            let cachedOutput = null;
            if ((0, fs_1.existsSync)(filePath)) {
                const lastModifiedCached = this.getFileLastModified(filePath);
                const now = Date.now();
                const diff = (now - lastModifiedCached) / (1000 * 60);
                // If the last updated time was within threshold
                // Return the last result, no need to run the program again
                if (diff <= PIPE_OUTPUT_CACHE_MINUTES) {
                    cachedOutput = new command_output_1.CommandOutput(command_output_1.CommandOutputType.Success, (0, fs_1.readFileSync)(filePath).toString());
                }
            }
            return cachedOutput;
        };
        this.sleep = (ms) => {
            const start = Date.now();
            while (Date.now() - start < ms) { }
        };
        this.waitForOutputWithTimeout = (lastModified) => {
            const start = Date.now();
            let didTimeout = false;
            const isTimedOut = () => {
                const now = Date.now();
                const diff = now - start;
                const result = diff > this.executionTimeout;
                if (result) {
                    didTimeout = true;
                }
                return result;
            };
            // If output path does not exist, wait for it to be created
            // Edge case, will happen only first time
            if (!(0, fs_1.existsSync)(this.outputPath)) {
                while (!(0, fs_1.existsSync)(this.outputPath) && !isTimedOut()) {
                    this.sleep(PIPE_WAIT_SLEEP_TIME);
                }
            }
            else {
                // Otherwise wait for the file to be modified
                while (true && !isTimedOut()) {
                    const lastModifiedUpdated = this.getFileLastModified(this.outputPath);
                    if (lastModified !== lastModifiedUpdated) {
                        break;
                    }
                    this.sleep(PIPE_WAIT_SLEEP_TIME);
                }
            }
            return didTimeout;
        };
        this.execute = (cmd) => {
            const cachedOutput = this.useCache
                ? this.getCachedOutput(this.outputPath)
                : null;
            if (cachedOutput !== null)
                return cachedOutput;
            (0, fs_1.writeFileSync)(this.pipePath, this.commandSerializer.serialize(cmd));
            const lastModified = this.getFileLastModified(this.outputPath);
            const didTimeout = this.waitForOutputWithTimeout(lastModified);
            if (didTimeout) {
                return new command_output_1.CommandOutput(command_output_1.CommandOutputType.TimedOut, `${cmd} timed out after ${this.executionTimeout}ms`);
            }
            const outputData = (0, fs_1.readFileSync)(this.outputPath).toString();
            return new command_output_1.CommandOutput(command_output_1.CommandOutputType.Success, outputData);
        };
        this.useCache = false;
        this.outputPath = GENERIC_OUTPUT_PATH;
        this.commandSerializer = new command_serializer_1.JsonSerializer(this.outputPath);
        this.executionTimeout = DEFAULT_EXECUTION_TIMEOUT;
    }
}
exports.PipeExecuteStrategy = PipeExecuteStrategy;
PipeExecuteStrategy.builder = () => {
    return new PipeExecuteStrategy.PipeExecuteStrategyBuilder();
};
PipeExecuteStrategy.PipeExecuteStrategyBuilder = class {
    constructor() {
        this.checkPath = (path, fileName) => {
            if (!(0, fs_1.existsSync)(path)) {
                throw new Error(`${fileName} does not exist!`);
            }
        };
        this.withPipePath = (pipePath) => {
            this.checkPath(pipePath, "Pipe path");
            this.container.pipePath = pipePath;
            return this;
        };
        this.withCache = (useCache) => {
            this.container.useCache = useCache;
            return this;
        };
        this.withOutputPath = (outputPath) => {
            this.container.outputPath = outputPath;
            this.container.commandSerializer = new command_serializer_1.JsonSerializer(outputPath);
            return this;
        };
        this.withExecutionTimeout = (executionTimeout) => {
            this.container.executionTimeout = executionTimeout;
            return this;
        };
        this.build = () => {
            if (this.container.pipePath === undefined) {
                throw new Error("Pipe path is required!");
            }
            return this.container;
        };
        this.container = new PipeExecuteStrategy();
    }
};
