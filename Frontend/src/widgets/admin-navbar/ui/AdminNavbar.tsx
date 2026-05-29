import React from 'react';

export const AdminNavbar: React.FC = () => {
  return (
    <header className="h-16 px-8 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm ml-[260px]">
      <div />

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative text-gray-500 hover:text-primary transition-all p-2 hover:bg-gray-100 rounded-full">
          <span className="material-symbols-outlined flex items-center justify-center text-[22px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        {/* Settings button */}
        <button className="text-gray-500 hover:text-primary transition-all p-2 hover:bg-gray-100 rounded-full">
          <span className="material-symbols-outlined flex items-center justify-center text-[22px]">settings</span>
        </button>
      </div>
    </header>
  );
};
