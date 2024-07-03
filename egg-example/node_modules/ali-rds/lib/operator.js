"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = void 0;
const node_util_1 = require("node:util");
const sqlstring_1 = require("./sqlstring");
const literals_1 = __importDefault(require("./literals"));
const debug = (0, node_util_1.debuglog)('ali-rds:operator');
/**
 * Operator Interface
 */
class Operator {
    beforeQueryHandlers = [];
    afterQueryHandlers = [];
    get literals() { return literals_1.default; }
    beforeQuery(beforeQueryHandler) {
        this.beforeQueryHandlers.push(beforeQueryHandler);
    }
    afterQuery(afterQueryHandler) {
        this.afterQueryHandlers.push(afterQueryHandler);
    }
    escape(value, stringifyObjects, timeZone) {
        return sqlstring_1.SqlString.escape(value, stringifyObjects, timeZone);
    }
    escapeId(value, forbidQualified) {
        return sqlstring_1.SqlString.escapeId(value, forbidQualified);
    }
    format(sql, values, stringifyObjects, timeZone) {
        // if values is object, not null, not Array;
        if (!Array.isArray(values) && typeof values === 'object' && values !== null) {
            // object not support replace column like ??;
            return sql.replace(/\:(\w+)/g, (text, key) => {
                if (values.hasOwnProperty(key)) {
                    return sqlstring_1.SqlString.escape(values[key]);
                }
                // if values don't hasOwnProperty, return origin text;
                return text;
            });
        }
        return sqlstring_1.SqlString.format(sql, values, stringifyObjects, timeZone);
    }
    async query(sql, values) {
        // query(sql, values)
        if (values) {
            sql = this.format(sql, values);
        }
        if (this.beforeQueryHandlers.length > 0) {
            for (const beforeQueryHandler of this.beforeQueryHandlers) {
                const newSql = beforeQueryHandler(sql);
                if (newSql) {
                    sql = newSql;
                }
            }
        }
        debug('query %o', sql);
        const queryStart = Date.now();
        let rows;
        let lastError;
        try {
            rows = await this._query(sql);
            if (Array.isArray(rows)) {
                debug('query get %o rows', rows.length);
            }
            else {
                debug('query result: %o', rows);
            }
            return rows;
        }
        catch (err) {
            lastError = err;
            err.stack = `${err.stack}\n    sql: ${sql}`;
            debug('query error: %o', err);
            throw err;
        }
        finally {
            if (this.afterQueryHandlers.length > 0) {
                const execDuration = Date.now() - queryStart;
                for (const afterQueryHandler of this.afterQueryHandlers) {
                    afterQueryHandler(sql, rows, execDuration, lastError);
                }
            }
        }
    }
    async queryOne(sql, values) {
        const rows = await this.query(sql, values);
        return rows && rows[0] || null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async _query(_sql) {
        throw new Error('SubClass must impl this');
    }
    async count(table, where) {
        const sql = this.format('SELECT COUNT(*) as count FROM ??', [table]) +
            this._where(where);
        debug('count(%j, %j) \n=> %j', table, where, sql);
        const rows = await this.query(sql);
        return rows[0].count;
    }
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
    async select(table, option) {
        option = option || {};
        const sql = this._selectColumns(table, option.columns) +
            this._where(option.where) +
            this._orders(option.orders) +
            this._limit(option.limit, option.offset);
        debug('select(%o, %o) \n=> %o', table, option, sql);
        return await this.query(sql);
    }
    async get(table, where, option) {
        option = option || {};
        option.where = where;
        option.limit = 1;
        option.offset = 0;
        const rows = await this.select(table, option);
        return rows && rows[0] || null;
    }
    async insert(table, rows, option) {
        option = option || {};
        let insertRows;
        let firstObj;
        // insert(table, rows)
        if (Array.isArray(rows)) {
            firstObj = rows[0];
            insertRows = rows;
        }
        else {
            // insert(table, row)
            firstObj = rows;
            insertRows = [rows];
        }
        if (!option.columns) {
            option.columns = Object.keys(firstObj);
        }
        const params = [table, option.columns];
        const strs = [];
        for (const row of insertRows) {
            const values = [];
            for (const column of option.columns) {
                values.push(row[column]);
            }
            strs.push('(?)');
            params.push(values);
        }
        const sql = this.format('INSERT INTO ??(??) VALUES' + strs.join(', '), params);
        debug('insert(%o, %o, %o) \n=> %o', table, rows, option, sql);
        return await this.query(sql);
    }
    async update(table, row, option) {
        option = option || {};
        if (!option.columns) {
            option.columns = Object.keys(row);
        }
        if (!option.where) {
            if (!('id' in row)) {
                throw new Error('Can not auto detect update condition, please set option.where, or make sure obj.id exists');
            }
            option.where = {
                id: row.id,
            };
        }
        const sets = [];
        const values = [];
        for (const column of option.columns) {
            sets.push('?? = ?');
            values.push(column);
            values.push(row[column]);
        }
        const sql = this.format('UPDATE ?? SET ', [table]) +
            this.format(sets.join(', '), values) +
            this._where(option.where);
        debug('update(%o, %o, %o) \n=> %o', table, row, option, sql);
        return await this.query(sql);
    }
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
    async updateRows(table, updateRows) {
        if (!Array.isArray(updateRows)) {
            throw new Error('updateRows should be array');
        }
        /**
         * {
         *  column: {
         *    when: [ 'WHEN condition1 THEN ?', 'WHEN condition12 THEN ?' ],
         *    then: [ value1, value1 ]
         *  }
         * }
         */
        const SQL_CASE = {};
        // e.g. { id: [], column: [] }
        const WHERE = {};
        for (const updateRow of updateRows) {
            const row = updateRow.row ?? updateRow;
            let where = updateRow.where;
            const hasId = 'id' in row;
            if (!hasId && !where) {
                throw new Error('Can not auto detect updateRows condition, please set updateRow.where, or make sure updateRow.id exists');
            }
            // convert { id, column } to { row: { column }, where: { id } }
            if (hasId) {
                where = { id: updateRow.id };
            }
            let whereString = this._where(where);
            whereString = !whereString.includes('WHERE') ? whereString : whereString.substring(whereString.indexOf('WHERE') + 5);
            for (const key in row) {
                if (key === 'id')
                    continue;
                if (!SQL_CASE[key]) {
                    SQL_CASE[key] = { when: [], then: [] };
                }
                SQL_CASE[key].when.push(' WHEN ' + whereString + ' THEN ? ');
                SQL_CASE[key].then.push(row[key]);
            }
            for (const key in where) {
                if (!WHERE[key]) {
                    WHERE[key] = [];
                }
                if (!WHERE[key].includes(where[key])) {
                    WHERE[key].push(where[key]);
                }
            }
        }
        let SQL = 'UPDATE ?? SET ';
        let VALUES = [table];
        const TEMPLATE = [];
        for (const key in SQL_CASE) {
            let templateSql = ' ?? = CASE ';
            VALUES.push(key);
            templateSql += SQL_CASE[key].when.join(' ');
            VALUES = VALUES.concat(SQL_CASE[key].then);
            templateSql += ' ELSE ?? END ';
            TEMPLATE.push(templateSql);
            VALUES.push(key);
        }
        SQL += TEMPLATE.join(' , ');
        SQL += this._where(WHERE);
        /**
         * e.g.
         *
         * updateRows(table, [
         *  {id: 1, name: 'fengmk21', email: 'm@fengmk21.com'},
         *  {id: 2, name: 'fengmk22', email: 'm@fengmk22.com'},
         *  {id: 3, name: 'fengmk23', email: 'm@fengmk23.com'},
         * ])
         *
         * UPDATE `ali-sdk-test-user` SET
         *  `name` =
         *    CASE
         *      WHEN  `id` = 1 THEN 'fengmk21'
         *      WHEN  `id` = 2 THEN 'fengmk22'
         *      WHEN  `id` = 3 THEN 'fengmk23'
         *      ELSE `name` END,
         *  `email` =
         *    CASE
         *      WHEN  `id` = 1 THEN 'm@fengmk21.com'
         *      WHEN  `id` = 2 THEN 'm@fengmk22.com'
         *      WHEN  `id` = 3 THEN 'm@fengmk23.com'
         *      ELSE `email` END
         *  WHERE `id` IN (1, 2, 3)
         */
        const sql = this.format(SQL, VALUES);
        debug('updateRows(%o, %o) \n=> %o', table, updateRows, sql);
        return await this.query(sql);
    }
    async delete(table, where) {
        const sql = this.format('DELETE FROM ??', [table]) +
            this._where(where);
        debug('delete(%j, %j) \n=> %j', table, where, sql);
        return await this.query(sql);
    }
    _where(where) {
        if (!where) {
            return '';
        }
        const wheres = [];
        const values = [];
        for (const key in where) {
            const value = where[key];
            if (Array.isArray(value)) {
                wheres.push('?? IN (?)');
            }
            else {
                if (value === null || value === undefined) {
                    wheres.push('?? IS ?');
                }
                else {
                    wheres.push('?? = ?');
                }
            }
            values.push(key);
            values.push(value);
        }
        if (wheres.length > 0) {
            return this.format(' WHERE ' + wheres.join(' AND '), values);
        }
        return '';
    }
    _selectColumns(table, columns) {
        if (!columns || columns.length === 0) {
            columns = '*';
        }
        if (columns === '*') {
            return this.format('SELECT * FROM ??', [table]);
        }
        return this.format('SELECT ?? FROM ??', [columns, table]);
    }
    _orders(orders) {
        if (!orders) {
            return '';
        }
        if (typeof orders === 'string') {
            orders = [orders];
        }
        const values = [];
        for (const value of orders) {
            if (typeof value === 'string') {
                values.push(this.escapeId(value));
            }
            else if (Array.isArray(value)) {
                // value format: ['name', 'desc'], ['name'], ['name', 'asc']
                let sort = String(value[1]).toUpperCase();
                if (sort !== 'ASC' && sort !== 'DESC') {
                    sort = '';
                }
                if (sort) {
                    values.push(this.escapeId(value[0]) + ' ' + sort);
                }
                else {
                    values.push(this.escapeId(value[0]));
                }
            }
        }
        return ' ORDER BY ' + values.join(', ');
    }
    _limit(limit, offset) {
        if (!limit || typeof limit !== 'number') {
            return '';
        }
        if (typeof offset !== 'number') {
            offset = 0;
        }
        return ' LIMIT ' + offset + ', ' + limit;
    }
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
    async locks(lockTableOptions) {
        const sql = this.#locks(lockTableOptions);
        debug('lock tables \n=> %o', sql);
        return await this.query(sql);
    }
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
    async lockOne(tableName, lockType, tableAlias) {
        const sql = this.#locks([{ tableName, lockType, tableAlias }]);
        debug('lock one table \n=> %o', sql);
        return await this.query(sql);
    }
    #locks(lockTableOptions) {
        if (lockTableOptions.length === 0) {
            throw new Error('Cannot lock empty tables.');
        }
        let sql = 'LOCK TABLES ';
        for (const [index, lockTableOption] of lockTableOptions.entries()) {
            const { tableName, lockType, tableAlias } = lockTableOption;
            if (!tableName) {
                throw new Error('No table_name provided while trying to lock table');
            }
            if (!lockType) {
                throw new Error('No lock_type provided while trying to lock table `' + tableName + '`');
            }
            if (!['READ', 'WRITE', 'READ LOCAL', 'LOW_PRIORITY WRITE'].includes(lockType.toUpperCase())) {
                throw new Error('lock_type provided while trying to lock table `' + tableName +
                    '` must be one of the following(CASE INSENSITIVE):\n`READ` | `WRITE` | `READ LOCAL` | `LOW_PRIORITY WRITE`');
            }
            if (index > 0) {
                sql += ', ';
            }
            sql += ' ' + this.escapeId(tableName) + ' ';
            if (tableAlias) {
                sql += ' AS ' + this.escapeId(tableAlias) + ' ';
            }
            sql += ' ' + lockType;
        }
        return sql + ';';
    }
    /**
     * To unlock all tables locked in current session.
     * For more details:
     * https://dev.mysql.com/doc/refman/8.0/en/lock-tables.html
     * @example
     * await unlock(); // unlock all tables.
     */
    async unlock() {
        debug('unlock tables');
        return await this.query('UNLOCK TABLES;');
    }
}
exports.Operator = Operator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvb3BlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUNBQXFDO0FBQ3JDLDJDQUF3QztBQUN4QywwREFBa0M7QUFVbEMsTUFBTSxLQUFLLEdBQUcsSUFBQSxvQkFBUSxFQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFM0M7O0dBRUc7QUFDSCxNQUFzQixRQUFRO0lBQ2xCLG1CQUFtQixHQUF5QixFQUFFLENBQUM7SUFDL0Msa0JBQWtCLEdBQXdCLEVBQUUsQ0FBQztJQUV2RCxJQUFJLFFBQVEsS0FBSyxPQUFPLGtCQUFRLENBQUMsQ0FBQyxDQUFDO0lBRW5DLFdBQVcsQ0FBQyxrQkFBc0M7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxVQUFVLENBQUMsaUJBQW9DO1FBQzdDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQVUsRUFBRSxnQkFBMEIsRUFBRSxRQUFpQjtRQUM5RCxPQUFPLHFCQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQVUsRUFBRSxlQUF5QjtRQUM1QyxPQUFPLHFCQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQVcsRUFBRSxNQUFXLEVBQUUsZ0JBQTBCLEVBQUUsUUFBaUI7UUFDNUUsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lB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