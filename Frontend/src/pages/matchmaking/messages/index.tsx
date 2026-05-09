import React from 'react';

const PrivateDirectMessages: React.FC = () => {
  return (
    <div className="p-0 flex h-[calc(100vh-64px)] overflow-hidden">
      <section className="w-[320px] border-r border-gray-100 bg-white flex flex-col h-full">
        <div className="p-md border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-h2 text-lg text-emerald-900">Messages</h2>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors">
            <span className="material-symbols-outlined text-sm">edit_square</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[
            { name: 'Marco Silva', time: '12:45 PM', msg: 'See you on the pitch at 6!', active: true },
            { name: 'Sarah Jenkins', time: '09:12 AM', msg: 'Are we still playing tonight?', active: false },
          ].map((chat, i) => (
            <div key={i} className={`p-md cursor-pointer transition-all border-b border-gray-50 ${chat.active ? 'bg-emerald-50/40 border-r-4 border-emerald-900' : 'hover:bg-gray-50'}`}>
              <div className="flex gap-md">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-sm text-emerald-900 truncate">{chat.name}</h4>
                    <span className="text-[10px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.msg}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex-1 flex flex-col bg-white h-full relative">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-emerald-900"></div>
           <div>
              <p className="font-bold text-emerald-900">Marco Silva</p>
              <p className="text-[10px] text-emerald-600">Online</p>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div className="flex gap-3 max-w-[80%]">
            <div className="bg-white p-4 rounded-xl shadow-sm text-sm text-gray-700">
              Hi Marcus, did you manage to secure the 6 PM slot at Wembley Park?
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3 ml-auto max-w-[80%]">
            <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-sm text-sm">
              Yes, just got the confirmation! Everything is set for the team. ⚽️
            </div>
          </div>
        </div>
        <footer className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3">
             <input className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-900 outline-none" placeholder="Type a message..." />
             <button className="bg-emerald-900 text-white p-3 rounded-xl hover:bg-emerald-800 transition-colors">
                <span className="material-symbols-outlined">send</span>
             </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default PrivateDirectMessages;
