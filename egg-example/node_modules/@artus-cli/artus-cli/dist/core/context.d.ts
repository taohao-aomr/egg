import { Context } from '@artus/pipeline';
export interface CommandInput {
    params: {
        argv: string[];
        env: Record<string, string | undefined>;
        cwd: string;
    };
}
export interface CommandOutput<T = any> {
    data: {
        result: T;
    };
}
/**
 * Command Context, store `argv`/`env`/`cwd`/`match result` ...
 */
export declare class CommandContext<InputArgs extends Record<string, any> = Record<string, any>, OutputResult = any> extends Context {
    private readonly parsedCommands;
    /** matched result */
    private matchResult;
    env: Record<string, string | undefined>;
    cwd: string;
    input: CommandInput;
    output: CommandOutput<OutputResult>;
    init(): this;
    /**
     * same as argv in process.argv
     * using `raw` instead of `argv` to avoid feeling confusing between `argv` and `args`
     */
    get raw(): string[];
    set raw(val: string[]);
    get commands(): Map<string, import("./parsed_command").ParsedCommand>;
    get rootCommand(): import("./parsed_command").ParsedCommand;
    get args(): InputArgs;
    get fuzzyMatched(): import("./parsed_command").ParsedCommand;
    get matched(): import("./parsed_command").ParsedCommand | undefined;
    get error(): import("..").ArtusCliError | undefined;
    private parse;
}
