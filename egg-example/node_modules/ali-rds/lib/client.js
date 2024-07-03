"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDSClient = void 0;
const node_util_1 = require("node:util");
const mysql_1 = __importDefault(require("mysql"));
const operator_1 = require("./operator");
const connection_1 = require("./connection");
const transaction_1 = require("./transaction");
const literals_1 = __importDefault(require("./literals"));
class RDSClient extends operator_1.Operator {
    static get literals() { return literals_1.default; }
    static get escape() { return mysql_1.default.escape; }
    static get escapeId() { return mysql_1.default.escapeId; }
    static get format() { return mysql_1.default.format; }
    static get raw() { return mysql_1.default.raw; }
    #pool;
    constructor(options) {
        super();
        this.#pool = mysql_1.default.createPool(options);
        [
            'query',
            'getConnection',
            'end',
        ].forEach(method => {
            this.#pool[method] = (0, node_util_1.promisify)(this.#pool[method]);
        });
    }
    // impl Operator._query
    async _query(sql) {
        return await this.#pool.query(sql);
    }
    get pool() {
        return this.#pool;
    }
    get stats() {
        return {
            acquiringConnections: this.#pool._acquiringConnections.length,
            allConnections: this.#pool._allConnections.length,
            freeConnections: this.#pool._freeConnections.length,
            connectionQueue: this.#pool._connectionQueue.length,
        };
    }
    async getConnection() {
        try {
            const _conn = await this.#pool.getConnection();
            const conn = new connection_1.RDSConnection(_conn);
            if (this.beforeQueryHandlers.length > 0) {
                for (const handler of this.beforeQueryHandlers) {
                    conn.beforeQuery(handler);
                }
            }
            if (this.afterQueryHandlers.length > 0) {
                for (const handler of this.afterQueryHandlers) {
                    conn.afterQuery(handler);
                }
            }
            return conn;
        }
        catch (err) {
            if (err.name === 'Error') {
                err.name = 'RDSClientGetConnectionError';
            }
            throw err;
        }
    }
    /**
     * Begin a transaction
     *
     * @return {RDSTransaction} transaction instance
     */
    async beginTransaction() {
        const conn = await this.getConnection();
        try {
            await conn.beginTransaction();
        }
        catch (err) {
            conn.release();
            throw err;
        }
        const tran = new transaction_1.RDSTransaction(conn);
        if (this.beforeQueryHandlers.length > 0) {
            for (const handler of this.beforeQueryHandlers) {
                tran.beforeQuery(handler);
            }
        }
        if (this.afterQueryHandlers.length > 0) {
            for (const handler of this.afterQueryHandlers) {
                tran.afterQuery(handler);
            }
        }
        return tran;
    }
    /**
     * Auto commit or rollback on a transaction scope
     *
     * @param {Function} scope - scope with code
     * @param {Object} [ctx] - transaction env context, like koa's ctx.
     *   To make sure only one active transaction on this ctx.
     * @return {Object} - scope return result
     */
    async beginTransactionScope(scope, ctx) {
        ctx = ctx || {};
        if (!ctx._transactionConnection) {
            // Create only one conn if concurrent call `beginTransactionScope`
            ctx._transactionConnection = this.beginTransaction();
        }
        const tran = await ctx._transactionConnection;
        if (!ctx._transactionScopeCount) {
            ctx._transactionScopeCount = 1;
        }
        else {
            ctx._transactionScopeCount++;
        }
        try {
            const result = await scope(tran);
            ctx._transactionScopeCount--;
            if (ctx._transactionScopeCount === 0) {
                ctx._transactionConnection = null;
                await tran.commit();
            }
            return result;
        }
        catch (err) {
            if (ctx._transactionConnection) {
                ctx._transactionConnection = null;
                await tran.rollback();
            }
            throw err;
        }
    }
    /**
     * doomed to be rollbacked after transaction scope
     * useful on writing tests which are related with database
     *
     * @param {Function} scope - scope with code
     * @param {Object} [ctx] - transaction env context, like koa's ctx.
     *   To make sure only one active transaction on this ctx.
     * @return {Object} - scope return result
     */
    async beginDoomedTransactionScope(scope, ctx) {
        ctx = ctx || {};
        if (!ctx._transactionConnection) {
            ctx._transactionConnection = await this.beginTransaction();
            ctx._transactionScopeCount = 1;
        }
        else {
            ctx._transactionScopeCount++;
        }
        const tran = ctx._transactionConnection;
        try {
            const result = await scope(tran);
            ctx._transactionScopeCount--;
            if (ctx._transactionScopeCount === 0) {
                ctx._transactionConnection = null;
            }
            return result;
        }
        catch (err) {
            if (ctx._transactionConnection) {
                ctx._transactionConnection = null;
            }
            throw err;
        }
        finally {
            await tran.rollback();
        }
    }
    async end() {
        await this.#pool.end();
    }
}
exports.RDSClient = RDSClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5Q0FBc0M7QUFDdEMsa0RBQTBCO0FBRzFCLHlDQUFzQztBQUN0Qyw2Q0FBNkM7QUFDN0MsK0NBQStDO0FBQy9DLDBEQUFrQztBQVlsQyxNQUFhLFNBQVUsU0FBUSxtQkFBUTtJQUNyQyxNQUFNLEtBQUssUUFBUSxLQUFLLE9BQU8sa0JBQVEsQ0FBQyxDQUFDLENBQUM7SUFDMUMsTUFBTSxLQUFLLE1BQU0sS0FBSyxPQUFPLGVBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sS0FBSyxRQUFRLEtBQUssT0FBTyxlQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNoRCxNQUFNLEtBQUssTUFBTSxLQUFLLE9BQU8sZUFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDNUMsTUFBTSxLQUFLLEdBQUcsS0FBSyxPQUFPLGVBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXRDLEtBQUssQ0FBZ0I7SUFDckIsWUFBWSxPQUFtQjtRQUM3QixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQTZCLENBQUM7UUFDbkU7WUFDRSxPQUFPO1lBQ1AsZUFBZTtZQUNmLEtBQUs7U0FDTixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsdUJBQXVCO0lBQ2IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFXO1FBQ2hDLE9BQU8sTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFD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