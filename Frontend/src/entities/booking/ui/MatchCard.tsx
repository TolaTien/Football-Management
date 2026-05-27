import React from 'react';

export interface MatchData {
  id: string;
  dateLabel: string;
  time: string;
  team1Logo: string;
  team2Logo: string;
  title: string;
  location: string;
  pitchType: string;
  isToday?: boolean;
}

interface MatchCardProps {
  data: MatchData;
  onViewDetails?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ data, onViewDetails }) => {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center justify-between hover:shadow-md transition-all relative overflow-hidden group">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.isToday ? 'bg-primary' : 'bg-gray-300'}`}></div>
      
      <div className="flex items-center gap-lg">
        <div className="text-center px-4 py-2 bg-gray-50 rounded-lg min-w-[80px]">
          <p className="text-xs font-label-caps text-gray-500">{data.dateLabel}</p>
          <p className="text-lg font-h2 text-emerald-900">{data.time}</p>
        </div>
        
        <div className="flex items-center gap-md">
          <div className="flex -space-x-3">
            <img className="w-12 h-12 rounded-full border-2 border-white object-cover bg-gray-200" src={data.team1Logo} alt="Team 1" />
            <img className="w-12 h-12 rounded-full border-2 border-white object-cover bg-gray-200" src={data.team2Logo} alt="Team 2" />
          </div>
          <div>
            <h4 className="font-h3 text-h3">{data.title}</h4>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-xs">
              <span className="material-symbols-outlined text-sm" data-icon="location_on">location_on</span>
              <span>{data.location} • {data.pitchType}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onViewDetails}
        className={`px-6 py-2 rounded-lg font-button text-sm transition-colors ${data.isToday ? 'bg-primary text-white hover:bg-primary-container' : 'border border-outline text-primary hover:bg-gray-50'}`}
      >
        View Details
      </button>
    </div>
  );
};
