export declare abstract class Command {
    /** Non-option arguments */
    '_': string[];
    /** Arguments after the end-of-options flag `--` */
    '--'?: string[];
    abstract run(...args: any[]): Promise<any>;
}
export declare class EmptyCommand extends Command {
    run(): Promise<void>;
}
