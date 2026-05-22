import React from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { UpcomingMatchesList } from '@/widgets/upcoming-matches/ui/UpcomingMatchesList';
import { DashboardStatsPanel } from '@/widgets/dashboard-stats/ui/DashboardStatsPanel';

const DashboardPage: React.FC = () => {
  const user = useAppSelector((state) => state.user.currentUser);

  return (
    <div className="animate-in fade-in duration-300 pb-xl">
      {/* Welcome Section */}
      <div className="mb-xl">
        <h2 className="font-h1 text-h1 text-emerald-900">
          Welcome back, {user?.fullName?.split(' ')[0] || 'Player'}!
        </h2>
        <p className="text-gray-500 font-body-lg">You have 3 matches scheduled for this week.</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* Left Column (Takes up 8/12 on large screens) */}
        <section className="md:col-span-8">
          <UpcomingMatchesList />
        </section>

        {/* Right Column (Takes up 4/12 on large screens) */}
        <aside className="md:col-span-4">
          <DashboardStatsPanel />
        </aside>
      </div>

      {/* Contextual FAB (Floating Action Button) */}
      <button className="fixed bottom-lg right-lg bg-emerald-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-800 transition-all active:scale-95 z-50 group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300" data-icon="add_circle">add_circle</span>
      </button>
    </div>
  );
};

export default DashboardPage;
