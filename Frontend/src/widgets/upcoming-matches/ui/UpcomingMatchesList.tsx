import React from 'react';
import { MatchCard, type MatchData } from '../../../entities/booking/ui/MatchCard';
import { MatchmakingCard, type MatchmakingData } from '../../../entities/matchmaking-post/ui/MatchmakingCard';

// Dummy data for rendering
const UPCOMING_MATCHES: MatchData[] = [
  {
    id: '1',
    dateLabel: 'TODAY',
    time: '19:30',
    team1Logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyEJzs3csIqmlIxOFZ6ZwUu_2T3r6K2sU8ExG6Z6uLBH_xb5S8RWDfRhZ62yUFhT9NytHGSB3KZQ6gpR6BuqHRNn4-m6MBRgq3jaW4TgYiWJSYJBPLwi5XjbLANJJSVtOvIzi6X3QYziS3B6vVwo5YYW82RRHcNSnb0AUd3reN4OfO4NR3I0FMF-puMMjO-WghRkJ2JSPA_4Pm3Qv_Xy8mAdFwICfjwbU1fNHFwxztcBOq536NUwidVEMuasxbw17CLLtjlQnOHnM',
    team2Logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj-zU4-qy_m_zmq91Qh6GE-dFkttiUqpGql7uRiWoSPtBi7M09_rMqVJPZ9mI1s1kvIoaylGpmt081YYHmWjr1awNvrM2V8ZAcjORLibturb0SURJKWrLhEawDzyrY4YsGb1rQh4rb-Q09z78zKdu7bunIHBcHkFU44JIVQmRnlqIjrGZHspURQcsFXY43Lt-W2MurQoWnRYNT9ld6QlfsfTD7CwHA7eS8odpJ56IEwhA5yAYnDLcQiF8irUVSc3Cn7HKt2F0nYXU',
    title: 'Lions FC vs Thunder XI',
    location: 'Stadium Pitch A',
    pitchType: '7-a-side',
    isToday: true,
  },
  {
    id: '2',
    dateLabel: 'THU, 14',
    time: '20:00',
    team1Logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBodxq8F-InZhDp-Y1N_73kQ0yzW_FPQ92JmLAxJKeosrpeQKW2l6TnYyf4q6f-CAHiyTuNb4c0ZHjLUGt5HZ0vO1EgPi4RwvPqu8bOoNm0oRTnQUTDMhCtW4CAn4yM5e8XcPImI0okVLIO0Tinf7B0FumflrcS48dyrKgXSS1WiDKfHE52hARkTDRt5dac-2aJVNz1Dfr55L4sRtd7oqls7rbcq7Z8m8js28kp_aUX3bwP5EWnRMikG-cibZswmbHpCVwCTNf8mP0',
    team2Logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX8_A_1g1JKECqTI9gMy2Pa1W7Yw8EQDXNDrEtqR5dfp4S_VBDzEbb4T6_lIxe9ytguuFnl9XU6luJb6T0aPyfBUdho5Et0A2CVL4NXT4cN5uFYHr33Alorp0LIsQrve37OLQ0cbWbT96vbFnUmQq54JKp_UUGkRDJSeeOnHrToVp9aoRzAZMiHyjHfqbZ5Reyu_9fqXwyZk4udn9mkS0Ny0Lxh6xaFh9H4R2mZzDh-iADKy7U4P1OOxyMuQvC5pm3mx_NQLdRUJU',
    title: 'Weekly Social Match',
    location: 'Central Park Arena',
    pitchType: '5-a-side',
    isToday: false,
  }
];

const MATCHMAKING_POSTS: MatchmakingData[] = [
  {
    id: 'm1',
    type: 'match',
    startsIn: '45m',
    title: 'Evening Scrimmage',
    spotsLeft: 1,
    level: 'Intermediate Level',
    price: '$12.00',
  },
  {
    id: 'm2',
    type: 'team',
    startsIn: '1h 20m',
    title: 'Friday Night Lights',
    spotsLeft: 3,
    level: 'Casual Play',
    price: '$10.00',
  }
];

export const UpcomingMatchesList: React.FC = () => {
  return (
    <div className="space-y-lg">
      <section className="space-y-md">
        <div className="flex justify-between items-end mb-sm">
          <h3 className="font-h2 text-h2 text-emerald-900">Upcoming Matches</h3>
          <a className="text-primary font-button text-sm hover:underline cursor-pointer">View Schedule</a>
        </div>
        <div className="grid grid-cols-1 gap-md">
          {UPCOMING_MATCHES.map(match => (
            <MatchCard key={match.id} data={match} />
          ))}
        </div>
      </section>

      <section className="pt-sm">
        <div className="flex justify-between items-end mb-md">
          <h3 className="font-h2 text-h2 text-emerald-900">Quick Join Matchmaking</h3>
          <span className="text-xs font-label-caps text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Live matches nearby</span>
        </div>
        <div className="grid grid-cols-2 gap-md">
          {MATCHMAKING_POSTS.map(post => (
            <MatchmakingCard key={post.id} data={post} />
          ))}
        </div>
      </section>
    </div>
  );
};
