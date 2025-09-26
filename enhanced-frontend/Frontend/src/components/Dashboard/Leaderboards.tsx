import React, { useState } from 'react';
import { Trophy, Medal, Award, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardEntry {
  rank: number;
  name: string;
  sport: string;
  score: number;
  location: string;
  improvement: number;
}

const RankIcon: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
  return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
};

const LeaderboardTable: React.FC<{ data: LeaderboardEntry[] }> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((entry, index) => (
        <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors">
          <RankIcon rank={entry.rank} />
          
          <Avatar className="w-10 h-10">
            <AvatarFallback>
              {entry.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h4 className="font-medium">{entry.name}</h4>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{entry.sport}</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{entry.location}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-bold text-lg">{entry.score}</div>
            <div className="text-sm text-success">
              +{entry.improvement}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Leaderboards: React.FC = () => {
  const overallData: LeaderboardEntry[] = [
    { rank: 1, name: 'Arjun Singh', sport: 'Basketball', score: 9.4, location: 'Punjab', improvement: 12 },
    { rank: 2, name: 'Priya Sharma', sport: 'Athletics', score: 9.2, location: 'Maharashtra', improvement: 8 },
    { rank: 3, name: 'Meera Patel', sport: 'Swimming', score: 9.1, location: 'Gujarat', improvement: 15 },
    { rank: 4, name: 'Rohit Kumar', sport: 'Football', score: 8.9, location: 'Kerala', improvement: 6 },
    { rank: 5, name: 'Sneha Rao', sport: 'Badminton', score: 8.8, location: 'Karnataka', improvement: 10 }
  ];

  const athleticsData: LeaderboardEntry[] = [
    { rank: 1, name: 'Priya Sharma', sport: 'Sprint', score: 9.2, location: 'Maharashtra', improvement: 8 },
    { rank: 2, name: 'Raj Patel', sport: 'Long Jump', score: 8.9, location: 'Gujarat', improvement: 12 },
    { rank: 3, name: 'Anjali Singh', sport: 'High Jump', score: 8.7, location: 'Rajasthan', improvement: 5 }
  ];

  const basketballData: LeaderboardEntry[] = [
    { rank: 1, name: 'Arjun Singh', sport: 'Point Guard', score: 9.4, location: 'Punjab', improvement: 12 },
    { rank: 2, name: 'Vikram Joshi', sport: 'Center', score: 8.8, location: 'Haryana', improvement: 9 },
    { rank: 3, name: 'Karan Malik', sport: 'Forward', score: 8.6, location: 'Delhi', improvement: 7 }
  ];

  return (
    <div className="sai-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-5 h-5 text-secondary" />
        <h2 className="text-xl font-semibold">Performance Leaderboards</h2>
      </div>
      
      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="athletics">Athletics</TabsTrigger>
          <TabsTrigger value="basketball">Basketball</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overall" className="mt-6">
          <LeaderboardTable data={overallData} />
        </TabsContent>
        
        <TabsContent value="athletics" className="mt-6">
          <LeaderboardTable data={athleticsData} />
        </TabsContent>
        
        <TabsContent value="basketball" className="mt-6">
          <LeaderboardTable data={basketballData} />
        </TabsContent>
        
        <TabsContent value="regional" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-primary">North India</h3>
              <LeaderboardTable data={overallData.slice(0, 3)} />
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-primary">South India</h3>
              <LeaderboardTable data={overallData.slice(2, 5)} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};