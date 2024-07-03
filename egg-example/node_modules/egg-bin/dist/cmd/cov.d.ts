import { TestCommand } from './test';
export declare class CovCommand extends TestCommand {
    prerequire: boolean;
    x: string[];
    c8: string;
    get defaultExcludes(): string[];
    protected forkNode(modulePath: string, args: string[]): Promise<void>;
}
