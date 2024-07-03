import { Command, Utils } from '@artus-cli/artus-cli';
export declare class DebugCommand extends Command {
    utils: Utils;
    run(): Promise<void>;
}
