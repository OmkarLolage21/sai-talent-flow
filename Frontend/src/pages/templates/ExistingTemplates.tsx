import React, { useState } from 'react';
import { Search, Filter, Play, Edit, Trash2, Copy, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Template {
  id: string;
  name: string;
  type: 'assessment' | 'training' | 'skills' | 'fitness';
  sport: string;
  exercises: number;
  duration: number;
  assignments: number;
  avgScore: number;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Basketball Assessment Battery',
    type: 'assessment',
    sport: 'Basketball',
    exercises: 6,
    duration: 45,
    assignments: 89,
    avgScore: 8.2,
    createdBy: 'Coach Patel',
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'Football Skills Evaluation',
    type: 'skills',
    sport: 'Football',
    exercises: 8,
    duration: 60,
    assignments: 124,
    avgScore: 7.9,
    createdBy: 'Coach Rodriguez',
    createdAt: '2024-01-10',
    isActive: true
  },
  {
    id: '3',
    name: 'General Fitness Test',
    type: 'fitness',
    sport: 'General',
    exercises: 5,
    duration: 30,
    assignments: 267,
    avgScore: 7.6,
    createdBy: 'Dr. Singh',
    createdAt: '2024-01-08',
    isActive: true
  },
  {
    id: '4',
    name: 'Swimming Technique Program',
    type: 'training',
    sport: 'Swimming',
    exercises: 4,
    duration: 40,
    assignments: 56,
    avgScore: 8.7,
    createdBy: 'Coach Sharma',
    createdAt: '2024-01-05',
    isActive: false
  },
  {
    id: '5',
    name: 'Athletics Sprint Assessment',
    type: 'assessment',
    sport: 'Athletics',
    exercises: 7,
    duration: 35,
    assignments: 178,
    avgScore: 8.0,
    createdBy: 'Coach Kumar',
    createdAt: '2024-01-03',
    isActive: true
  }
];

const ExistingTemplates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const types = ['all', 'assessment', 'training', 'skills', 'fitness'];
  const sports = ['all', 'General', 'Basketball', 'Football', 'Swimming', 'Athletics'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesSport = selectedSport === 'all' || template.sport === selectedSport;
    return matchesSearch && matchesType && matchesSport;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'bg-primary/10 text-primary';
      case 'training': return 'bg-secondary/10 text-secondary';
      case 'skills': return 'bg-success/10 text-success';
      case 'fitness': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Existing Templates</h1>
          <p className="text-muted-foreground">Manage and monitor your template library</p>
        </div>
        <Button className="btn-primary">
          Create New Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="sai-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {types.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="sai-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getTypeColor(template.type)}>
                        {template.type}
                      </Badge>
                      <Badge variant="outline">{template.sport}</Badge>
                      {!template.isActive && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Exercises</p>
                    <p className="font-medium">{template.exercises}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{template.duration} min</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assignments</p>
                    <p className="font-medium">{template.assignments}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Score</p>
                    <p className="font-medium">{template.avgScore}/10</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-card-border">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {template.createdBy.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{template.createdBy}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" title="Assign to Athletes">
                      <Users className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" title="Preview">
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" title="Duplicate">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" title="Edit">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-error hover:text-error" title="Delete">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="sai-card p-12 text-center">
          <p className="text-muted-foreground">No templates found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default ExistingTemplates;