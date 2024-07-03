/// <reference types="node" />
import { Constructable, Identifier } from './types';
declare const CannotInjectValueError_base: {
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
export declare class CannotInjectValueError extends CannotInjectValueError_base {
    constructor(target: Constructable<unknown>, propertyOrIndex: string | symbol | number);
}
declare const NoTypeError_base: {
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
export declare class NoTypeError extends NoTypeError_base {
    constructor(message: string);
}
declare const NotFoundError_base: {
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
export declare class NotFoundError extends NotFoundError_base {
    constructor(identifier: Identifier);
}
declare const NoHandlerError_base: {
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
export declare class NoHandlerError extends NoHandlerError_base {
    constructor(handler: string);
}
declare const NoIdentifierError_base: {
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
export declare class NoIdentifierError extends NoIdentifierError_base {
    constructor(message: string);
}
declare const InjectionError_base: {
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
export declare class InjectionError extends InjectionError_base {
    constructor(message: string);
}
declare const LazyInjectConstructorError_base: {
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
export declare class LazyInjectConstructorError extends LazyInjectConstructorError_base {
    constructor(name: string);
}
declare const ScopeEscapeError_base: {
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
export declare class ScopeEscapeError extends ScopeEscapeError_base {
    constructor(target: Constructable<unknown>, propertyOrIndex: string | symbol | number, classScope: string, propScope: string);
}
export {};
