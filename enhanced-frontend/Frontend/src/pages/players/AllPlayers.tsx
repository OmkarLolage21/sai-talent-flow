import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Calendar, Trophy, Star, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/appStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
// ...existing code... (removed sheet & inline charts - profile moved to dedicated page)

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

interface VideoSample {
  id: string;
  title: string;
  date: string;
  score: number;
  duration: string;
  thumbnail?: string;
}

import { useNavigation } from '@/hooks/useNavigation';

const AllPlayers: React.FC = () => {
  const { players, addPlayer, pushNotification } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showTalentPoolOnly, setShowTalentPoolOnly] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const { setActiveSection, setSelectedPlayerId } = useNavigation();

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
          <Button variant="outline" onClick={() => {
            const csv = 'id,name,age,location,sport,avgScore\n' + players.map(p=>`${p.id},${p.name},${p.age},${p.location},${p.primarySport},${p.averageScore}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'players.csv'; a.click();
            pushNotification('Exported player list','player');
          }}>
            Export List
          </Button>
          <Button className="btn-primary" onClick={() => setAddOpen(true)}>
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
          <Card
            key={player.id}
            className="sai-card hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => {
              // navigate to athlete profile
              setSelectedPlayerId(player.id);
              setActiveSection('players', 'athlete-profile');
            }}
          >
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
      <Dialog open={addOpen} onOpenChange={(o)=> !o && setAddOpen(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Player</DialogTitle></DialogHeader>
          <form className="space-y-3" onSubmit={e=> { e.preventDefault(); const f = new FormData(e.currentTarget); addPlayer({ name: f.get('name') as string, age: +(f.get('age') as string), location: f.get('location') as string, primarySport: f.get('sport') as string, inTalentPool: f.get('talent') === 'on' }); pushNotification('Player added','player'); setAddOpen(false); }}>
            <Input name="name" placeholder="Name" required />
            <Input name="age" type="number" placeholder="Age" required />
            <Input name="location" placeholder="Location" required />
            <Input name="sport" placeholder="Primary Sport" required />
            <label className="flex items-center gap-2 text-sm"><input name="talent" type="checkbox" /> Talent Pool</label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={()=> setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllPlayers;