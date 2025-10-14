import CreditsButton from "@/components/buttons/CreditsButton";
import ToolContainer from "@/components/tool/ToolContainer";
import ToolContentCardWrapper from "@/components/tool/ToolContentCardWrapper";
import ToolHead from "@/components/tool/ToolHead";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Download, Filter, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import SvgIconsSkeleton from "./_SvgIconsSkeleton";

// Helper function to get category emoji
const getCategoryEmoji = (categoryName: string): string => {
  const emojiMap: Record<string, string> = {
    'general': '🔧',
    'animals': '🐾',
    'nature': '🌿',
    'technology': '💻',
    'business': '💼',
    'social': '👥',
    'shapes': '🔷',
    '18': '🔞',
    'account': '👤',
    'ad': '📢',
    'automation': '🤖',
    'banking': '🏦',
    'bitcoin': '₿',
    'browser': '🌐',
    'cloud': '☁️',
    'communication': '💬',
    'database': '🗄️',
    'design': '🎨',
    'development': '⚡',
    'education': '📚',
    'entertainment': '🎬',
    'finance': '💰',
    'food': '🍕',
    'gaming': '🎮',
    'health': '🏥',
    'home': '🏠',
    'music': '🎵',
    'navigation': '🧭',
    'news': '📰',
    'shopping': '🛒',
    'sports': '⚽',
    'travel': '✈️',
    'weather': '🌤️',
  };

  return emojiMap[categoryName.toLowerCase()] || '🔧';
};

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconCount: number;
  url: string;
  keywords: string[];
  features: string[];
  fileNames: any[]; // Add fileNames to access actual icon names
}

interface SvgIconsProps {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  totalCategories: number;
  breadcrumbItems: BreadcrumbItem[];
}

const SvgIcons: React.FC<SvgIconsProps> = ({
  categories,
  currentPage,
  totalPages,
  totalCategories,
  breadcrumbItems,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Load SVG icons dynamically
  useEffect(() => {
    if (!loaded || !categories) return;

    const loadIconsForCategory = (category: Category) => {
      const container = document.getElementById(`icons-${category.id}`);
      if (!container || !category.fileNames) return;

      const iconSlots = Array(6).fill(null);

      // Create slots with img tags for SVG previews
      for (let i = 0; i < Math.min(6, category.fileNames.length); i++) {
        const fileObj = category.fileNames[i];
        const iconName = typeof fileObj === 'string'
          ? fileObj.replace('.svg', '')
          : fileObj.fileName?.replace('.svg', '') || `icon-${i}`;

        iconSlots[i] = `<div class="flex items-center justify-center p-1">
          <div class="w-14 h-14 text-slate-600 overflow-hidden flex items-center justify-center">
            <div class="w-14 h-14 flex items-center justify-center bg-slate-100 rounded-lg">
              <img 
                src="/freedevtools/svg_icons/${category.name}/${iconName}.svg" 
                alt="${iconName} icon"
                class="w-10 h-10 object-contain"
                loading="lazy"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
              />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-slate-400" style="display:none;">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>`;
      }

      // Fill empty slots with transparent placeholders
      const iconsHtml = iconSlots.map(slot => {
        return slot || `<div class="flex items-center justify-center p-1">
          <div class="w-14 h-14"></div>
        </div>`;
      }).join('');

      container.innerHTML = iconsHtml;
    };

    // Load icons for all categories
    categories.forEach(loadIconsForCategory);
  }, [loaded, categories]);

  if (!loaded) {
    return (
      <ToolContainer>
        <ToolHead
          name="SVG Icons"
          description={`Download thousands of free SVG icons instantly. Edit colors, add backgrounds, and customize vector graphics for your projects. No registration required.`}
          breadcrumbItems={breadcrumbItems}
        />
        <SvgIconsSkeleton />
      </ToolContainer>
    );
  }

  return (
    <ToolContainer>
      <ToolHead
        name="SVG Icons"
        description={`Download thousands of free SVG icons instantly. Edit colors, add backgrounds, and customize vector graphics for your projects. No registration required.`}
        breadcrumbItems={breadcrumbItems}
      />

      {/* Overview Stats */}
      <div className="text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalCategories}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{formatNumber(totalCategories * 50)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">SVG Icons</div>
          </div>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6 mt-6">
        <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
          Showing {categories.length} of {totalCategories} categories (Page {currentPage} of {totalPages})
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mt-10 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.url}
              className="block bg-white dark:bg-slate-900 dark:border-slate-900 border border-slate-200 rounded-xl p-6 pb-20 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                  {category.name.replace('-', ' ')}
                </h3>
                <span className="text-sm text-slate-500 font-medium">
                  {category.iconCount} ICONS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 gap-y-3 w-full h-20" id={`icons-${category.id}`}>
                {/* Icons will be loaded dynamically via JavaScript */}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Pagination */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        {/* Middle section with page numbers */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {currentPage > 1 ? (
            <a
              href={currentPage === 2 ? "/freedevtools/svg_icons/" : `/freedevtools/svg_icons/${currentPage - 1}/`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              ← Previous
            </a>
          ) : (
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded cursor-not-allowed">
              ← Previous
            </span>
          )}

          {/* Page Numbers */}
          {currentPage > 3 && (
            <>
              <a
                href="/freedevtools/svg_icons/"
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                1
              </a>
              <span className="px-2 text-slate-400">...</span>
            </>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            if (pageNum > totalPages) return null;

            const isCurrentPage = pageNum === currentPage;
            const pageUrl = pageNum === 1 ? "/freedevtools/svg_icons/" : `/freedevtools/svg_icons/${pageNum}/`;

            return (
              <a
                key={pageNum}
                href={pageUrl}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${isCurrentPage
                  ? 'text-white bg-blue-600 border border-blue-600'
                  : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
              >
                {pageNum}
              </a>
            );
          })}

          {currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-slate-400">...</span>
              <a
                href={`/freedevtools/svg_icons/${totalPages}/`}
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                {totalPages}
              </a>
            </>
          )}

          {currentPage < totalPages ? (
            <a
              href={`/freedevtools/svg_icons/${currentPage + 1}/`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              Next →
            </a>
          ) : (
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded cursor-not-allowed">
              Next →
            </span>
          )}
        </div>

        {/* Bottom section with info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages} • {totalCategories} total categories
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-10 mt-6">
        <ToolContentCardWrapper>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Why Use Our SVG Icons?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <Download className="h-8 w-8 text-blue-600 mx-auto" />
                <h3 className="font-semibold">Instant Download</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download SVG icons instantly without registration or signup required.
                </p>
              </div>
              <div className="text-center space-y-2">
                <Filter className="h-8 w-8 text-green-600 mx-auto" />
                <h3 className="font-semibold">Easy Customization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Edit colors, add backgrounds, and customize vector graphics for your projects.
                </p>
              </div>
              <div className="text-center space-y-2">
                <Star className="h-8 w-8 text-yellow-600 mx-auto" />
                <h3 className="font-semibold">High Quality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Professional vector graphics that scale perfectly for any screen size.
                </p>
              </div>
            </div>
          </Card>
        </ToolContentCardWrapper>
      </div>

      {/* Credits Section */}
      <div className="mt-10 pt-6 mb-8 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-4">
          <a
            href="/freedevtools/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            ←  Back to Free DevTools
          </a>
          <CreditsButton href="/freedevtools/svg_icons/credits/" />
        </div>
      </div>
    </ToolContainer>
  );
};

export default SvgIcons;

// Add CSS styles for icon previews
const styles = `
  .icon-preview svg {
    width: 100% !important;
    height: 100% !important;
    max-width: 64px;
    max-height: 64px;
    display: block;
    object-fit: contain;
  }
  
  .icon-preview {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
