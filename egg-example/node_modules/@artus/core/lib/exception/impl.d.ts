import { Middleware } from '@artus/pipeline';
import { ExceptionItem } from './types';
export declare const exceptionFilterMiddleware: Middleware;
export declare class ArtusStdError extends Error {
    name: string;
    private _code;
    private static codeMap;
    private static currentLocale;
    static registerCode(code: string, item: ExceptionItem): void;
    static setCurrentLocale(locale: string): void;
    constructor(code: string);
    private getFormatedMessage;
    get code(): string;
    get desc(): string;
    get detailUrl(): string | undefined;
}
