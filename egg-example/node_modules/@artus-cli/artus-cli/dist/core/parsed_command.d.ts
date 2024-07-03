import { Middlewares } from '@artus/pipeline';
import { CommandConfig, OptionConfig, MiddlewareConfig, ExampleItem, OptionInjectMeta, OptionMeta } from '../types';
import { ParsedCommandStruct, Positional } from './parser';
import { Command } from './command';
export interface ParsedCommandOption {
    location?: string;
    commandConfig: FormattedCommandConfig;
    optionConfig?: Partial<OptionMeta> & {
        flagOptions: OptionConfig;
        argumentOptions: OptionConfig;
    };
}
export interface FormattedCommandConfig {
    enable: boolean;
    command: string;
    description: string;
    examples: ExampleItem[];
    alias: string[];
    parsedCommandInfo: ParsedCommandStruct;
    originalCommandConfig: CommandConfig;
}
/** Wrapper of command */
export declare class ParsedCommand implements ParsedCommandStruct {
    clz: typeof Command;
    /** cmds.join(' ') */
    uid: string;
    /** the last element of cmds, 'bin dev' is 'dev', 'bin module test [baseDir]' is 'test' */
    cmd: string;
    /** convert command to array, like [ 'bin', 'dev' ] */
    cmds: string[];
    /** user defined in options but remove bin name */
    command: string;
    alias: string[];
    enable: boolean;
    demanded: Positional[];
    optional: Positional[];
    description: string;
    examples: ExampleItem[];
    globalOptions?: OptionConfig;
    injections: OptionInjectMeta[];
    flagOptions: OptionConfig;
    argumentOptions: OptionConfig;
    /** Command class location */
    location?: string;
    /** child commands */
    childs: ParsedCommand[];
    /** parent command */
    parent: ParsedCommand | null;
    /** inherit command */
    inherit: ParsedCommand | null;
    commandConfig: CommandConfig;
    commandMiddlewares: Middlewares;
    executionMiddlewares: Middlewares;
    constructor(clz: typeof Command, option: ParsedCommandOption);
    get options(): OptionConfig;
    get isRoot(): boolean;
    get isRunable(): boolean;
    get depth(): number;
    addMiddlewares(type: 'command' | 'execution', config: MiddlewareConfig): void;
    updateGlobalOptions(opt: OptionConfig): void;
}
