export interface Tool {
  name: string;
  path: string;
  description: string;
  category: string;
  icon: string;
  themeColor: string;
  canonical: string;
  keywords: string[];
  features: string[];
}

export const TOOLS_CONFIG: Record<string, Tool> = {
  'json-prettifier': {
    name: 'JSON Prettifier',
    path: '/freedevtools/t/json-prettifier/',
    description:
      'Format, minify, and validate JSON data instantly. Multiple indentation options, real-time validation, and no registration required.',
    category: 'Developer Tools',
    icon: '📄',
    themeColor: '#10b981',
    canonical: 'https://hexmos.com/freedevtools/t/json-prettifier/',
    keywords: [
      'json prettifier',
      'json formatter',
      'json minifier',
      'json validator',
      'json beautifier',
      'json online',
      'developer tools',
      'api tools',
    ],
    features: [
      'JSON formatting',
      'JSON minification',
      'JSON validation',
      'Multiple indentation options',
      'Real-time validation',
      'Copy to clipboard',
    ],
  },
};

export function getToolByKey(key: string): Tool | undefined {
  return TOOLS_CONFIG[key];
}

export function getAllTools(): Tool[] {
  return Object.values(TOOLS_CONFIG);
}

export function getToolsByCategory(category: string): Tool[] {
  return getAllTools().filter((tool) => tool.category === category);
}
