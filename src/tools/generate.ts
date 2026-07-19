import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  generateComponent,
  generateLayout,
  generateCustomCSS,
  generateCustomJS,
  compareBootstrapVersions,
  availableComponents,
  availableLayouts,
} from "../services/code-gen.js";

export function registerGenerateTools(server: McpServer) {

  server.registerTool(
    "bs_generate_component",
    {
      title: "Generate Bootstrap Component HTML",
      description: `Generate ready-to-use Bootstrap 5 component HTML that can be pasted into Bootstrap Studio's Custom Code panel.

Generates production-quality HTML for common Bootstrap components with proper attributes and structure.

Available components: ${availableComponents.join(', ')}

Args:
  - component (string): Component type to generate
  - description (string, optional): Context/comments about the component's purpose

Returns:
  Formatted HTML string for the requested component.`,
      inputSchema: z.object({
        component: z.string().describe(`Component type. Available: ${availableComponents.join(', ')}`),
        description: z.string().optional().describe("Optional description/comment for the component"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ component, description }) => {
      const result = generateComponent(component, description);
      return {
        content: [{
          type: "text",
          text: `\`\`\`html\n${result}\n\`\`\``
        }],
      };
    }
  );

  server.registerTool(
    "bs_generate_layout",
    {
      title: "Generate Page Layout",
      description: `Generate a complete Bootstrap 5 page layout structure that can be pasted into Bootstrap Studio.

Available layouts: ${availableLayouts.join(', ')}

Args:
  - layout (string): Layout type to generate
  - description (string, optional): Context about the layout's purpose

Returns:
  Complete HTML layout with Bootstrap grid system and components.`,
      inputSchema: z.object({
        layout: z.string().describe(`Layout type. Available: ${availableLayouts.join(', ')}`),
        description: z.string().optional().describe("Optional description for the layout"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ layout, description }) => {
      const result = generateLayout(layout, description);
      return {
        content: [{
          type: "text",
          text: `\`\`\`html\n${result}\n\`\`\``
        }],
      };
    }
  );

  server.registerTool(
    "bs_generate_custom_css",
    {
      title: "Generate Custom CSS Code",
      description: `Generate custom CSS code based on a description of styling needs. Produces ready-to-paste CSS for Bootstrap Studio's CSS editor.

Includes responsive breakpoints, CSS custom properties, and Bootstrap-compatible patterns.

Args:
  - request (string): Description of the styling you need (e.g. "hero section with gradient background", "card hover effects")

Returns:
  Custom CSS code with comments and responsive considerations.`,
      inputSchema: z.object({
        request: z.string().min(3).describe("Description of the CSS/styling you need"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ request }) => {
      const result = generateCustomCSS(request);
      return {
        content: [{
          type: "text",
          text: `\`\`\`css\n${result}\n\`\`\``
        }],
      };
    }
  );

  server.registerTool(
    "bs_generate_custom_js",
    {
      title: "Generate Custom JavaScript Code",
      description: `Generate custom JavaScript code for Bootstrap Studio's JS editor. Includes common patterns like smooth scroll, navbar effects, form validation, back-to-top buttons, and tooltip initialization.

Args:
  - request (string): Description of the JavaScript functionality you need

Returns:
  Custom JS code wrapped in DOMContentLoaded ready to paste.`,
      inputSchema: z.object({
        request: z.string().min(3).describe("Description of the JavaScript/interactivity you need"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ request }) => {
      const result = generateCustomJS(request);
      return {
        content: [{
          type: "text",
          text: `\`\`\`javascript\n${result}\n\`\`\``
        }],
      };
    }
  );

  server.registerTool(
    "bs_compare_versions",
    {
      title: "Compare Bootstrap Class Between Versions",
      description: `Check if a Bootstrap CSS class needs migration between Bootstrap 4 and Bootstrap 5.

Handles common renames: mr- -> me-, ml- -> ms-, font-weight- -> fw-, text-left -> text-start, etc.

Args:
  - class_name (string): The Bootstrap CSS class to check

Returns:
  Migration suggestion if the class changed between versions.`,
      inputSchema: z.object({
        class_name: z.string().min(1).describe("Bootstrap CSS class name to check"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ class_name }) => {
      const result = compareBootstrapVersions(class_name);
      return {
        content: [{ type: "text", text: result }],
      };
    }
  );
}
