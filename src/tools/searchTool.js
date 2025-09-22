/**
 * @fileoverview Database search utilities for PostgreSQL
 * @author mcp-logs
 * @version 1.0.0
 */

/**
 * Executes a SELECT query with WHERE clause on a specific table
 * @param {Pool} client - PostgreSQL connection pool
 * @param {string} tableName - Name of the table to query
 * @param {string} whereClause - WHERE clause for the query (without WHERE keyword)
 * @returns {Promise<Array<Object>|undefined>} Array of row objects, or undefined on error
 * @example
 * const data = await requestData(client, 'logs', 'level = \'ERROR\' AND created_at > NOW() - INTERVAL \'7 days\'');
 * // Returns: [{ id: 1, level: 'ERROR', message: '...', ... }, ...]
 */
async function requestData(client, tableName, whereClause) {
  try {
    const result = await client.query(
      `SELECT * FROM "${tableName}" WHERE ${whereClause}`
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export { requestData };
