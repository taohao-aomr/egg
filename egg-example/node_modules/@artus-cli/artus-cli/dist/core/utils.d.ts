import { ParsedCommand } from './parsed_command';
import { Command } from './command';
export declare class Utils {
    private readonly ctx;
    private readonly trigger;
    private readonly commands;
    /** forward to other command in same pipeline */
    forward<T extends Record<string, any> = Record<string, any>>(clz: typeof Command | ParsedCommand, args?: T): Promise<{
        result: any;
    }>;
    /** create new pipeline to execute */
    redirect(argv: string[]): Promise<void>;
}
