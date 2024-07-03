import { BaseCommand } from './base';
export declare class DevCommand extends BaseCommand {
    port: number;
    workers: number;
    framework: string;
    sticky: boolean;
    run(): Promise<void>;
    protected formatEggStartOptions(): Promise<{
        baseDir: any;
        workers: number;
        port: number;
        framework: string;
        typescript: any;
        tscompiler: any;
        sticky: boolean;
    }>;
}
