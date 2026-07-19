import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { parseBsDesign } from "../services/parser.js";
import { walkComponentTree, getAllTextContent } from "../services/tree-walker.js";
import { CHARACTER_LIMIT } from "../constants.js";
import { BsDesignFile, ProjectOverview } from "../types.js";

export function registerProjectTools(server: McpServer) {

  server.registerTool(
    "bs_read_project",
    {
      title: "Read Bootstrap Studio Project",
      description: `Read and analyze a .bsdesign file to get a complete project overview.

This tool parses Bootstrap Studio design files (gzip-compressed JSON) and returns a comprehensive summary including theme, pages, assets, collections, and project settings.

Args:
  - file_path (string): Absolute path to the .bsdesign file

Returns:
  Project overview with name, version, theme, bootstrap version, page list, assets (CSS, JS, images, fonts), and collections.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ file_path }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const overview: ProjectOverview = {
          name: data.design.name,
          id: data.design.id,
          version: data.version,
          bootstrapVersion: `Bootstrap ${data.design.framework}`,
          theme: data.design.settings.theme.type === 'builtin'
            ? data.design.settings.theme.id
            : `custom:${data.design.settings.theme.id}`,
          colorMode: data.design.colorMode,
          pages: data.design.pages.children.map(p => ({
            name: p.name,
            showInSitemap: p.properties.showInSitemap,
            includeInExport: p.includeInExport,
          })),
          assets: {
            images: data.design.assets.images.children?.map(i => i.name) || [],
            fonts: data.design.assets.fonts.children?.map(f => f.name) || [],
            css: data.design.assets.css.children?.map(c => c.name) || [],
            js: data.design.assets.js.children?.map(j => j.name) || [],
          },
          collections: data.design.collections.map(c => ({
            type: c.class === 'PageCollection' ? 'Blog Posts' : c.class === 'TagCollection' ? 'Blog Tags' : 'Blog Authors',
            name: c.name,
            itemCount: c.items.length,
          })),
        };

        let text = [
          `# Project: ${overview.name}`,
          ``,
          `**ID**: \`${overview.id}\``,
          `**File Version**: ${overview.version}`,
          `**Bootstrap**: ${overview.bootstrapVersion}`,
          `**Theme**: ${overview.theme}`,
          `**Color Mode**: ${overview.colorMode}`,
          ``,
          `## Pages (${overview.pages.length})`,
          ...overview.pages.map((p, i) =>
            `  ${i + 1}. \`${p.name}\` ${p.includeInExport ? '' : '(excluded from export)'}`
          ),
          ``,
          `## Assets`,
          `  - CSS: ${overview.assets.css.length ? overview.assets.css.join(', ') : 'none'}`,
          `  - JS: ${overview.assets.js.length ? overview.assets.js.join(', ') : 'none'}`,
          `  - Images: ${overview.assets.images.length}`,
          `  - Fonts: ${overview.assets.fonts.length}`,
          ``,
          `## Collections`,
          ...(overview.collections.length
            ? overview.collections.map(c => `  - ${c.type}: "${c.name}" (${c.itemCount} items)`)
            : ['  - None']),
        ].join('\n');

        if (text.length > CHARACTER_LIMIT) {
          text = text.substring(0, CHARACTER_LIMIT) + '\n\n... (truncated)';
        }

        return {
          content: [{ type: "text", text }],
          structuredContent: overview,
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error reading project: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_list_pages",
    {
      title: "List Pages in Bootstrap Studio Project",
      description: `List all pages in a .bsdesign file with their metadata and component counts.

Args:
  - file_path (string): Absolute path to the .bsdesign file

Returns:
  List of pages with name, export status, component count, and nested page structure.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ file_path }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);

        const pageDetails = data.design.pages.children.map(p => {
          const summary = walkComponentTree(p.name, p.html);
          return {
            name: p.name,
            includeInExport: p.includeInExport,
            showInSitemap: p.properties.showInSitemap,
            componentCount: summary.length,
            topLevelComponents: (p.html.children || [])
              .filter((c): c is typeof c & { class: string } => typeof c !== 'string')
              .map(c => c.class),
          };
        });

        let text = [
          `# Pages in "${data.design.name}"`,
          ``,
          `Total: ${pageDetails.length} page(s)`,
          ``,
        ];

        for (const page of pageDetails) {
          text.push(`## ${page.name}`);
          text.push(`- **Export**: ${page.includeInExport ? 'Yes' : 'No'}`);
          text.push(`- **Sitemap**: ${page.showInSitemap ? 'Yes' : 'No'}`);
          text.push(`- **Components**: ${page.componentCount}`);
          text.push(`- **Top-level**: ${page.topLevelComponents.join(' > ')}`);
          text.push(``);
        }

        return {
          content: [{ type: "text", text: text.join('\n') }],
          structuredContent: { pages: pageDetails },
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error listing pages: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_get_page_tree",
    {
      title: "Get Page Component Tree",
      description: `Get the complete component tree for a specific page in a .bsdesign file.

This tool shows the full nesting structure of Bootstrap Studio components on a page, including component types, labels, Bootstrap CSS classes, and text content.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - page_name (string, optional): Name of the page (e.g. "index.html"). If omitted, returns the first page.
  - max_depth (number, optional): Maximum nesting depth to display. Default: 10.

Returns:
  Component tree with type, label, text, Bootstrap classes, depth, and path for each component.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        page_name: z.string().optional().describe("Page name (e.g. 'index.html'). If omitted, first page is used."),
        max_depth: z.number().int().min(1).max(20).default(10).describe("Maximum nesting depth to display"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ file_path, page_name, max_depth }) => {
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
              text: `Page "${page_name}" not found. Available pages: ${pages.map(p => p.name).join(', ')}`
            }],
          };
        }

        const summary = walkComponentTree(page.name, page.html);
        const filtered = summary.filter(c => c.depth <= max_depth);
        const total = summary.length;

        let text = [
          `# Component Tree: ${page.name}`,
          ``,
          `Total components: ${total} (showing depth 0-${max_depth})`,
          ``,
        ];

        for (const comp of filtered) {
          const indent = '  '.repeat(comp.depth);
          const classStr = comp.bootstrapClass ? ` [.${comp.bootstrapClass.replace(/\s+/g, ' .')}]` : '';
          const labelStr = comp.label ? ` (label: "${comp.label}")` : '';
          const textStr = comp.textContent ? ` "${comp.textContent.substring(0, 80)}${comp.textContent.length > 80 ? '...' : ''}"` : '';
          text.push(`${indent}├─ ${comp.type}${labelStr}${classStr}${textStr}`);
        }

        const result = text.join('\n');
        const truncated = result.length > CHARACTER_LIMIT
          ? result.substring(0, CHARACTER_LIMIT) + `\n\n... (truncated, ${total} total components)`
          : result;

        return {
          content: [{ type: "text", text: truncated }],
          structuredContent: { pageName: page.name, totalComponents: total, components: filtered },
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error getting page tree: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );
}
