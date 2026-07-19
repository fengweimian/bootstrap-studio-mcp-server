# Bootstrap Studio MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that provides tools for analyzing Bootstrap Studio `.bsdesign` project files, generating Bootstrap 5 component code, and looking up Bootstrap documentation. Designed to complement Bootstrap Studio's built-in AI assistant with file-level project analysis and code generation capabilities.

## Features

### Project Analysis (7 tools)

| Tool | Description |
|------|-------------|
| `bs_read_project` | Parse a `.bsdesign` file and return a comprehensive project overview |
| `bs_list_pages` | List all pages with metadata and component counts |
| `bs_get_page_tree` | Get the full component tree for a specific page |
| `bs_find_components` | Search components by type, label, or text content |
| `bs_get_css` | Extract all custom CSS/SASS code from the project |
| `bs_get_js` | Extract all custom JavaScript code from the project |
| `bs_get_text_content` | Extract all visible text from a page |

### Code Generation (5 tools)

| Tool | Description |
|------|-------------|
| `bs_generate_component` | Generate Bootstrap 5 component HTML (21 components: navbar, card, form, modal, table, carousel, accordion, alert, badge, breadcrumb, progress, spinner, hero, features, footer, contact-form, pricing, testimonial, timeline, faq, stats) |
| `bs_generate_layout` | Generate complete page layouts (full-page, dashboard) |
| `bs_generate_custom_css` | Generate custom CSS with responsive breakpoints |
| `bs_generate_custom_js` | Generate custom JavaScript (smooth scroll, navbar effects, form validation, tooltips, etc.) |
| `bs_compare_versions` | Check Bootstrap 4 to 5 class name migrations |

### Documentation Lookup (2 tools)

| Tool | Description |
|------|-------------|
| `bs_lookup_class` | Look up Bootstrap 5 CSS class documentation |
| `bs_search_component` | Search Bootstrap 5 component reference with code examples |

### Project Editing (6 tools)

| Tool | Description |
|------|-------------|
| `bs_update_component` | Update component properties, CSS classes, text, or label |
| `bs_add_component` | Add a new component at a specified position in the tree |
| `bs_remove_component` | Remove a component from a page by its path |
| `bs_set_css_code` | Write custom CSS using Bootstrap Studio's native structured block format |
| `bs_set_js_code` | Write custom JavaScript code |
| `bs_batch_update` | Update multiple components in a single request (single file write) |

## Installation

```bash
git clone https://github.com/niz1230/bootstrap-studio-mcp-server.git
cd bootstrap-studio-mcp-server
npm install
npm run build
```

## Configuration

Add to your MCP client configuration (e.g., `opencode.json`):

```json
{
  "mcp": {
    "bootstrap-studio": {
      "type": "local",
      "command": ["node", "C:\\path\\to\\bootstrap-studio-mcp-server\\dist\\index.js"]
    }
  }
}
```

## Requirements

- Node.js >= 18
- npm >= 9

---

# Bootstrap Studio MCP 服务器（中文说明）

一个 [MCP（模型上下文协议）](https://modelcontextprotocol.io) 服务器，提供分析 Bootstrap Studio `.bsdesign` 项目文件、生成 Bootstrap 5 组件代码以及查询 Bootstrap 文档的工具。旨在补充 Bootstrap Studio 内置 AI 助手的功能，提供文件级项目分析和代码生成能力。

## 功能

### 项目分析（7 个工具）

| 工具 | 说明 |
|------|------|
| `bs_read_project` | 解析 `.bsdesign` 文件，返回完整项目概览 |
| `bs_list_pages` | 列出所有页面及其元数据和组件数量 |
| `bs_get_page_tree` | 获取指定页面的完整组件树 |
| `bs_find_components` | 按类型、标签或文本内容搜索组件 |
| `bs_get_css` | 提取项目中所有自定义 CSS/SASS 代码 |
| `bs_get_js` | 提取项目中所有自定义 JavaScript 代码 |
| `bs_get_text_content` | 提取页面中所有可见文本 |

### 代码生成（5 个工具）

| 工具 | 说明 |
|------|------|
| `bs_generate_component` | 生成 Bootstrap 5 组件 HTML（21 种组件：导航栏、卡片、表单、模态框、表格、轮播、折叠面板、提示框、徽章、面包屑、进度条、加载动画、英雄区、特性区、页脚、联系表单、定价表、用户评价、时间线、常见问题、数据统计） |
| `bs_generate_layout` | 生成完整页面布局（全页面、仪表盘） |
| `bs_generate_custom_css` | 生成包含响应式断点的自定义 CSS |
| `bs_generate_custom_js` | 生成自定义 JavaScript（平滑滚动、导航栏效果、表单验证、提示框等） |
| `bs_compare_versions` | 检查 Bootstrap 4 到 5 的类名迁移 |

### 文档查询（2 个工具）

| 工具 | 说明 |
|------|------|
| `bs_lookup_class` | 查询 Bootstrap 5 CSS 类名文档 |
| `bs_search_component` | 搜索 Bootstrap 5 组件参考和代码示例 |

### 项目编辑（6 个工具）

| 工具 | 说明 |
|------|------|
| `bs_update_component` | 修改组件属性、CSS 类、文本或标签 |
| `bs_add_component` | 在指定位置添加新组件 |
| `bs_remove_component` | 按路径删除组件 |
| `bs_set_css_code` | 写入自定义 CSS（Bootstrap Studio 原生结构化格式） |
| `bs_set_js_code` | 写入自定义 JavaScript 代码 |
| `bs_batch_update` | 批量修改多个组件（一次文件写入） |

## 安装

```bash
git clone https://github.com/niz1230/bootstrap-studio-mcp-server.git
cd bootstrap-studio-mcp-server
npm install
npm run build
```

## 配置

添加到 MCP 客户端配置中（例如 `opencode.json`）：

```json
{
  "mcp": {
    "bootstrap-studio": {
      "type": "local",
      "command": ["node", "C:\\path\\to\\bootstrap-studio-mcp-server\\dist\\index.js"]
    }
  }
}
```

## 环境要求

- Node.js >= 18
- npm >= 9
