/// <reference types="node" />
export declare function createErrorClass(name: string): {
    new (message: string | (() => string)): {
        readonly message: string;
        readonly name: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
