/**
 * @fileoverview MCP Server for PostgreSQL logs analysis
 * @author mcp-logs
 * @version 1.0.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { requestTables, describeTable } from "./tools/tableTool.js";
import { requestData } from "./tools/searchTool.js";

/**
 * Get current file directory for ES modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load environment variables from .env file
 */
dotenv.config({ path: path.join(__dirname, "../.env") });

/**
 * PostgreSQL connection pool configuration
 * @type {Pool}
 */
const client = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
});

/**
 * MCP Server instance for logs analysis
 * @type {McpServer}
 */
const server = new McpServer({
  name: "logsServer",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});
/**
 * MCP Tool: List database schemas
 * Retrieves all tables from the PostgreSQL database
 */
server.tool(
  "list-schema",
  "Liste les schémas de la base de données",
  async () => {
    const result = await requestTables(client);
    if (!result) {
      return {
        content: [
          {
            type: "text",
            text: "Echec de la connexion à la base",
          },
        ],
      };
    } else if (result.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Pas de table",
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    }
  }
);
/**
 * MCP Tool: Get table schema
 * Retrieves the structure (columns and data types) of a specific table
 * @param {Object} params - Tool parameters
 * @param {string} params.tableName - Name of the table
 * @param {string} params.schema - Schema containing the table
 */
server.tool(
  "table-schema",
  "récupère la structure d'une table",
  {
    tableName: z.string().describe("Nom de la table"),
    schema: z.string().describe("Schema contennant la table"),
  },
  async ({ tableName, schema }) => {
    const result = await describeTable(client, schema, tableName);
    if (!result) {
      return {
        content: [
          {
            type: "text",
            text: "Echec de la connexion à la base",
          },
        ],
      };
    } else if (result.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Pas de données",
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    }
  }
);
/**
 * MCP Tool: Query data from table
 * Executes a SELECT query with WHERE clause on a specific table
 * @param {Object} params - Tool parameters
 * @param {string} params.tableName - Name of the table to query
 * @param {string} params.whereClause - WHERE clause for the query
 */
server.tool(
  "query-data",
  "récupère des données dans la base",
  {
    tableName: z.string().describe("Nom de la table"),
    whereClause: z.string().describe("Clause WHERE"),
  },
  async ({ tableName, whereClause }) => {
    const result = await requestData(client, tableName, whereClause);
    if (!result) {
      return {
        content: [
          {
            type: "text",
            text: "Echec de la connexion à la base",
          },
        ],
      };
    } else if (result.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Pas de données",
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    }
  }
);

/**
 * Initialize STDIO transport and start MCP server
 */
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Serveur MCP démarré et en écoute...");
