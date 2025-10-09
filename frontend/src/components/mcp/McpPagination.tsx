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
    console.log('handleGoToPage called with:', pageInput);
    const pageNum = parseInt(pageInput);
    console.log('Parsed page number:', pageNum, 'Total pages:', totalPages);
    if (pageNum >= 1 && pageNum <= totalPages) {
      console.log('Setting current page to:', pageNum);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="text-sm text-slate-900 dark:text-slate-400 mb-2 sm:mb-0">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredServers.length)} of {filteredServers.length} repositories (Page {currentPage} of {totalPages})
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Pagination buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <span className="text-sm text-slate-500 dark:text-slate-400">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
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

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
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
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pageNum === currentPage
                    ? 'text-white bg-blue-600 border border-blue-600'
                    : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
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
                    className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          {/* Page Input Box */}
          <div className="mt-4 flex items-center space-x-2">
            <label htmlFor="page-input" className="text-sm text-slate-700 dark:text-slate-300">
              Go to page:
            </label>
            <input
              id="page-input"
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              placeholder={currentPage.toString()}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleGoToPage(e.currentTarget.value);
                }
              }}
              className="w-20 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
            />
            <button
              onClick={() => {
                console.log('GO button clicked!');
                const input = document.getElementById('page-input') as HTMLInputElement;
                console.log('Input element:', input);
                if (input) {
                  console.log('Input value:', input.value);
                  handleGoToPage(input.value);
                } else {
                  console.log('Input element not found!');
                }
              }}
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Go
            </button>
          </div>

          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages} • {filteredServers.length} total repositories
          </div>
        </div>
      )}
    </div>
  );
}
