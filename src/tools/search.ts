import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { parseBsDesign } from "../services/parser.js";
import { searchComponents, getAllTextContent, walkComponentTree } from "../services/tree-walker.js";
import { CHARACTER_LIMIT } from "../constants.js";
import { BsDesignFile } from "../types.js";

export function registerSearchTools(server: McpServer) {

  server.registerTool(
    "bs_find_components",
    {
      title: "Find Components in Project",
      description: `Search for components in a .bsdesign file by type, label, or text content.

Use this to locate specific elements across all pages in your Bootstrap Studio project. Supports partial matching.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - query (string): Search term to find
  - search_in (enum, optional): Where to search - "all", "type", "label", or "text". Default: "all"
  - page_name (string, optional): Limit search to a specific page. Default: all pages.

Returns:
  List of matching components with type, label, text, path, and page name.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        query: z.string().min(1).describe("Search term"),
        search_in: z.enum(["all", "type", "label", "text"]).default("all").describe("Where to search"),
        page_name: z.string().optional().describe("Limit to specific page name"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ file_path, query, search_in, page_name }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const pages = data.design.pages.children.filter(p =>
          !page_name || p.name === page_name
        );

        const allResults = pages.flatMap(p =>
          searchComponents(p.name, p.html, query, search_in)
        );

        if (allResults.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No components found matching "${query}"${search_in !== 'all' ? ` in ${search_in}` : ''}.`
            }],
          };
        }

        let text = [
          `# Search: "${query}" (${search_in})`,
          ``,
          `Found ${allResults.length} match(es):`,
          ``,
        ];

        for (const r of allResults) {
          text.push(`## ${r.type}${r.label ? ` [${r.label}]` : ''}`);
          text.push(`- **Matched**: ${r.matched}`);
          text.push(`- **Page**: ${r.page}`);
          text.push(`- **Path**: ${r.path}`);
          if (r.textContent) text.push(`- **Text**: "${r.textContent.substring(0, 120)}${r.textContent.length > 120 ? '...' : ''}"`);
          text.push(``);
        }

        const result = text.join('\n');
        return {
          content: [{
            type: "text",
            text: result.length > CHARACTER_LIMIT ? result.substring(0, CHARACTER_LIMIT) + `\n\n... (${allResults.length} total matches)` : result
          }],
          structuredContent: { query, searchIn: search_in, count: allResults.length, results: allResults },
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error searching components: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_get_css",
    {
      title: "Get Custom CSS from Project",
      description: `Extract all custom CSS/SASS files and their content from a .bsdesign file.

Bootstrap Studio stores custom styles in the assets.css section. This tool retrieves them so you can review or modify them.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - file_name (string, optional): Get a specific CSS file by name. If omitted, returns all CSS files.

Returns:
  CSS file names and their content blocks.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        file_name: z.string().optional().describe("Specific CSS file name (e.g. 'styles.css')"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ file_path, file_name }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const cssFiles = data.design.assets.css.children || [];

        const targetFiles = file_name
          ? cssFiles.filter(f => f.name === file_name)
          : cssFiles;

        if (targetFiles.length === 0) {
          return {
            content: [{
              type: "text",
              text: file_name
                ? `CSS file "${file_name}" not found. Available: ${cssFiles.map(f => f.name).join(', ') || 'none'}`
                : 'No custom CSS files found in this project.'
            }],
          };
        }

        let text = [`# Custom CSS in "${data.design.name}"`, ``];

        for (const file of targetFiles) {
          text.push(`## ${file.name}`);
          text.push(`- **Priority**: ${file.priority}`);
          if (file.pageBlacklist.length) text.push(`- **Excluded from**: ${file.pageBlacklist.join(', ')}`);
          if (file.pageWhitelist.length) text.push(`- **Applied to**: ${file.pageWhitelist.join(', ')}`);

          const rawBlocks = file.blocks as Array<{ value?: string; content?: string }>;
          if (rawBlocks && rawBlocks.length > 0) {
            text.push(`- **Blocks**: ${rawBlocks.length}`);
            for (let i = 0; i < rawBlocks.length; i++) {
              const blockContent = rawBlocks[i].value || rawBlocks[i].content || '';
              if (blockContent) {
                text.push(``);
                text.push(`### Block ${i + 1}`);
                text.push('```css');
                text.push(blockContent.substring(0, 2000));
                if (blockContent.length > 2000) text.push('... (truncated)');
                text.push('```');
              }
            }
          }
          text.push(``);
        }

        const result = text.join('\n');
        return {
          content: [{
            type: "text",
            text: result.length > CHARACTER_LIMIT ? result.substring(0, CHARACTER_LIMIT) + '\n\n... (truncated)' : result
          }],
          structuredContent: { files: targetFiles.map(f => ({ name: f.name, priority: f.priority })) },
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error extracting CSS: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_get_js",
    {
      title: "Get Custom JavaScript from Project",
      description: `Extract all custom JS files and their content from a .bsdesign file.

Bootstrap Studio stores custom scripts in the assets.js section. This tool retrieves them.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - file_name (string, optional): Get a specific JS file by name. If omitted, returns all JS files.

Returns:
  JS file names and their content blocks.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        file_name: z.string().optional().describe("Specific JS file name"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ file_path, file_name }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const jsFiles = data.design.assets.js.children || [];

        const targetFiles = file_name
          ? jsFiles.filter(f => f.name === file_name)
          : jsFiles;

        if (targetFiles.length === 0) {
          return {
            content: [{
              type: "text",
              text: file_name
                ? `JS file "${file_name}" not found. Available: ${jsFiles.map(f => f.name).join(', ') || 'none'}`
                : 'No custom JS files found in this project.'
            }],
          };
        }

        let text = [`# Custom JavaScript in "${data.design.name}"`, ``];

        for (const file of targetFiles) {
          text.push(`## ${file.name}`);
          text.push(`- **Priority**: ${file.priority}`);

          const rawBlocks = file.blocks as Array<{ value?: string; content?: string }>;
          if (rawBlocks && rawBlocks.length > 0) {
            text.push(`- **Blocks**: ${rawBlocks.length}`);
            for (let i = 0; i < rawBlocks.length; i++) {
              const blockContent = rawBlocks[i].value || rawBlocks[i].content || '';
              if (blockContent) {
                text.push(``);
                text.push(`### Block ${i + 1}`);
                text.push('```javascript');
                text.push(blockContent.substring(0, 2000));
                if (blockContent.length > 2000) text.push('... (truncated)');
                text.push('```');
              }
            }
          }
          text.push(``);
        }

        const result = text.join('\n');
        return {
          content: [{
            type: "text",
            text: result.length > CHARACTER_LIMIT ? result.substring(0, CHARACTER_LIMIT) + '\n\n... (truncated)' : result
          }],
          structuredContent: { files: targetFiles.map(f => ({ name: f.name, priority: f.priority })) },
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error extracting JS: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_get_text_content",
    {
      title: "Get All Text Content from Page",
      description: `Extract all visible text content from a page in a .bsdesign file.

Useful for reviewing copy, checking placeholder text, or auditing content.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - page_name (string, optional): Page name. If omitted, first page is used.

Returns:
  All text content found on the page.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        page_name: z.string().optional().describe("Page name (e.g. 'index.html')"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ file_path, page_name }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const pages = data.design.pages.children;
        const page = page_name
          ? pages.find(p => p.name === page_name)
          : pages[0];

        if (!page) {
          return {
            content: [{
              type: "text",
              text: `Page "${page_name}" not found. Available: ${pages.map(p => p.name).join(', ')}`
            }],
          };
        }

        const textContent = getAllTextContent(page.html);

        let text = [
          `# Text Content: ${page.name}`,
          ``,
          textContent || '(No text content found)',
        ].join('\n');

        return {
          content: [{ type: "text", text }],
          structuredContent: { pageName: page.name, content: textContent },
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error extracting text: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );
}
