import React from 'react';

const PersonalActivityStats: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-xl">
        <h2 className="font-h1 text-h1 text-primary-container">Player Activity</h2>
        <p className="font-body-lg text-secondary">Analyzing your season performance and physical metrics across all pitches.</p>
      </div>

      <div className="grid grid-cols-12 gap-lg mb-xl">
        <div className="col-span-12 bg-white border border-gray-100 rounded-xl p-lg shadow-sm relative overflow-hidden lg:col-span-12">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
          <div className="flex justify-between items-start mb-md">
            <div>
              <span className="font-label-caps text-secondary uppercase tracking-widest">Season Win Rate</span>
              <h3 className="font-h1 text-h1 text-primary-container mt-xs">68%</h3>
            </div>
            <div className="bg-emerald-50 p-sm rounded-lg text-primary">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
          </div>

          <div className="h-24 flex items-end gap-xs px-md">
            <div className="flex-1 bg-primary-container/20 h-[40%] rounded-sm"></div>
            <div className="flex-1 bg-primary-container/40 h-[60%] rounded-sm"></div>
            <div className="flex-1 bg-primary-container/60 h-[55%] rounded-sm"></div>
            <div className="flex-1 bg-primary-container/80 h-[80%] rounded-sm"></div>
            <div className="flex-1 bg-primary-container h-[95%] rounded-sm"></div>
          </div>
          <p className="text-xs text-secondary mt-md">+12% vs last month performance</p>
        </div>

        <div className="col-span-12 bg-white border border-gray-100 rounded-xl p-lg shadow-sm lg:col-span-12">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-h3 text-h3 text-on-surface">Frequency of Play</h3>
            <div className="flex gap-sm">
              <button className="px-3 py-1 text-xs font-semibold bg-primary-container text-white rounded-full">Monthly</button>
              <button className="px-3 py-1 text-xs font-semibold text-secondary hover:bg-gray-50 rounded-full transition-colors">Quarterly</button>
            </div>
          </div>
          <div className="h-48 w-full flex items-end justify-between px-md pb-xs border-b border-gray-100">
            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((m, i) => (
              <div key={m} className="flex flex-col items-center gap-sm w-12">
                <div className={`w-full bg-primary-container/${(i + 1) * 10} h-${(i + 2) * 4} rounded-t-sm`} style={{ height: `${20 + i * 15}%` }}></div>
                <span className="text-[10px] font-label-caps text-secondary">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-lg border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-h3 text-h3 text-on-surface">Comprehensive Match History</h3>
          <div className="flex gap-md">
            <button className="flex items-center gap-xs px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-all font-semibold">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-xs px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-all font-semibold">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-lg py-4 font-label-caps text-secondary border-b border-gray-100">Date</th>
                <th className="px-lg py-4 font-label-caps text-secondary border-b border-gray-100">Opponent</th>
                <th className="px-lg py-4 font-label-caps text-secondary border-b border-gray-100 text-center">Score</th>
                <th className="px-lg py-4 font-label-caps text-secondary border-b border-gray-100 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-emerald-50/10 transition-colors">
                <td className="px-lg py-4 text-sm font-medium text-on-surface">Oct 24, 2023</td>
                <td className="px-lg py-4">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs text-secondary">FC</div>
                    <span className="text-sm font-semibold">Falcons City</span>
                  </div>
                </td>
                <td className="px-lg py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-md font-mono font-bold text-emerald-900">3 - 1</span>
                </td>
                <td className="px-lg py-4 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Win
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonalActivityStats;
