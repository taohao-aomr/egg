/// <reference types="node" />
import { ForkOptions } from 'node:child_process';
import { Command, CommandContext, Utils } from '@artus-cli/artus-cli';
export declare abstract class BaseCommand extends Command {
    dryRun: boolean;
    require: string[];
    ctx: CommandContext;
    utils: Utils;
    protected get base(): any;
    run(): Promise<void>;
    protected formatRequires(): Promise<string[]>;
    protected forkNode(modulePath: string, args: string[], options?: ForkOptions): Promise<void>;
}
