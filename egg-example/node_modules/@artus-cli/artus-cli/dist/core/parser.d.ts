import parser from 'yargs-parser';
import { OptionConfig } from '../types';
import { ArtusCliError } from '../errors';
export interface ParsedCommandStruct {
    uid: string;
    cmd: string;
    cmds: string[];
    command: string;
    demanded: Positional[];
    optional: Positional[];
}
export interface Positional {
    cmd: string;
    variadic: boolean;
}
/** convert argv to camelCase key simpliy */
export declare function parseArgvKeySimple(argv: string | string[]): {
    raw: string;
    parsed: string;
}[];
/** parse argv to args, base on yargs-parser */
export declare function parseArgvToArgs(argv: string | string[], option?: {
    strictOptions?: boolean;
    optionConfig?: OptionConfig;
}): {
    args: parser.Arguments;
    error: ArtusCliError | undefined;
};
/** parse `<options>` or `[option]` and collect args */
export declare function parseArgvWithPositional(argv: string[], pos: Positional[], options?: OptionConfig): {
    result: Record<string, any>;
    unknownArgv: string[];
    unmatchPositionals: Positional[];
};
/** parse command string to struct */
export declare function parseCommand(cmd: string, binName: string): ParsedCommandStruct;
