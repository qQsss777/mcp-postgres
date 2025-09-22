/**
 * @fileoverview Database table utilities for PostgreSQL
 * @author mcp-logs
 * @version 1.0.0
 */

/**
 * Retrieves all tables from the PostgreSQL database
 * Excludes system schemas (pg_catalog, information_schema)
 * @param {Pool} client - PostgreSQL connection pool
 * @returns {Promise<Array<Object>|undefined>} Array of table objects with schema and name, or undefined on error
 * @example
 * const tables = await requestTables(client);
 * // Returns: [{ table_schema: 'public', table_name: 'logs' }, ...]
 */
async function requestTables(client) {
  try {
    const result = await client.query(
      `SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema');`
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

/**
 * Retrieves the structure (columns and data types) of a specific table
 * @param {Pool} client - PostgreSQL connection pool
 * @param {string} schema - Database schema name
 * @param {string} tableName - Table name
 * @returns {Promise<Array<Object>|undefined>} Array of column objects with name and data type, or undefined on error
 * @example
 * const columns = await describeTable(client, 'public', 'logs');
 * // Returns: [{ column_name: 'id', data_type: 'integer' }, ...]
 */
async function describeTable(client, schema, tableName) {
  try {
    const result = await client.query(
      `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = '${schema}' AND table_name = '${tableName}';
      `
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export { requestTables, describeTable };
