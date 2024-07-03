import { Command } from './command';
import { ParsedCommand } from './parsed_command';
/** Parsed Command Tree */
export declare class ParsedCommandTree {
    private readonly binInfo;
    /** root of command tree */
    root: ParsedCommand | undefined;
    /** command list, the key is command string used to match argv */
    commands: Map<string, ParsedCommand>;
    /** cache the instance of parsedCommand */
    parsedCommandMap: Map<typeof Command, ParsedCommand>;
    private get descObj();
    private resolveOptions;
    private formatCommandConfig;
    /** convert Command class to ParsedCommand instance */
    private initParsedCommand;
    build(commandList: Array<typeof Command>): void;
    get(clz: typeof Command): ParsedCommand | undefined;
}
