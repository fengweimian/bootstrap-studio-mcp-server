import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { parseBsDesign, saveBsDesign } from "../services/parser.js";
import {
  removeComponent,
  addComponent,
  updateComponentProperties,
  setComponentText,
  setComponentLabel,
  setComponentCssClass,
  createComponent,
  navigateToComponent,
} from "../services/writer.js";
import { BsDesignFile, CssBlock, CssRule } from "../types.js";

function parseCssToBlocks(css: string): CssBlock[] {
  const blocks: CssBlock[] = [];
  const re = /([^{]+)\{([^}]+)\}/g;
  let match;
  while ((match = re.exec(css)) !== null) {
    const selector = match[1].trim();
    const body = match[2].trim();
    const rules: CssRule[] = [];
    const ruleLines = body.split(';');
    for (const line of ruleLines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const prop = line.substring(0, colonIdx).trim();
      const val = line.substring(colonIdx + 1).trim();
      if (prop && val) {
        rules.push({ property: prop, value: val, enabled: true, system: false });
      }
    }
    if (rules.length > 0) {
      blocks.push({
        selector,
        mediaQuery: false,
        containerQuery: false,
        system: false,
        enabled: true,
        rules,
      });
    }
  }
  return blocks;
}

export function registerEditTools(server: McpServer) {

  server.registerTool(
    "bs_remove_component",
    {
      title: "Remove Component from Page",
      description: `Remove a component from a page in a .bsdesign file by its path.

The path format uses type[index] segments, for example: /HTML[0]/Body[0]/Container[0]/Row[0]/Column[0]

Use bs_find_components to discover component paths first.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - page_name (string): Name of the page (e.g. "index.html")
  - component_path (string): Path to the component to remove (e.g. "HTML[0]/Body[0]/Container[0]/Row[0]")

Returns:
  Confirmation of removal.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        page_name: z.string().describe("Page name (e.g. 'index.html')"),
        component_path: z.string().describe("Path to component to remove (e.g. 'HTML[0]/Body[0]/Container[0]/Row[0]')"),
      }).strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ file_path, page_name, component_path }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const page = data.design.pages.children.find(p => p.name === page_name);
        if (!page) {
          return { content: [{ type: "text", text: `Page "${page_name}" not found.` }] };
        }

        const removed = removeComponent(page.html, component_path);

        if (!removed) {
          return { content: [{ type: "text", text: `Failed to remove component at path "${component_path}". Check the path is valid and not a root element.` }] };
        }

        await saveBsDesign(file_path, data);

        return {
          content: [{
            type: "text",
            text: `Removed component at "${component_path}" from page "${page_name}".`
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error removing component: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_add_component",
    {
      title: "Add Component to Page",
      description: `Add a new component to a page in a .bsdesign file.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - page_name (string): Name of the page (e.g. "index.html")
  - parent_path (string): Path to the parent component (e.g. "HTML[0]/Body[0]/Container[0]")
  - component_type (string): Bootstrap Studio component class (e.g. "Row", "Column", "Heading", "Paragraph", "Button", "Image", "Div", "Badge", "Card", "CardBody", "CardTitle", "CardText", "Form", "Input", "Select", "Textarea", "Label", "Checkbox", "Radio", "Alert", "Accordion", "AccordionItem", "Carousel", "CarouselItem", "Modal", "Table", "ListGroup", "Dropdown", "DropdownItem", "Progress", "Spinner", "Breadcrumb", "Pagination", "Offcanvas", "Toast", "Collapse")
  - label (string, optional): Label for the component
  - css_class (string, optional): Bootstrap CSS class string
  - text (string, optional): Text content for text-capable components (Heading, Paragraph, Button, Badge, etc.)
  - properties (object, optional): Additional properties as key-value pairs
  - position (number, optional): Insert position in parent's children. 0 = first. Omit to append.

Returns:
  Confirmation with the new component's path.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        page_name: z.string().describe("Page name (e.g. 'index.html')"),
        parent_path: z.string().describe("Path to parent component (e.g. 'HTML[0]/Body[0]/Container[0]')"),
        component_type: z.string().describe("Bootstrap Studio component class (e.g. 'Row', 'Column', 'Heading', 'Paragraph', 'Button', 'Div', 'Badge', 'Card')"),
        label: z.string().optional().describe("Label for the component"),
        css_class: z.string().optional().describe("Bootstrap CSS class string"),
        text: z.string().optional().describe("Text content"),
        properties: z.record(z.unknown()).optional().describe("Additional properties"),
        position: z.number().int().min(0).optional().describe("Insert position (0 = first). Omit to append."),
      }).strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ file_path, page_name, parent_path, component_type, label, css_class, text, properties, position }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const page = data.design.pages.children.find(p => p.name === page_name);
        if (!page) {
          return { content: [{ type: "text", text: `Page "${page_name}" not found.` }] };
        }

        const comp = createComponent({
          class: component_type,
          label,
          cssClass: css_class,
          text,
          properties: properties as Record<string, unknown> | undefined,
        });

        const added = addComponent(page.html, parent_path, comp, position);

        if (!added) {
          return { content: [{ type: "text", text: `Failed to add component. Check parent_path "${parent_path}" is valid.` }] };
        }

        await saveBsDesign(file_path, data);

        const result = navigateToComponent(page.html, parent_path);
        const parentChildren = result?.component.children || [];
        const newIndex = position !== undefined ? position : parentChildren.length - 1;
        const newPath = parent_path ? `${parent_path}/${component_type}[${newIndex}]` : `${component_type}[${newIndex}]`;

        return {
          content: [{
            type: "text",
            text: `Added ${component_type}${label ? ` [${label}]` : ''} at "${newPath}" on page "${page_name}".`
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error adding component: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_update_component",
    {
      title: "Update Component Properties",
      description: `Update properties of an existing component in a .bsdesign file.

Can update properties, CSS classes, text content, or label. Provide only the fields you want to change.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - page_name (string): Name of the page (e.g. "index.html")
  - component_path (string): Path to the component (e.g. "HTML[0]/Body[0]/Container[0]/Row[0]/Column[0]")
  - properties (object, optional): Properties to update as key-value pairs
  - css_class (string, optional): New Bootstrap CSS class string
  - text (string, optional): New text content
  - label (string, optional): New label for the component

Returns:
  Confirmation of what was updated.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        page_name: z.string().describe("Page name (e.g. 'index.html')"),
        component_path: z.string().describe("Path to component (e.g. 'HTML[0]/Body[0]/Container[0]/Row[0]/Column[0]')"),
        properties: z.record(z.unknown()).optional().describe("Properties to update"),
        css_class: z.string().optional().describe("New Bootstrap CSS class string"),
        text: z.string().optional().describe("New text content"),
        label: z.string().optional().describe("New label"),
      }).strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ file_path, page_name, component_path, properties, css_class, text, label }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const page = data.design.pages.children.find(p => p.name === page_name);
        if (!page) {
          return { content: [{ type: "text", text: `Page "${page_name}" not found.` }] };
        }

        const updates: string[] = [];

        if (properties) {
          const ok = updateComponentProperties(page.html, component_path, properties);
          if (ok) updates.push(`${Object.keys(properties).length} properties`);
          else return { content: [{ type: "text", text: `Component not found at "${component_path}".` }] };
        }

        if (css_class !== undefined) {
          const ok = setComponentCssClass(page.html, component_path, css_class);
          if (ok) updates.push(`CSS class to "${css_class}"`);
          else return { content: [{ type: "text", text: `Component not found at "${component_path}".` }] };
        }

        if (text !== undefined) {
          const ok = setComponentText(page.html, component_path, text);
          if (ok) updates.push(`text to "${text}"`);
          else return { content: [{ type: "text", text: `Component not found at "${component_path}".` }] };
        }

        if (label !== undefined) {
          const ok = setComponentLabel(page.html, component_path, label);
          if (ok) updates.push(`label to "${label}"`);
          else return { content: [{ type: "text", text: `Component not found at "${component_path}".` }] };
        }

        if (updates.length === 0) {
          return { content: [{ type: "text", text: "No changes specified. Provide at least one of: properties, css_class, text, label." }] };
        }

        await saveBsDesign(file_path, data);

        return {
          content: [{
            type: "text",
            text: `Updated ${updates.join(', ')} on "${component_path}" in page "${page_name}".`
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error updating component: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_set_css_code",
    {
      title: "Set Custom CSS Code",
      description: `Replace or append custom CSS code in a .bsdesign file.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - file_name (string): CSS file name (e.g. "styles.css")
  - block_index (number, optional): Which CSS block to replace (0-based). If omitted, appends a new block.
  - css_code (string): The CSS code to set

Returns:
  Confirmation of the CSS update.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        file_name: z.string().default("styles.css").describe("CSS file name (default: 'styles.css')"),
        block_index: z.number().int().min(0).optional().describe("CSS block index to replace. Omit to append."),
        css_code: z.string().describe("CSS code to set"),
      }).strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ file_path, file_name, block_index, css_code }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const cssFiles = data.design.assets.css.children || [];
        let target = cssFiles.find(f => f.name === file_name);

        if (!target) {
          target = {
            name: file_name,
            properties: {},
            priority: 0,
            pageBlacklist: [],
            pageWhitelist: [],
            blocks: [],
          };
          cssFiles.push(target);
          data.design.assets.css.children = cssFiles;
        }

        if (!target.blocks) (target.blocks as CssBlock[]) = [];
        const cssBlocks = target.blocks as CssBlock[];

        const newBlocks = parseCssToBlocks(css_code);

        if (block_index !== undefined) {
          if (block_index < cssBlocks.length) {
            cssBlocks[block_index] = newBlocks[0] || cssBlocks[block_index];
          } else {
            cssBlocks.push(...newBlocks);
          }
        } else {
          cssBlocks.push(...newBlocks);
        }

        await saveBsDesign(file_path, data);

        return {
          content: [{
            type: "text",
            text: `Updated CSS in "${file_name}" (${block_index !== undefined ? `block ${block_index} replaced` : `${newBlocks.length} block(s) appended`}).`
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error setting CSS: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );

  server.registerTool(
    "bs_set_js_code",
    {
      title: "Set Custom JavaScript Code",
      description: `Replace or append custom JavaScript code in a .bsdesign file.

Args:
  - file_path (string): Absolute path to the .bsdesign file
  - file_name (string): JS file name
  - block_index (number, optional): Which JS block to replace (0-based). If omitted, appends a new block.
  - js_code (string): The JavaScript code to set

Returns:
  Confirmation of the JS update.`,
      inputSchema: z.object({
        file_path: z.string().describe("Absolute path to the .bsdesign file"),
        file_name: z.string().default("scripts.js").describe("JS file name (default: 'scripts.js')"),
        block_index: z.number().int().min(0).optional().describe("JS block index to replace. Omit to append."),
        js_code: z.string().describe("JavaScript code to set"),
      }).strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ file_path, file_name, block_index, js_code }) => {
      try {
        const data: BsDesignFile = await parseBsDesign(file_path);
        const jsFiles = data.design.assets.js.children || [];
        let target = jsFiles.find(f => f.name === file_name);

        if (!target) {
          target = {
            name: file_name,
            properties: {},
            priority: 0,
            pageBlacklist: [],
            pageWhitelist: [],
            blocks: [],
          };
          jsFiles.push(target);
          data.design.assets.js.children = jsFiles;
        }

        if (block_index !== undefined) {
          if (!target.blocks) target.blocks = [];
          if (block_index >= target.blocks.length) {
            target.blocks.push({ value: js_code });
          } else {
            (target.blocks[block_index] as { value: string }).value = js_code;
          }
        } else {
          if (!target.blocks) target.blocks = [];
          target.blocks.push({ value: js_code });
        }

        await saveBsDesign(file_path, data);

        return {
          content: [{
            type: "text",
            text: `Updated JS in "${file_name}" (${block_index !== undefined ? `block ${block_index} replaced` : 'appended new block'}).`
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error setting JS: ${error instanceof Error ? error.message : String(error)}`
          }],
        };
      }
    }
  );
}
