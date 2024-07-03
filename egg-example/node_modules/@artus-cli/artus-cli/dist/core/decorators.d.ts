import { Command } from './command';
import { MiddlewareInput, MiddlewareConfig, CommandConfig, OptionProps, ConvertTypeToBasicType, CommandMeta } from '../types';
export interface MiddlewareDecoratorOption extends Pick<MiddlewareConfig, 'mergeType'> {
}
export interface CommandDecoratorOption extends Pick<CommandMeta, 'overrideCommand' | 'inheritMetadata'> {
}
export declare function DefineCommand(opt?: CommandConfig, option?: CommandDecoratorOption): <T extends typeof Command>(target: T) => T;
export declare function Options<T extends Record<string, any> = Record<string, any>>(meta?: {
    [P in keyof Omit<T, '_' | '--'>]?: OptionProps<ConvertTypeToBasicType<T[P]>, T[P]>;
}): <G extends Command>(target: G, key: string) => void;
export declare function Option(descOrOpt?: string | OptionProps): <G extends Command>(target: G, key: string) => void;
export declare function Middleware(fn: MiddlewareInput, option?: MiddlewareDecoratorOption): <T extends Command | typeof Command>(target: T, key?: 'run') => void;
