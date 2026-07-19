import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const bootstrapClasses: Record<string, string> = {
  "container": "Fixed-width container with responsive breakpoints. `.container-fluid` for full width. `container-sm|md|lg|xl|xxl` for responsive containers.",
  "row": "Wrapper for columns. Creates horizontal groups of columns. Use `.row-cols-*` for automatic column sizing.",
  "col": "Column class. `.col`, `.col-*`, `.col-sm-*`, `.col-md-*`, `.col-lg-*`, `.col-xl-*`, `.col-xxl-*`. Auto-layout with no number specified.",
  "navbar": "Responsive navigation header. `.navbar-expand-*` controls breakpoint for collapse. `.navbar-light`/`.navbar-dark` for color scheme. Include `.navbar-brand`, `.navbar-nav`.",
  "btn": "Button component. Variants: `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`, `btn-warning`, `btn-info`, `btn-light`, `btn-dark`, `btn-link`. Sizes: `btn-sm`, `btn-lg`. `btn-outline-*` for outline style.",
  "card": "Flexible content container. Structure: `.card` > `.card-body`, `.card-header`, `.card-footer`, `.card-img-top`, `.card-title`, `.card-text`.",
  "form-control": "Form input styling. Apply to `<input>`, `<textarea>`, `<select>`. Sizes: `form-control-sm`, `form-control-lg`.",
  "form-label": "Label for form controls. Should be paired with matching `id` on the input.",
  "form-check": "Wrapper for checkboxes and radios. Structure: `.form-check` > `.form-check-input` + `.form-check-label`.",
  "form-select": "Styled `<select>` element. Sizes: `form-select-sm`, `form-select-lg`.",
  "modal": "Dialog/popup. Structure: `.modal` > `.modal-dialog` > `.modal-content` > `.modal-header`, `.modal-body`, `.modal-footer`. Trigger with `data-bs-toggle=\"modal\"`.",
  "carousel": "Slideshow component. Structure: `.carousel` > `.carousel-inner` > `.carousel-item`. Include `.carousel-control-prev`/`next` and `.carousel-indicators`.",
  "accordion": "Collapsible content panels. Structure: `.accordion` > `.accordion-item` > `.accordion-header` + `.accordion-collapse` > `.accordion-body`. Uses `data-bs-toggle=\"collapse\"`.",
  "alert": "Contextual feedback messages. Variants: `alert-primary|secondary|success|danger|warning|info|light|dark`. Add `.alert-dismissible` for close button.",
  "badge": "Small count and labeling component. Variants: `bg-primary|secondary|success|danger|warning|info|light|dark`. `.rounded-pill` for pill shape.",
  "table": "Table styles. `.table`, `.table-striped`, `.table-hover`, `.table-bordered`, `.table-borderless`, `.table-sm`. Wrap in `.table-responsive` for horizontal scroll.",
  "border": "Border utilities. `border`, `border-top`, `border-primary`, `border-1` through `border-5`. Remove: `border-0`.",
  "rounded": "Border-radius utilities. `rounded`, `rounded-top`, `rounded-circle`, `rounded-pill`, `rounded-0` through `rounded-5`.",
  "shadow": "Box shadow utilities. `shadow-none`, `shadow-sm`, `shadow`, `shadow-lg`.",
  "d-flex": "Display flex. Add `.flex-row`, `.flex-column`, `.justify-content-*`, `.align-items-*`, `.flex-wrap`, `.gap-*`.",
  "text-center": "Text alignment. Also: `text-start`, `text-end`. Responsive: `text-md-start`, `text-lg-center`, etc.",
  "fw-bold": "Font weight. `fw-bold`, `fw-bolder`, `fw-semibold`, `fw-normal`, `fw-light`, `fw-lighter`.",
  "fs-": "Font size. `fs-1` (largest) through `fs-6` (smallest).",
  "text-muted": "Muted text color. Also: `text-primary|secondary|success|danger|warning|info|light|dark|white|body`.",
  "bg-": "Background color. `bg-primary|secondary|success|danger|warning|info|light|dark|white|transparent`. Add `bg-gradient` for gradient.",
  "p-": "Padding. `p-0` through `p-5`. Directional: `pt-*`, `pb-*`, `ps-*`, `pe-*`, `px-*`, `py-*`. Responsive: `p-md-*`.",
  "m-": "Margin. `m-0` through `m-5`, `m-auto`. Directional: `mt-*`, `mb-*`, `ms-*`, `me-*`, `mx-*`, `my-*`. Responsive: `m-md-*`.",
  "w-": "Width. `w-25`, `w-50`, `w-75`, `w-100`, `w-auto`, `mw-100`.",
  "h-": "Height. `h-25`, `h-50`, `h-75`, `h-100`, `h-auto`, `mh-100`.",
  "position-": "Position. `position-static|relative|absolute|fixed|sticky`. `top-*`, `bottom-*`, `start-*`, `end-*`. `translate-middle` for centering.",
  "overflow": "Overflow. `overflow-auto`, `overflow-hidden`, `overflow-visible`, `overflow-scroll`.",
  "visually-hidden": "Visually hidden but accessible to screen readers (replaces Bootstrap 4 `sr-only`).",
  "d-none": "Hide element. `d-{breakpoint}-none` for responsive hiding. `d-{breakpoint}-block|inline|flex` for responsive showing.",
  "stretched-link": "Make a link stretch to fill its parent. Add `.position-relative` to parent.",
  "ratio": "Aspect ratio. `.ratio` + `.ratio-1x1|4x3|16x9|21x9`. Wrap element inside.",
  "spinner": "Loading indicator. `.spinner-border` or `.spinner-grow`. Colors: `text-primary|secondary|...`.",
  "progress": "Progress bar. `.progress` > `.progress-bar` with `style=\"width: X%\"`. `.progress-bar-striped`, `.progress-bar-animated`.",
  "list-group": "Flexible list component. `.list-group` > `.list-group-item`. Variants: `list-group-item-action`, `list-group-item-primary|...`. Layout: `list-group-horizontal`.",
  "breadcrumb": "Navigation breadcrumb. `.breadcrumb` > `.breadcrumb-item`. Active item marked with `.active`.",
  "pagination": "Pagination component. `.pagination` > `.page-item` > `.page-link`. Sizes: `pagination-sm`, `pagination-lg`.",
  "offcanvas": "Hidden sidebar. `.offcanvas` + `.offcanvas-header`, `.offcanvas-body`. Positions: `offcanvas-start|end|top|bottom`. Toggle with `data-bs-toggle=\"offcanvas\"`.",
  "dropdown": "Dropdown menu. `.dropdown` > button with `data-bs-toggle=\"dropdown\"` + `.dropdown-menu` > `.dropdown-item`.",
  "toast": "Notification popup. `.toast` > `.toast-header` + `.toast-body`. Show via JS: `new bootstrap.Toast(el).show()`.",
  "tooltip": "Tooltip component. Add `data-bs-toggle=\"tooltip\" data-bs-title=\"Text\"` to element. Initialize with `new bootstrap.Tooltip(el)`.",
  "popover": "Popover component. `data-bs-toggle=\"popover\" data-bs-title=\"Title\" data-bs-content=\"Content\"`. Initialize with `new bootstrap.Popover(el)`.",
  "g-": "Gutter/gap utility. `g-0` through `g-5`. Directional: `gx-*`, `gy-*`.",
  "order-": "Flex order. `order-0` through `order-5`, `order-first`, `order-last`.",
  "object-fit": "Image/video fit. `object-fit-contain|cover|fill|scale|none`.",
  "z-": "Z-index. `z-0`, `z-1`, `z-2`, `z-3`.",
  "opacity": "Opacity. `opacity-0`, `opacity-25`, `opacity-50`, `opacity-75`, `opacity-100`.",
};

const componentDocs: Record<string, string> = {
  "navbar": `**Bootstrap Navbar**

\`\`\`html
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Link</a></li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button"
             data-bs-toggle="dropdown">Dropdown</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Separated link</a></li>
          </ul>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
\`\`\`

**Key classes**: \`navbar-expand-{breakpoint}\`, \`navbar-light\`, \`navbar-dark\`, \`bg-body-tertiary\`, \`fixed-top\`, \`fixed-bottom\`, \`sticky-top\``,

  "card": `**Bootstrap Card**

\`\`\`html
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
\`\`\`

**Layout variants**:
- Card groups: \`.card-group\` wraps multiple cards
- Card grid: \`.row-cols-* > .col > .card\`
- Horizontal card: \`.row.g-0 > .col-md-4 + .col-md-8\`

**Header/Footer**: \`.card-header\`, \`.card-footer\`
**Image overlay**: \`.card-img-overlay\` over \`.card-img\``,

  "form": `**Bootstrap Form**

\`\`\`html
<form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1">
    <div class="form-text">We'll never share your email.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
\`\`\`

**Layout**: \`.row > .col\`, \`.row.g-3\` for grid forms
**Sizing**: \`.form-control-lg\`, \`.form-control-sm\`
**Validation**: \`.was-validated\`, \`.is-valid\`, \`.is-invalid\``,
};

export function registerDocsTools(server: McpServer) {

  server.registerTool(
    "bs_lookup_class",
    {
      title: "Look Up Bootstrap CSS Class",
      description: `Look up documentation for a Bootstrap 5 CSS class. Returns description, usage, and related classes.

Args:
  - class_name (string): Bootstrap CSS class to look up (e.g. "container", "btn", "d-flex", "g-3")

Returns:
  Description of the class, its variants, and usage examples.`,
      inputSchema: z.object({
        class_name: z.string().min(1).describe("Bootstrap CSS class to look up"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ class_name }) => {
      const name = class_name.toLowerCase().replace(/^\./, '');

      for (const [key, doc] of Object.entries(bootstrapClasses)) {
        if (name === key || name.startsWith(key) || key.startsWith(name)) {
          return {
            content: [{ type: "text", text: `## \`.${key}\`\n${doc}` }],
          };
        }
      }

      const suggestions = Object.keys(bootstrapClasses)
        .filter(k => k.includes(name) || name.includes(k))
        .slice(0, 5);

      return {
        content: [{
          type: "text",
          text: `No documentation found for "${class_name}".${suggestions.length ? `\n\nSimilar classes: ${suggestions.join(', ')}` : ''}`
        }],
      };
    }
  );

  server.registerTool(
    "bs_search_component",
    {
      title: "Search Bootstrap Component Documentation",
      description: `Search Bootstrap 5 component documentation and examples. Returns the component reference with code examples.

Args:
  - component (string): Component name (e.g. "navbar", "card", "form", "modal")

Returns:
  Component documentation with HTML example code.`,
      inputSchema: z.object({
        component: z.string().min(1).describe("Component name to search for"),
      }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ component }) => {
      const name = component.toLowerCase();

      const doc = componentDocs[name];
      if (doc) {
        return {
          content: [{ type: "text", text: doc }],
        };
      }

      const available = Object.keys(componentDocs).join(', ');
      return {
        content: [{
          type: "text",
          text: `No built-in documentation for "${component}".\n\nAvailable components: ${available}\n\nYou can also use \`bs_lookup_class\` to search for individual CSS classes.`
        }],
      };
    }
  );
}
