#!/usr/bin/env node
/**
 * Bootstrap Studio MCP Server
 *
 * Provides tools for analyzing .bsdesign files, generating Bootstrap components,
 * and looking up Bootstrap documentation. Designed to complement Bootstrap Studio's
 * built-in AI assistant with file-level project analysis and code generation.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerProjectTools } from "./tools/project.js";
import { registerSearchTools } from "./tools/search.js";
import { registerGenerateTools } from "./tools/generate.js";
import { registerDocsTools } from "./tools/docs.js";
import { registerEditTools } from "./tools/edit.js";

const server = new McpServer({
  name: "bsdesign-mcp-server",
  version: "1.1.0",
});

registerProjectTools(server);
registerSearchTools(server);
registerGenerateTools(server);
registerDocsTools(server);
registerEditTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bootstrap Studio MCP server running via stdio");
}

main().catch(error => {
  console.error("Server error:", error);
  process.exit(1);
});
