import { Container } from '@artus/injection';
import { LoggerLevel } from './level';
import { LoggerOptions, LoggerType, LogOptions } from './types';
export default class Logger implements LoggerType {
    protected container: Container;
    protected get loggerOpts(): LoggerOptions;
    protected checkLoggerLevel(level: LoggerLevel): boolean;
    trace(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string | Error, ...args: any[]): void;
    fatal(message: string | Error, ...args: any[]): void;
    log({ level, message, splat, }: LogOptions): void;
}
