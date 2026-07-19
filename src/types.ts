export interface BsDesignFile {
  version: number;
  timestamp: number;
  design: BsDesign;
}

export interface BsDesign {
  [x: string]: unknown;
  id: string;
  name: string;
  settings: BsSettings;
  placeholders: Record<string, unknown>;
  framework: string;
  assets: {
    images: BsAssetsNode;
    fonts: BsAssetsNode;
    css: BsAssetsNode;
    js: BsAssetsNode;
  };
  pages: BsFolderNode;
  collections: BsCollection[];
  colorMode: string;
  colorModeOverrides: Record<string, unknown>;
  reflow: string;
  reflowLocale: string;
  reflowTestMode: string;
}

export interface BsSettings {
  [x: string]: unknown;
  theme: { id: string; type: string };
  jqueryVersion: string;
  headSettings: Record<string, unknown>;
  adsTxtContent: string;
  appAdsTxtContent: string;
  robotsTxtContent: string;
  iconSet: string;
  meta: unknown[];
  canonicalLinks: { enabled: boolean };
  sitemap: { enabled: boolean };
  pwa: { enabled: boolean };
  favicons: unknown[];
  ecommerce: { store: unknown };
  lang: string;
  viewportContent: string;
}

export interface BsAssetsNode {
  name: string;
  expanded: boolean;
  children: BsAssetFile[];
}

export interface BsFolderNode {
  name: string;
  expanded: boolean;
  children: BsPage[];
}

export interface CssBlock {
  selector: string;
  mediaQuery: boolean | string;
  containerQuery: boolean | string;
  system: boolean;
  enabled: boolean;
  rules: CssRule[];
}

export interface CssRule {
  property: string;
  value: string;
  enabled: boolean;
  system: boolean;
}

export interface BsAssetFile {
  name: string;
  properties: Record<string, unknown>;
  priority: number;
  pageBlacklist: string[];
  pageWhitelist: string[];
  blocks: unknown[];
  children?: BsAssetFile[];
}

export interface BsPage {
  name: string;
  properties: {
    showInSitemap: boolean;
    headSettings: Record<string, unknown>;
  };
  priority: number;
  pageBlacklist: string[];
  pageWhitelist: string[];
  html: BsComponent;
  meta: unknown[];
  includeInExport: boolean;
}

export interface BsComponent {
  class: string;
  cssClasses?: {
    system?: { main?: string; customPropClasses?: string };
    parent?: string;
  };
  overrides?: Record<string, Record<string, string>>;
  flags?: {
    canBeMoved?: boolean;
    canBeDeleted?: boolean;
    canBeDuplicated?: boolean;
    canBeEdited?: boolean;
    canBePackaged?: boolean;
    canBeCopied?: boolean;
  };
  properties?: Record<string, unknown>;
  customProperties?: unknown[];
  masked?: boolean;
  unlinkedArea?: boolean;
  label?: string;
  comment?: string | null;
  children?: (BsComponent | string)[];
}

export interface BsCollection {
  class: string;
  id: string;
  name: string;
  items: unknown[];
  lastItemID: number;
}

export interface ComponentSummary {
  [x: string]: unknown;
  type: string;
  label: string;
  textContent: string;
  bootstrapClass: string;
  depth: number;
  path: string;
  properties: Record<string, unknown>;
}

export interface PageTree {
  name: string;
  html: BsComponent;
  summary: ComponentSummary[];
  flatList: ComponentSummary[];
}

export interface ProjectOverview {
  [x: string]: unknown;
  name: string;
  id: string;
  version: number;
  bootstrapVersion: string;
  theme: string;
  colorMode: string;
  pages: { name: string; showInSitemap: boolean; includeInExport: boolean }[];
  assets: {
    images: string[];
    fonts: string[];
    css: string[];
    js: string[];
  };
  collections: { type: string; name: string; itemCount: number }[];
}

export interface ComponentSearchResult {
  [x: string]: unknown;
  type: string;
  label: string;
  textContent: string;
  path: string;
  page: string;
  matched: 'type' | 'label' | 'text';
}
