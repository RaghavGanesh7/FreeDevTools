import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface Tool {
  name: string;
  path: string;
  description: string;
  icon?: string;
  category?: string;
}

export function discoverTools(): Tool[] {
  const tools: Tool[] = [];
  const pagesDir = join(process.cwd(), 'src/pages');

  try {
    // Get all directories in pages (excluding layouts, components, etc.)
    const pageDirs = readdirSync(pagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => !dirent.name.startsWith('_') && dirent.name !== 'tools')
      .map(dirent => dirent.name);

    for (const dir of pageDirs) {
      const indexPath = join(pagesDir, dir, 'index.astro');

      if (existsSync(indexPath)) {
        try {
          const content = readFileSync(indexPath, 'utf-8');

          // Extract title and description from the Astro file
          const titleMatch = content.match(/title="([^"]+)"/);
          const descMatch = content.match(/description="([^"]+)"/);

          if (titleMatch && descMatch) {
            // Clean up the title (remove "| Free Dev Tools" part)
            let cleanTitle = titleMatch[1].replace(/\s*\|\s*Free Dev Tools.*$/, '');

            // Convert path to URL format
            const urlPath = `/${dir}/`;

            tools.push({
              name: cleanTitle,
              path: urlPath,
              description: descMatch[1],
              category: 'Developer Tools'
            });
          }
        } catch (error) {
          console.warn(`Could not read ${indexPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error discovering tools:', error);
  }

  return tools.sort((a, b) => a.name.localeCompare(b.name));
}

// For client-side usage, we'll need to pass the tools data
export function getToolsData(): Tool[] {
  // This will be populated at build time
  return [
    {
      name: "Base64 Converter",
      path: "/base64/",
      description: "Encode text to Base64 or decode Base64 to text",
      category: "Developer Tools"
    },
    {
      name: "JSON Prettifier",
      path: "/json/",
      description: "Format, minify, and validate JSON data",
      category: "Developer Tools"
    }
  ];
} 