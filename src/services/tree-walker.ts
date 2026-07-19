import { BsComponent, ComponentSummary, ComponentSearchResult } from '../types.js';

function isComponent(child: BsComponent | string): child is BsComponent {
  return typeof child !== 'string' && child !== null;
}

function getTextContent(component: BsComponent): string {
  const texts: string[] = [];
  const children = component.children || [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (typeof child === 'string') {
      const prev = children[i - 1];
      if (prev && typeof prev !== 'string' && prev.class === 'InlineCharacter' && prev.children && prev.children.length > 0) continue;
      const trimmed = child.trim();
      if (trimmed) texts.push(trimmed);
    } else if (child.class === 'InlineCharacter' && child.children && child.children.length > 0) {
      const text = child.children[0];
      if (typeof text === 'string' && text.trim()) texts.push(text.trim());
    }
  }
  return texts.join(' ');
}

function getBootstrapClass(component: BsComponent): string {
  const parts: string[] = [];
  if (component.cssClasses?.system?.main) {
    parts.push(component.cssClasses.system.main.trim());
  }
  if (component.cssClasses?.system?.customPropClasses) {
    parts.push(component.cssClasses.system.customPropClasses.trim());
  }
  return parts.filter(Boolean).join(' ');
}

function walkComponent(
  component: BsComponent,
  depth: number,
  path: string,
  results: ComponentSummary[],
  pageName: string
): void {
  const label = component.label || '';
  const textContent = getTextContent(component);
  const bootstrapClass = getBootstrapClass(component);

  results.push({
    type: component.class,
    label,
    textContent,
    bootstrapClass,
    depth,
    path: `${pageName} > ${path ? path + ' > ' : ''}${component.class}${label ? `[label="${label}"]` : ''}`,
    properties: component.properties || {},
  });

  let idx = 0;
  for (const child of component.children || []) {
    if (isComponent(child)) {
      walkComponent(child, depth + 1, `${path}/${component.class}[${idx}]`, results, pageName);
    }
    idx++;
  }
}

export function walkComponentTree(pageName: string, rootComponent: BsComponent): ComponentSummary[] {
  const results: ComponentSummary[] = [];
  walkComponent(rootComponent, 0, '', results, pageName);
  return results;
}

export function searchComponents(
  pageName: string,
  rootComponent: BsComponent,
  query: string,
  searchType: 'type' | 'label' | 'text' | 'all'
): ComponentSearchResult[] {
  const results: ComponentSearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  function walk(component: BsComponent, depth: number, path: string) {
    const matchedType = searchType === 'all' || searchType === 'type';
    const matchedLabel = searchType === 'all' || searchType === 'label';
    const matchedText = searchType === 'all' || searchType === 'text';

    let matchFound: 'type' | 'label' | 'text' | null = null;

    if (matchedType && component.class.toLowerCase().includes(lowerQuery)) {
      matchFound = 'type';
    }
    if (!matchFound && matchedLabel && component.label?.toLowerCase().includes(lowerQuery)) {
      matchFound = 'label';
    }
    if (!matchFound && matchedText && getTextContent(component).toLowerCase().includes(lowerQuery)) {
      matchFound = 'text';
    }

    if (matchFound) {
      results.push({
        type: component.class,
        label: component.label || '',
        textContent: getTextContent(component),
        path: `${pageName} > ${path ? path + ' > ' : ''}${component.class}${component.label ? `[label="${component.label}"]` : ''}`,
        page: pageName,
        matched: matchFound,
      });
    }

    let idx = 0;
    for (const child of component.children || []) {
      if (isComponent(child)) {
        walk(child, depth + 1, `${path}/${component.class}[${idx}]`);
      }
      idx++;
    }
  }

  walk(rootComponent, 0, '');
  return results;
}

export function getAllTextContent(rootComponent: BsComponent): string {
  const texts: string[] = [];

  function walk(component: BsComponent) {
    const children = component.children || [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (typeof child === 'string') {
        const prev = children[i - 1];
        if (prev && typeof prev !== 'string' && prev.class === 'InlineCharacter' && prev.children && prev.children.length > 0) continue;
        const trimmed = child.trim();
        if (trimmed) texts.push(trimmed);
      } else if (child.class === 'InlineCharacter' && child.children && child.children.length > 0) {
        const text = child.children[0];
        if (typeof text === 'string' && text.trim()) texts.push(text.trim());
      } else if (isComponent(child)) {
        walk(child);
      }
    }
  }

  walk(rootComponent);
  return texts.join('\n');
}
