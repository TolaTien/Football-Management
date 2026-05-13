import React from 'react';

const SocialMatchmakingFeed: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-h1 text-h1 text-emerald-900">Team Matchmaking</h2>
          <p className="font-body-md text-gray-500 mt-1">Find opponent teams for your next competitive or casual fixture.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2">
            <span className="text-xs font-label-caps text-gray-400">SKILL LEVEL:</span>
            <select className="border-none bg-transparent text-sm font-bold text-emerald-900 focus:ring-0 p-0">
              <option>All Levels</option>
              <option>Amateur</option>
              <option>Intermediate</option>
              <option>Professional</option>
            </select>
          </div>
          <button className="bg-emerald-50 text-emerald-900 px-4 py-2 rounded-lg font-button flex items-center gap-2 hover:bg-emerald-100 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            More Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Match Card 1 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group relative">
          <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-emerald-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Professional</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Waiting
              </span>
            </div>
            <h3 className="font-h3 text-h3 text-emerald-900 mb-2">Wembley Arena - Pitch 4</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-500 text-sm gap-2">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>Saturday, Oct 24 • 19:00 - 20:30</span>
              </div>
              <div className="flex items-center text-emerald-900 font-bold text-sm gap-2 mt-4">
                <span className="material-symbols-outlined text-sm">sports_kabaddi</span>
                <span>Opponent Wanted</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-900 flex items-center justify-center text-[10px] font-bold text-white">FC</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">+8</div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-gray-500 hover:text-emerald-900 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                  <span className="text-xs font-bold font-button">Like</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-emerald-900 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                  <span className="text-xs font-bold font-button">Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Match Card 2 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group relative">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Amateur</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Waiting
              </span>
            </div>
            <h3 className="font-h3 text-h3 text-emerald-900 mb-2">Central Park Turf</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-500 text-sm gap-2">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>Today • 17:30 - 18:30</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">TX</div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-gray-500 hover:text-emerald-900 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                  <span className="text-xs font-bold font-button">Like</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-emerald-900 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                  <span className="text-xs font-bold font-button">Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button className="border border-gray-200 bg-white text-emerald-900 px-8 py-3 rounded-lg font-button hover:bg-gray-50 transition-all flex items-center gap-2">
          Load More Opportunities
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>
      </div>

      <div className="fixed bottom-8 right-8">
        <button className="bg-emerald-900 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group">
          <span className="material-symbols-outlined">add</span>
          <span className="absolute right-full mr-4 bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-button">Host a Match</span>
        </button>
      </div>
    </div>
  );
};

export default SocialMatchmakingFeed;
