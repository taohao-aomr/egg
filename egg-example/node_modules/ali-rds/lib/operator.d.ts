import { AfterQueryHandler, BeforeQueryHandler, DeleteResult, InsertOption, InsertResult, LockResult, LockTableOption, SelectOption, UpdateOption, UpdateResult, UpdateRow } from './types';
/**
 * Operator Interface
 */
export declare abstract class Operator {
    #private;
    protected beforeQueryHandlers: BeforeQueryHandler[];
    protected afterQueryHandlers: AfterQueryHandler[];
    get literals(): {
        now: import("./literals").Literal;
        Literal: typeof import("./literals").Literal;
    };
    beforeQuery(beforeQueryHandler: BeforeQueryHandler): void;
    afterQuery(afterQueryHandler: AfterQueryHandler): void;
    escape(value: any, stringifyObjects?: boolean, timeZone?: string): string;
    escapeId(value: any, forbidQualified?: boolean): string;
    format(sql: string, values: any, stringifyObjects?: boolean, timeZone?: string): string;
    query<T = any>(sql: string, values?: object | any[]): Promise<T>;
    queryOne(sql: string, values?: object | any[]): Promise<any>;
    protected _query(_sql: string): Promise<any>;
    count(table: string, where?: object): Promise<any>;
    /**
     * Select rows from a table
     *
     * @param  {String} table     table name
     * @param  {Object} [option] optional params
     *  - {Object} where          query condition object
     *  - {Array|String} columns  select columns, default is `'*'`
     *  - {Array|String} orders   result rows sort condition
     *  - {Number} limit          result limit count, default is no limit
     *  - {Number} offset         result offset, default is `0`
     * @return {Array} result rows
     */
    select(table: string, option?: SelectOption): Promise<any[]>;
    get(table: string, where?: object, option?: SelectOption): Promise<any>;
    insert(table: string, rows: object | object[], option?: InsertOption): Promise<InsertResult>;
    update(table: string, row: object, option?: UpdateOption): Promise<UpdateResult>;
    /**
     * Update multiple rows from a table
     *
     * UPDATE `table_name` SET
     *  `column1` CASE
     *     WHEN  condition1 THEN 'value11'
     *     WHEN  condition2 THEN 'value12'
     *     WHEN  condition3 THEN 'value13'
     *     ELSE `column1` END,
     *  `column2` CASE
     *     WHEN  condition1 THEN 'value21'
     *     WHEN  condition2 THEN 'value22'
     *     WHEN  condition3 THEN 'value23'
     *     ELSE `column2` END
     * WHERE condition
     *
     * See MySQL Case Syntax: https://dev.mysql.com/doc/refman/5.7/en/case.html
     *
     * @param {String} table table name
     * @param {Array<Object>} updateRows Object Arrays
     *    each Object needs a primary key `id`, or each Object has `row` and `where` properties
     *    e.g.
     *      [{ id: 1, name: 'fengmk21' }]
     *      or [{ row: { name: 'fengmk21' }, where: { id: 1 } }]
     * @return {object} update result
     */
    updateRows(table: string, updateRows: UpdateRow[]): Promise<UpdateResult>;
    delete(table: string, where?: object | null): Promise<DeleteResult>;
    protected _where(where?: object | null): string;
    protected _selectColumns(table: string, columns?: string | string[]): string;
    protected _orders(orders?: string | string[]): string;
    protected _limit(limit?: number, offset?: number): string;
    /**
     * Lock tables.
     * @param {object[]} lockTableOptions table lock descriptions.
     * @description
     * LOCK TABLES
     *   tbl_name [[AS] alias] lock_type
     *   [, tbl_name [[AS] alias] lock_type] ...
     * lock_type: {
     *   READ [LOCAL]
     *   | [LOW_PRIORITY] WRITE
     * }
     * For more details:
     * https://dev.mysql.com/doc/refman/8.0/en/lock-tables.html
     * @example
     * await locks([{ tableName: 'posts', lockType: 'READ', tableAlias: 't' }]);
     */
    locks(lockTableOptions: LockTableOption[]): Promise<any>;
    /**
     * Lock a single table.
     * @param {string} tableName table name
     * @param {string} lockType lock type
     * @param {string} tableAlias table alias
     * @description
     * LOCK TABLES
     *   tbl_name [[AS] alias] lock_type
     *   [, tbl_name [[AS] alias] lock_type] ...
     * lock_type: {
     *   READ [LOCAL]
     *   | [LOW_PRIORITY] WRITE
     * }
     * For more details:
     * https://dev.mysql.com/doc/refman/8.0/en/lock-tables.html
     * @example
     * await lockOne('posts_table', 'READ', 't'); // LOCK TABLS 'posts_table' AS t READ
     */
    lockOne(tableName: string, lockType: string, tableAlias: string): Promise<LockResult>;
    /**
     * To unlock all tables locked in current session.
     * For more details:
     * https://dev.mysql.com/doc/refman/8.0/en/lock-tables.html
     * @example
     * await unlock(); // unlock all tables.
     */
    unlock(): Promise<any>;
}
