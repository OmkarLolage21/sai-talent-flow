import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Trophy, Star, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Player {
  id: string;
  name: string;
  age: number;
  location: string;
  primarySport: string;
  joinDate: string;
  totalVideos: number;
  averageScore: number;
  personalBests: Record<string, string>;
  inTalentPool: boolean;
  lastActive: string;
}

const players: Player[] = [
  {
    id: 'ATH001',
    name: 'Priya Sharma',
    age: 19,
    location: 'Mumbai, Maharashtra',
    primarySport: 'Athletics',
    joinDate: '2024-08-15',
    totalVideos: 23,
    averageScore: 8.7,
    personalBests: { verticalJump: '45cm', shuttleRun: '12.3s', sitUps: '52 reps' },
    inTalentPool: true,
    lastActive: '2 hours ago'
  },
  {
    id: 'BBL002',
    name: 'Arjun Singh',
    age: 20,
    location: 'Chandigarh, Punjab',
    primarySport: 'Basketball',
    joinDate: '2024-07-22',
    totalVideos: 31,
    averageScore: 9.1,
    personalBests: { verticalJump: '58cm', shuttleRun: '11.8s', pushUps: '67 reps' },
    inTalentPool: true,
    lastActive: '1 hour ago'
  },
  {
    id: 'SWM003',
    name: 'Meera Patel',
    age: 18,
    location: 'Ahmedabad, Gujarat',
    primarySport: 'Swimming',
    joinDate: '2024-09-10',
    totalVideos: 18,
    averageScore: 8.9,
    personalBests: { freestyle50m: '26.8s', butterfly100m: '1:02.3', endurance: '15min' },
    inTalentPool: false,
    lastActive: '30 minutes ago'
  },
  {
    id: 'FTB004',
    name: 'Rohit Kumar',
    age: 21,
    location: 'Kochi, Kerala',
    primarySport: 'Football',
    joinDate: '2024-06-18',
    totalVideos: 27,
    averageScore: 8.3,
    personalBests: { sprint20m: '3.2s', ballControl: '95%', endurance: '18min' },
    inTalentPool: false,
    lastActive: '5 hours ago'
  },
  {
    id: 'BDM005',
    name: 'Sneha Rao',
    age: 19,
    location: 'Bangalore, Karnataka',
    primarySport: 'Badminton',
    joinDate: '2024-08-03',
    totalVideos: 22,
    averageScore: 8.5,
    personalBests: { smashSpeed: '285kmh', agility: '9.2s', precision: '92%' },
    inTalentPool: true,
    lastActive: '3 hours ago'
  },
  {
    id: 'WRS006',
    name: 'Vikram Joshi',
    age: 22,
    location: 'Gurgaon, Haryana',
    primarySport: 'Wrestling',
    joinDate: '2024-05-12',
    totalVideos: 35,
    averageScore: 7.9,
    personalBests: { strength: '180kg', technique: '8.7/10', flexibility: '85%' },
    inTalentPool: false,
    lastActive: '1 day ago'
  }
];

const AllPlayers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showTalentPoolOnly, setShowTalentPoolOnly] = useState(false);

  const sports = ['all', 'Athletics', 'Basketball', 'Swimming', 'Football', 'Badminton', 'Wrestling'];
  const states = ['all', 'Maharashtra', 'Punjab', 'Gujarat', 'Kerala', 'Karnataka', 'Haryana'];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === 'all' || player.primarySport === selectedSport;
    const matchesState = selectedState === 'all' || player.location.includes(selectedState);
    const matchesTalentPool = !showTalentPoolOnly || player.inTalentPool;
    
    return matchesSearch && matchesSport && matchesState && matchesTalentPool;
  });

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-success';
    if (score >= 8.0) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Players</h1>
          <p className="text-muted-foreground">View and manage all registered athletes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export List
          </Button>
          <Button className="btn-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Player
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="sai-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              {sports.map(sport => (
                <SelectItem key={sport} value={sport}>
                  {sport === 'all' ? 'All Sports' : sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state}>
                  {state === 'all' ? 'All States' : state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant={showTalentPoolOnly ? "default" : "outline"}
            onClick={() => setShowTalentPoolOnly(!showTalentPoolOnly)}
          >
            <Star className="w-4 h-4 mr-2" />
            Talent Pool Only
          </Button>
        </div>
      </Card>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <Card key={player.id} className="sai-card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{player.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {player.id}</p>
                    </div>
                  </div>
                  {player.inTalentPool && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Talent Pool
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span>{player.primarySport}</span>
                    <span className="text-muted-foreground">• Age {player.age}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{player.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(player.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{player.totalVideos}</p>
                    <p className="text-xs text-muted-foreground">Videos</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${getScoreColor(player.averageScore)}`}>
                      {player.averageScore}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-card-border">
                  <p className="text-xs text-muted-foreground mb-2">Recent Activity</p>
                  <p className="text-sm">{player.lastActive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <Card className="sai-card p-12 text-center">
          <p className="text-muted-foreground">No players found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default AllPlayers;