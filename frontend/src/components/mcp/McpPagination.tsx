import React, { useMemo, useState } from 'react';

interface Server {
  name: string;
  description: string;
  license: string;
  [key: string]: any;
}

interface McpPaginationProps {
  servers: Server[];
  category: string;
  RepositoryCard: React.ComponentType<{
    server: Server;
    formattedName: string;
    category: string;
  }>;
  formatRepositoryName: (name: string) => string;
}

export default function McpPagination({
  servers,
  category,
  RepositoryCard,
  formatRepositoryName
}: McpPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 30; // Hardcoded to 30 items per page

  // Filter servers based on search query
  const filteredServers = useMemo(() => {
    if (!searchQuery.trim()) {
      return servers;
    }

    const searchLower = searchQuery.toLowerCase();
    return servers.filter(server =>
      server.name.toLowerCase().includes(searchLower) ||
      server.description.toLowerCase().includes(searchLower) ||
      server.license.toLowerCase().includes(searchLower)
    );
  }, [servers, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredServers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServers = filteredServers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Items per page is hardcoded to 30

  // Handle go to page
  const handleGoToPage = (pageInput: string) => {
    const pageNum = parseInt(pageInput);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      alert(`Please enter a page number between 1 and ${totalPages}`);
    }
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      {/* Pagination Info and Controls - Top */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">Page {currentPage} of {totalPages}</span>
          <span className="mx-2">•</span>
          <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredServers.length)} of {filteredServers.length} repositories</span>
          <span className="mx-2">•</span>
          <span>(30 items per page)</span>
        </div>

        {/* Navigation Controls - Top */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 1
                ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
            >
              ← Previous
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === totalPages
                ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
            >
              Next →
            </button>
          </div>

          {/* Go to page input */}
          <div className="flex items-center gap-2">
            <label htmlFor="go-to-page" className="text-sm text-slate-600 dark:text-slate-400">Go to page:</label>
            <input
              type="number"
              id="go-to-page"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={() => {
                const input = document.getElementById('go-to-page') as HTMLInputElement;
                handleGoToPage(input.value);
              }}
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              GO
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mb-6">
        <div className="relative">
          <input
            type="text"
            id="repository-search"
            placeholder="Search repositories by name or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Repositories List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {currentServers.length === 0 ? (
          <div className="col-span-1 lg:col-span-2 text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No repositories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'No repositories match your search criteria.' : 'There are no MCP repositories in this category yet.'}
            </p>
          </div>
        ) : (
          currentServers.map((server) => {
            const formattedName = formatRepositoryName(server.name);
            return (
              <RepositoryCard
                key={server.name}
                server={server}
                formattedName={formattedName}
                category={category}
              />
            );
          })
        )}
      </div>

      {/* Pagination Controls - Bottom */}
      {totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    1
                  </button>
                  <span className="px-2 text-slate-400">...</span>
                </>
              )}

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pageNum === currentPage
                    ? 'text-white bg-blue-600 border border-blue-600'
                    : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              {currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 text-slate-400">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 1
                  ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
              >
                ← Previous
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === totalPages
                  ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
