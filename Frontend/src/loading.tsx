import React from 'react';

// This file is auto-used by UmiJS as the global loading component
// shown while lazy-loaded route chunks are being downloaded.
const PageLoading: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar skeleton */}
      <div className="fixed left-0 top-0 h-screen w-[260px] border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="px-6 py-8">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex-1 px-3 space-y-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + i * 8}px` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="ml-[260px] flex-1 p-8">
        {/* Header skeleton */}
        <div className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-white border-b border-gray-100 flex items-center px-8 gap-4 z-40">
          <div className="h-9 w-72 bg-gray-100 rounded-full animate-pulse" />
          <div className="ml-auto flex gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-full animate-pulse" />
            <div className="w-9 h-9 bg-gray-100 rounded-full animate-pulse" />
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="pt-16 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Content block */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
                <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
