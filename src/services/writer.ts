import { BsComponent } from '../types.js';

function isComponent(child: BsComponent | string): child is BsComponent {
  return typeof child !== 'string' && child !== null;
}

interface PathSegment {
  type: string;
  index: number;
}

export function parsePath(path: string): PathSegment[] {
  const segments = path.split('/').filter(Boolean);
  return segments.map(seg => {
    const match = seg.match(/^(\w+)\[(\d+)\]$/);
    if (!match) throw new Error(`Invalid path segment: ${seg}. Expected format: Type[index]`);
    return { type: match[1], index: parseInt(match[2], 10) };
  });
}

export function navigateToComponent(
  root: BsComponent,
  path: string
): { parent: BsComponent; component: BsComponent; index: number } | null {
  const segments = parsePath(path);

  if (segments.length === 0) {
    return { parent: root, component: root, index: 0 };
  }

  let startIdx = 0;
  if (segments.length > 0 && segments[0].type === root.class) {
    startIdx = 1;
  }

  if (startIdx >= segments.length) {
    return { parent: root, component: root, index: 0 };
  }

  let current = root;
  let parent = root;
  let lastIndex = 0;

  for (let i = startIdx; i < segments.length; i++) {
    const seg = segments[i];
    const children = current.children || [];
    const child = children[seg.index];

    if (!child || !isComponent(child)) {
      return null;
    }

    if (child.class !== seg.type) {
      return null;
    }

    parent = current;
    current = child;
    lastIndex = seg.index;
  }

  return { parent, component: current, index: lastIndex };
}

export function removeComponent(root: BsComponent, path: string): boolean {
  const result = navigateToComponent(root, path);
  if (!result || result.component.class === 'HTML' || result.component.class === 'Body') {
    return false;
  }

  const children = result.parent.children || [];
  children.splice(result.index, 1);
  result.parent.children = children;
  return true;
}

export function addComponent(
  root: BsComponent,
  parentPath: string,
  component: BsComponent,
  position?: number
): boolean {
  const result = navigateToComponent(root, parentPath);
  if (!result) return false;

  const children = result.component.children || [];
  if (position !== undefined && position >= 0 && position <= children.length) {
    children.splice(position, 0, component);
  } else {
    children.push(component);
  }
  result.component.children = children;
  return true;
}

export function updateComponentProperties(
  root: BsComponent,
  path: string,
  properties: Record<string, unknown>
): boolean {
  const result = navigateToComponent(root, path);
  if (!result) return false;

  if (!result.component.properties) {
    result.component.properties = {};
  }

  for (const [key, value] of Object.entries(properties)) {
    result.component.properties[key] = value;
  }
  return true;
}

export function setComponentText(root: BsComponent, path: string, text: string): boolean {
  const result = navigateToComponent(root, path);
  if (!result) return false;

  const children = result.component.children || [];
  const textChildren = children.filter(c => typeof c === 'string');
  const componentChildren = children.filter(c => isComponent(c));

  if (componentChildren.length === 1 && componentChildren[0].class === 'InlineCharacter') {
    componentChildren[0].children = [text];
    result.component.children = [componentChildren[0], text];
  } else {
    result.component.children = [text];
  }
  return true;
}

export function setComponentLabel(root: BsComponent, path: string, label: string): boolean {
  const result = navigateToComponent(root, path);
  if (!result) return false;
  result.component.label = label;
  return true;
}

export function setComponentCssClass(root: BsComponent, path: string, cssClass: string): boolean {
  const result = navigateToComponent(root, path);
  if (!result) return false;

  if (!result.component.cssClasses) {
    result.component.cssClasses = { system: { customPropClasses: '' }, parent: '' };
  }
  if (!result.component.cssClasses.system) {
    result.component.cssClasses.system = { customPropClasses: '' };
  }
  result.component.cssClasses.system.main = cssClass;
  return true;
}

export interface ComponentSkeleton {
  class: string;
  label?: string;
  cssClass?: string;
  text?: string;
  properties?: Record<string, unknown>;
  children?: ComponentSkeleton[];
}

export function createComponent(skeleton: ComponentSkeleton): BsComponent {
  const hasTextOrInlineChars = skeleton.children ? skeleton.children.some(
    c => typeof c === 'string' || c.class === 'InlineCharacter'
  ) : false;

  let compChildren: (BsComponent | string)[] = [];

  if (hasTextOrInlineChars && skeleton.children) {
    for (const child of skeleton.children) {
      if (typeof child === 'string') {
        compChildren.push(child);
      } else {
        compChildren.push(createComponent(child));
      }
    }
  } else if (skeleton.children) {
    for (const child of skeleton.children) {
      compChildren.push(createComponent(child));
    }
  }

  if (skeleton.text) {
    compChildren.push(skeleton.text);
  }

  const component: BsComponent = {
    class: skeleton.class,
    label: skeleton.label || '',
    cssClasses: {
      system: {
        main: skeleton.cssClass || '',
        customPropClasses: '',
      },
      parent: '',
    },
    overrides: {},
    flags: {
      canBeMoved: true,
      canBeDeleted: true,
      canBeDuplicated: true,
      canBeEdited: true,
      canBePackaged: true,
      canBeCopied: true,
    },
    properties: skeleton.properties || {},
    customProperties: [],
    masked: false,
    unlinkedArea: false,
    comment: null,
    children: compChildren,
  };

  return component;
}
