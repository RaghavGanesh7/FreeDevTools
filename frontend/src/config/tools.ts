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
  'base64-converter': {
    name: 'Base64 Converter',
    path: '/freedevtools/t/base64-converter/',
    description:
      'Encode text to Base64 or decode Base64 to text instantly. No registration required. Perfect for developers, email attachments, and data encoding.',
    category: 'Developer Tools',
    icon: '🔤',
    themeColor: '#3b82f6',
    canonical: 'https://hexmos.com/freedevtools/t/base64-converter/',
    keywords: [
      'base64',
      'base64 converter',
      'base64 encoder',
      'base64 decoder',
      'text encoding',
      'binary encoding',
      'data converter',
      'developer tools',
    ],
    features: [
      'Base64 encoding',
      'Base64 decoding',
      'Text conversion',
      'Binary encoding',
      'Data transformation',
    ],
  },
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
