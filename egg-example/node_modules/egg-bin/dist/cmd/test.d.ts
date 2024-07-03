import { BaseCommand } from './base';
export declare class TestCommand extends BaseCommand {
    files: string[];
    timeout: number | boolean;
    grep: string[];
    changed: boolean;
    parallel: boolean;
    jobs: number;
    autoAgent: boolean;
    mochawesome: boolean;
    bail: boolean;
    run(): Promise<void>;
    protected formatMochaArgs(): Promise<string[] | undefined>;
    protected getChangedTestFiles(dir: string, ext: string): Promise<string[]>;
}
