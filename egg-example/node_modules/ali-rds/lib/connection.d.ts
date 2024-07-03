import { Operator } from './operator';
import type { PoolConnectionPromisify } from './types';
export declare class RDSConnection extends Operator {
    conn: PoolConnectionPromisify;
    constructor(conn: PoolConnectionPromisify);
    release(): void;
    _query(sql: string): Promise<any>;
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
