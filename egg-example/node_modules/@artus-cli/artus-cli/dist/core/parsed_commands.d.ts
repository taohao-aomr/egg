/// <reference types="yargs-parser" />
import { Command } from './command';
import { ArtusCliError } from '../errors';
import { ParsedCommand } from './parsed_command';
import { ParsedCommandTree } from './parsed_command_tree';
export interface MatchResult {
    /**
     * total matched command
     */
    matched?: ParsedCommand;
    /**
     * fuzzy matched command
     */
    fuzzyMatched: ParsedCommand;
    /**
     * match error
     */
    error?: ArtusCliError;
    /**
     * parsed args by argv
     */
    args: Record<string, any>;
}
export declare class ParsedCommands {
    private readonly container;
    private readonly binInfo;
    get tree(): ParsedCommandTree;
    get root(): ParsedCommand;
    get commands(): Map<string, ParsedCommand>;
    /** match command by argv */
    private _matchCommand;
    /** parse argv with yargs-parser */
    parseArgs(argv: string | string[], parseCommand?: ParsedCommand): {
        args: import("yargs-parser").Arguments;
        error: ArtusCliError | undefined;
    };
    /** match command by argv */
    matchCommand(argv: string | string[]): MatchResult;
    /** get parsed command by command */
    getCommand(clz: typeof Command): ParsedCommand | undefined;
}
