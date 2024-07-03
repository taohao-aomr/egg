import type { RDSConnection } from './connection';
import { Operator } from './operator';
export declare class RDSTransaction extends Operator {
    #private;
    isCommit: boolean;
    isRollback: boolean;
    conn: RDSConnection | null;
    constructor(conn: RDSConnection);
    commit(): Promise<void>;
    rollback(): Promise<void>;
    protected _query(sql: string): Promise<any>;
}
