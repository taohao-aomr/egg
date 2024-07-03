export interface ReusifyOptions<T> {
    max: number;
    factory: () => T;
}
export declare class Reusify<T = any> {
    max: number;
    count: number;
    private head;
    private tail;
    private factory;
    constructor(options: ReusifyOptions<T>);
    get(): T;
    release(obj: T): void;
    private getInstance;
}
