import mysql from 'mysql';
import type { PoolConfig, Pool } from 'mysql';
import type { PoolConnectionPromisify } from './types';
import { Operator } from './operator';
import { RDSConnection } from './connection';
import { RDSTransaction } from './transaction';
interface PoolPromisify extends Omit<Pool, 'query'> {
    query(sql: string): Promise<any>;
    getConnection(): Promise<PoolConnectionPromisify>;
    end(): Promise<void>;
    _acquiringConnections: any[];
    _allConnections: any[];
    _freeConnections: any[];
    _connectionQueue: any[];
}
export declare class RDSClient extends Operator {
    #private;
    static get literals(): {
        now: import("./literals").Literal;
        Literal: typeof import("./literals").Literal;
    };
    static get escape(): typeof mysql.escape;
    static get escapeId(): typeof mysql.escapeId;
    static get format(): typeof mysql.format;
    static get raw(): typeof mysql.raw;
    constructor(options: PoolConfig);
    protected _query(sql: string): Promise<any>;
    get pool(): PoolPromisify;
    get stats(): {
        acquiringConnections: number;
        allConnections: number;
        freeConnections: number;
        connectionQueue: number;
    };
    getConnection(): Promise<RDSConnection>;
    /**
     * Begin a transaction
     *
     * @return {RDSTransaction} transaction instance
     */
    beginTransaction(): Promise<RDSTransaction>;
    /**
     * Auto commit or rollback on a transaction scope
     *
     * @param {Function} scope - scope with code
     * @param {Object} [ctx] - transaction env context, like koa's ctx.
     *   To make sure only one active transaction on this ctx.
     * @return {Object} - scope return result
     */
    beginTransactionScope(scope: (transaction: RDSTransaction) => Promise<any>, ctx?: any): Promise<any>;
    /**
     * doomed to be rollbacked after transaction scope
     * useful on writing tests which are related with database
     *
     * @param {Function} scope - scope with code
     * @param {Object} [ctx] - transaction env context, like koa's ctx.
     *   To make sure only one active transaction on this ctx.
     * @return {Object} - scope return result
     */
    beginDoomedTransactionScope(scope: (transaction: RDSTransaction) => Promise<any>, ctx?: any): Promise<any>;
    end(): Promise<void>;
}
export {};
