interface CommandSerializer {
    serialize: (command: string) => string;
}
declare class JsonSerializer implements CommandSerializer {
    outputPath: string;
    constructor(outputPath: string);
    serialize: (command: string) => string;
}
export { CommandSerializer, JsonSerializer };
//# sourceMappingURL=command-serializer.d.ts.map