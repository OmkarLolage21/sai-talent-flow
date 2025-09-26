import React, { useState } from 'react';
import { Search, Filter, Play, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Exercise {
  id: string;
  name: string;
  sport: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  metrics: string[];
  submissions: number;
  avgScore: number;
  createdBy: string;
  createdAt: string;
  thumbnail: string;
}

const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Vertical Jump Test',
    sport: 'Athletics',
    difficulty: 'beginner',
    description: 'Measures explosive leg power and vertical leap ability',
    metrics: ['Power', 'Technique', 'Height'],
    submissions: 245,
    avgScore: 7.8,
    createdBy: 'Dr. Singh',
    createdAt: '2024-01-15',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2', 
    name: 'Shuttle Run 20m',
    sport: 'Basketball',
    difficulty: 'intermediate',
    description: 'Tests agility, speed, and change of direction',
    metrics: ['Speed', 'Agility', 'Endurance'],
    submissions: 189,
    avgScore: 8.2,
    createdBy: 'Coach Patel',
    createdAt: '2024-01-10',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '3',
    name: 'Push-up Endurance',
    sport: 'General',
    difficulty: 'beginner',
    description: 'Measures upper body strength and endurance',
    metrics: ['Strength', 'Endurance', 'Form'],
    submissions: 312,
    avgScore: 7.5,
    createdBy: 'Trainer Kumar',
    createdAt: '2024-01-08',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '4',
    name: 'Swimming Technique',
    sport: 'Swimming',
    difficulty: 'advanced',
    description: 'Evaluates stroke technique and efficiency',
    metrics: ['Technique', 'Speed', 'Efficiency'],
    submissions: 98,
    avgScore: 8.7,
    createdBy: 'Coach Sharma',
    createdAt: '2024-01-05',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '5',
    name: 'Football Dribbling',
    sport: 'Football',
    difficulty: 'intermediate',
    description: 'Tests ball control and dribbling skills',
    metrics: ['Control', 'Speed', 'Accuracy'],
    submissions: 167,
    avgScore: 7.9,
    createdBy: 'Coach Rodriguez',
    createdAt: '2024-01-03',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '6',
    name: 'Boxing Combination',
    sport: 'Boxing',
    difficulty: 'advanced',
    description: 'Evaluates punch combinations and technique',
    metrics: ['Technique', 'Power', 'Speed'],
    submissions: 78,
    avgScore: 8.4,
    createdBy: 'Coach Johnson',
    createdAt: '2024-01-01',
    thumbnail: '/api/placeholder/300/200'
  }
];

const ExerciseLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const sports = ['all', 'Athletics', 'Basketball', 'Football', 'Swimming', 'Boxing', 'General'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === 'all' || exercise.sport === selectedSport;
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSport && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercise Library</h1>
          <p className="text-muted-foreground">Manage and view all available exercises</p>
        </div>
        <Button className="btn-primary">
          <Play className="w-4 h-4 mr-2" />
          Preview Mode
        </Button>
      </div>

      {/* Filters */}
      <Card className="sai-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
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

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : 
                   difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="sai-card hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                <Play className="w-12 h-12 text-muted-foreground" />
              </div>
              <Badge className={`absolute top-2 right-2 ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </Badge>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                    <Badge variant="outline">{exercise.sport}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {exercise.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {exercise.metrics.map((metric, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Submissions</p>
                    <p className="font-medium">{exercise.submissions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Score</p>
                    <p className="font-medium">{exercise.avgScore}/10</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-card-border">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {exercise.createdBy.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{exercise.createdBy}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-error hover:text-error">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="sai-card p-12 text-center">
          <p className="text-muted-foreground">No exercises found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default ExerciseLibrary;