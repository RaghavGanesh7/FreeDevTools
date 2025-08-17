#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function discoverTools() {
  const tools = [];
  const pagesDir = path.join(path.dirname(__dirname), "src/pages");

  try {
    // Get all directories in pages (excluding layouts, components, etc.)
    const pageDirs = fs
      .readdirSync(pagesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .filter(
        (dirent) => !dirent.name.startsWith("_") && dirent.name !== "tools"
      )
      .map((dirent) => dirent.name);

    for (const dir of pageDirs) {
      const indexPath = path.join(pagesDir, dir, "index.astro");

      if (fs.existsSync(indexPath)) {
        try {
          const content = fs.readFileSync(indexPath, "utf-8");

          // Extract title and description from the Astro file
          const titleMatch = content.match(/title="([^"]+)"/);
          const descMatch = content.match(/description="([^"]+)"/);

          if (titleMatch && descMatch) {
            // Clean up the title (remove "| Free Dev Tools" part)
            let cleanTitle = titleMatch[1].replace(
              /\s*\|\s*Free Dev Tools.*$/,
              ""
            );

            // Convert path to URL format
            const urlPath = `/${dir}/`;

            tools.push({
              name: cleanTitle,
              path: urlPath,
              description: descMatch[1],
              category: "Developer Tools",
            });
          }
        } catch (error) {
          console.warn(`Could not read ${indexPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error discovering tools:", error);
  }

  return tools.sort((a, b) => a.name.localeCompare(b.name));
}

function updateToolsDataFile() {
  const tools = discoverTools();

  const toolsDataContent = `// This file is auto-generated at build time
// Do not edit manually

export interface Tool {
  name: string;
  path: string;
  description: string;
  icon?: string;
  category?: string;
}

export const tools: Tool[] = ${JSON.stringify(tools, null, 2)};

export function getToolsData(): Tool[] {
  return tools;
}
`;

  const outputPath = path.join(
    path.dirname(__dirname),
    "src/utils/toolsData.ts"
  );
  fs.writeFileSync(outputPath, toolsDataContent);

  console.log(`✅ Updated tools data with ${tools.length} tools:`);
  tools.forEach((tool) => {
    console.log(`  - ${tool.name} (${tool.path})`);
  });
}

// Run the update
updateToolsDataFile();
