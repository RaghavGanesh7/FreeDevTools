// This file is auto-generated at build time
// Do not edit manually

export interface Tool {
  name: string;
  path: string;
  description: string;
  icon?: string;
  category?: string;
}

export const tools: Tool[] = [
  {
    "name": "Base64 Converter - Encode/Decode Text Online",
    "path": "/base64-converter/",
    "description": "Free online Base64 converter. Encode text to Base64 or decode Base64 to text instantly. No registration required. Perfect for developers, email attachments, and data encoding.",
    "category": "Developer Tools"
  },
  {
    "name": "JSON Prettifier - Format, Minify & Validate JSON Online",
    "path": "/json-prettifier/",
    "description": "Free online JSON prettifier. Format, minify, and validate JSON data instantly. Multiple indentation options, real-time validation, and no registration required.",
    "category": "Developer Tools"
  }
];

export function getToolsData(): Tool[] {
  return tools;
}
