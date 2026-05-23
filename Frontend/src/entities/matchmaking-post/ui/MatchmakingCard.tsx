import React from 'react';

export interface MatchmakingData {
  id: string;
  type: 'match' | 'team';
  startsIn: string;
  title: string;
  spotsLeft: number;
  level: string;
  price: string;
}

interface MatchmakingCardProps {
  data: MatchmakingData;
}

export const MatchmakingCard: React.FC<MatchmakingCardProps> = ({ data }) => {
  const isMatch = data.type === 'match';
  const icon = isMatch ? 'sports_soccer' : 'groups';

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-md hover:border-primary transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-md">
        <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
          <span className="material-symbols-outlined" data-icon={icon}>{icon}</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-label-caps text-gray-400">STARTS IN</p>
          <p className="font-h3 text-h3 text-emerald-900">{data.startsIn}</p>
        </div>
      </div>
      
      <h5 className="font-h3 text-sm mb-xs">{data.title}</h5>
      <p className="text-gray-500 text-xs mb-md">{data.spotsLeft} spots left • {data.level}</p>
      
      <div className="flex items-center justify-between">
        <span className="font-button text-sm text-primary">{data.price}</span>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-button hover:bg-primary-container active:scale-95 transition-all">
          Join Now
        </button>
      </div>
    </div>
  );
};
