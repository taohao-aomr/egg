import { ParsedCommand } from './core/parsed_command';
export declare function isInheritFrom(clz: any, maybeParent: any): boolean;
export declare function checkCommandCompatible(command: ParsedCommand, compareCommand: ParsedCommand): boolean;
export declare function isNil(v: any): v is undefined | null;
export declare function convertValue<T extends string | string[]>(val: T, type: string): any;
export declare function readPkg(baseDir: string): Promise<{
    pkgPath: string;
    pkgInfo: any;
}>;
export declare function getCalleeList(traceLimit: number): {
    methodName: any;
    fileName: any;
}[];
export declare function getCalleeFile(stackIndex: number): string | undefined;
export declare function getCalleeDir(stackIndex: number): string | undefined;
export declare function formatToArray<T>(input?: T | T[]): T[];
export declare function formatCmd(cmd: string, obj: Record<string, any> & {
    $0: string;
}, prefix?: string): string;
export declare function formatDesc(info: string, obj: Record<string, any>): string;
