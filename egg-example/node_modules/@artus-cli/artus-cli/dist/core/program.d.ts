/**
 * open api for user
 **/
import { OptionProps, MiddlewareInput, MiddlewareConfig } from '../types';
import { Command } from './command';
import { BinInfo } from './bin_info';
import { ParsedCommand } from './parsed_command';
type MaybeParsedCommand = (typeof Command) | ParsedCommand;
export declare class Program {
    private readonly trigger;
    private readonly parsedCommands;
    /** bin info, including pkgInfo and config */
    binInfo: BinInfo;
    /** all commands map */
    get commands(): Map<string, ParsedCommand>;
    /** root of command tree */
    get rootCommand(): ParsedCommand;
    /** the bin name */
    get binName(): string;
    /** package name */
    get name(): string;
    /** package version */
    get version(): string;
    /** bin base dir */
    get baseDir(): string;
    private getParsedCommand;
    /** add options, works in all command by default */
    option(opt: Record<string, OptionProps>, effectCommands?: MaybeParsedCommand[]): void;
    /** disable command dynamically */
    disableCommand(clz: MaybeParsedCommand): void;
    /** enable command dynamically */
    enableCommand(clz: MaybeParsedCommand): void;
    /** register pipeline middleware */
    use(fn: MiddlewareInput): Promise<void>;
    /** register middleware in command */
    useInCommand(clz: MaybeParsedCommand, fn: MiddlewareInput, opt?: Pick<MiddlewareConfig, 'mergeType'>): void;
    /** register middleware in command.run */
    useInExecution(clz: MaybeParsedCommand, fn: MiddlewareInput, opt?: Pick<MiddlewareConfig, 'mergeType'>): void;
}
export {};
