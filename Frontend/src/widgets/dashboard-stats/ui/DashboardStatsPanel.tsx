import React from 'react';
import { StatCard } from '../../../entities/user/ui/StatCard';

const NOTIFICATIONS = [
  { id: 1, title: 'Payment Successful', desc: 'Your booking for Pitch A is confirmed.', time: '2 mins ago', type: 'success' },
  { id: 2, title: 'New Match Invitiation', desc: 'Thunder XI invited you to join a game.', time: '1 hour ago', type: 'info' },
  { id: 3, title: 'Match Results Ready', desc: 'Check the stats from your last game.', time: 'Yesterday', type: 'default' },
];

export const DashboardStatsPanel: React.FC = () => {
  return (
    <div className="space-y-lg">
      <StatCard title="TOTAL PLAYED" value="42 Matches" icon="sports_soccer" />

      {/* Notifications Widget inline */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-h3 text-h3 text-emerald-900">Notifications</h3>
          <button className="text-xs font-button text-gray-400 hover:text-primary transition-colors">Mark read</button>
        </div>
        
        <div className="space-y-md">
          {NOTIFICATIONS.map(notif => (
            <div key={notif.id} className={`flex gap-md group ${notif.type === 'default' ? 'opacity-70' : ''}`}>
              <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'success' || notif.type === 'info' ? 'bg-primary' : 'bg-transparent border border-gray-300'}`}></div>
              <div className="flex-1">
                <p className="text-sm font-button text-on-surface">{notif.title}</p>
                <p className="text-xs text-gray-500">{notif.desc}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-label-caps">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-lg pt-md border-t border-gray-100 text-sm font-button text-gray-500 hover:text-primary transition-colors">
          View All Notifications
        </button>
      </div>

      {/* Pitch Status Widget inline */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg overflow-hidden relative shadow-sm">
        <h3 className="font-h3 text-h3 text-emerald-900 mb-md">Pitch Status</h3>
        <div className="space-y-sm">
          <div className="flex items-center justify-between text-xs font-button mb-xs">
            <span className="text-gray-600">Stadium Arena</span>
            <span className="text-error font-bold">BUSY</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-error w-[85%] h-full"></div>
          </div>
          
          <div className="flex items-center justify-between text-xs font-button mt-4 mb-xs">
            <span className="text-gray-600">West Wing Pitches</span>
            <span className="text-emerald-600 font-bold">AVAILABLE</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 w-[30%] h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
