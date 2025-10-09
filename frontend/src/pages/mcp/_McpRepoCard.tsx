import { Clock, Download, Scale, Star, Wrench } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { formatNumber } from "../../lib/utils";

// Define the server type based on the actual data structure
interface Server {
  owner: string;
  name: string;
  url: string;
  imageUrl?: string;
  description?: string;
  stars: number;
  forks: number;
  license: string;
  language: string;
  updated_at: string;
  readme_content?: string;
  npm_url: string;
  npm_downloads: number;
  keywords?: string[];
  category: string;
}

// Repository Card Component using Lucide React
const RepositoryCard = ({ server, formattedName, category, repositoryId }: { server: Server, formattedName: string, category?: string, repositoryId?: string }) => (
  <TooltipProvider>
    <a
      href={category && repositoryId ? `/freedevtools/mcp/${category}/${repositoryId}/` : `/freedevtools/mcp/${server.name}/`}
      className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      data-repo-id={repositoryId || server.name}
      data-repo-name={server.name}
      data-repo-description={server.description}
      data-repo-license={server.license}
      suppressHydrationWarning
    >
      <div className="space-y-6">
        {/* First Row: Title */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              {formattedName}
            </h3>
            <span className="text-gray-400 dark:text-gray-500">→</span>
          </div>

          {/* Second Row: Author */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {server.owner || 'Unknown Author'}
          </div>
        </div>

        {/* Third Row: Image and Description */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {server.imageUrl ? (
              <img
                src={server.imageUrl}
                alt={`${formattedName} logo`}
                className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div
              className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center"
              style={{ display: server.imageUrl ? 'none' : 'flex' }}
            >
              <img
                src="/freedevtools/svg_icons/automation/mcp-server-stroke-rounded.svg"
                alt="MCP Server"
                className="w-10 h-10 text-slate-400"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {server.description}
            </p>
          </div>
        </div>

        {/* Fourth Row: Stats */}
        <div className="flex items-center justify-between">
          {/* Left side: Last updated */}
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 text-gray-900 dark:text-gray-400" />
            <span>Last Updated {new Date(server.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
          </div>

          {/* Right side: Other stats */}
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <img src="/freedevtools/svg_icons/github/github-svgrepo-com.svg" alt="GitHub" className="w-4 h-4 text-gray-900 dark:brightness-0 dark:invert" />
                  <Star className="w-4 h-4 text-gray-900 dark:text-gray-400" />
                  <span>{formatNumber(server.stars)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub stars for this repository</p>
              </TooltipContent>
            </Tooltip>


            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <img src="/freedevtools/svg_icons/github/npm-svgrepo-com.svg" alt="NPM" className="w-4 h-4 text-gray-900 dark:brightness-0 dark:invert" />
                  <Download className="w-4 h-4 text-gray-900 dark:text-gray-400" />
                  <span>{formatNumber(server.npm_downloads)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Weekly downloads from NPM</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Wrench className="w-4 h-4 text-gray-900 dark:text-gray-400" />
                  <span>{formatNumber(1)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of tools available in this MCP server</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Fifth Row: License */}
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <Scale className="w-4 h-4 text-gray-900 dark:text-gray-400" />
          <span>{server.license}</span>
        </div>
      </div>
    </a>
  </TooltipProvider>
);

export default RepositoryCard;