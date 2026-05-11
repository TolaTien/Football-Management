import React from 'react';

const TeamManagement: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-h1 text-h1 text-emerald-900">My Team</h2>
          <p className="text-gray-500 font-body-lg">Manage your roster and view team statistics.</p>
        </div>
        <button className="bg-emerald-900 text-white px-6 py-2 rounded-lg font-button flex items-center gap-2 hover:bg-emerald-800 transition-all">
          <span className="material-symbols-outlined">person_add</span>
          Invite Player
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-h3 text-h3 text-emerald-900">Active Roster</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: 'Marcus F.', role: 'Captain', status: 'Available', color: 'bg-emerald-900' },
                { name: 'David L.', role: 'Midfielder', status: 'Available', color: 'bg-blue-600' },
                { name: 'Sarah K.', role: 'Defender', status: 'Away', color: 'bg-amber-500' },
              ].map((player, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${player.color} flex items-center justify-center text-white font-bold text-xs`}>
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-emerald-900">{player.name}</p>
                      <p className="text-xs text-gray-500">{player.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${player.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {player.status}
                    </span>
                    <button className="text-gray-400 hover:text-emerald-900">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="bg-emerald-900 text-white rounded-xl p-6 shadow-md">
            <h4 className="text-emerald-300 font-label-caps text-xs mb-4">TEAM RANKING</h4>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-h1">#14</span>
              <span className="text-emerald-400 text-sm mb-1">in Local League</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-4">
              <div className="bg-emerald-400 w-3/4 h-full rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
