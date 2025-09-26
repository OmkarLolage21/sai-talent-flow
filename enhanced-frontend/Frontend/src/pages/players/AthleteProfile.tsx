import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigation } from '@/hooks/useNavigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import samplePlayers from '@/lib/samplePlayers';

const AthleteProfile: React.FC<{ athleteId?: string }> = ({ athleteId }) => {
  const { setActiveSection, selectedPlayerId } = useNavigation();

  // Fallback sample data (since there's no central API yet)
  const player = useMemo(() => {
    const id = athleteId ?? selectedPlayerId;
    return samplePlayers.find(p => p.id === id) ?? samplePlayers[0];
  }, [athleteId, selectedPlayerId]);

  const performance = [
    { date: '2025-08-01', score: 7.8 },
    { date: '2025-08-15', score: 8.1 },
    { date: '2025-09-01', score: 8.4 },
    { date: '2025-09-15', score: 8.6 }
  ];

  if (!player) return <div className="p-6">Athlete not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback>{player.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{player.name}</h1>
            <p className="text-muted-foreground">{player.location} • Age {player.age}</p>
            <p className="text-sm text-muted-foreground">Registered {new Date(player.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveSection('players', 'all-players')}>Back</Button>
          <Button className="btn-primary">Export Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold">Overall Performance</h3>
          <p className="text-3xl font-bold mt-2">{player.averageScore}</p>
          <p className="text-sm text-muted-foreground">Average score across submissions</p>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h3 className="font-semibold mb-2">Performance trends</h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis domain={[5, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: Math.min(8, player.totalVideos || 4) }).map((_, i) => (
            <div key={i} className="border rounded overflow-hidden">
              <div className="w-full h-32 bg-zinc-100 flex items-center justify-center text-muted-foreground">Thumbnail</div>
              <div className="p-2">
                <div className="text-sm font-medium">{player.primarySport} Drill {i + 1}</div>
                <div className="text-xs text-muted-foreground">Score {(player.averageScore - 0.2 + Math.random()).toFixed(1)}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AthleteProfile;
