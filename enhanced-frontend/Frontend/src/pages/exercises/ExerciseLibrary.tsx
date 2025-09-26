import React, { useState } from 'react';
import { Search, Filter, Play, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// removed comingSoon usage; fully functional dialogs implemented
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { useAppStore } from '@/store/appStore';
import ExerciseVideoPreview from '@/components/ExerciseVideoPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ExerciseLibrary: React.FC = () => {
  const { exercises, updateExercise, deleteExercise, pushNotification } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const editing = exercises.find(e => e.id === editId) || null;
  const viewing = exercises.find(e => e.id === viewId) || null;

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
        <Button className="btn-primary" onClick={() => setViewId(exercises[0]?.id || null)}>
          <Play className="w-4 h-4 mr-2" />
          Quick Preview
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

          <Button variant="outline" size="sm" onClick={() => toast({ title: 'Filters', description: 'All filters are already visible.' })}>
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
              <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                <ExerciseVideoPreview src={exercise.videoUrl} poster={exercise.posterUrl} />
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
                    <Button variant="outline" size="sm" onClick={() => setViewId(exercise.id)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditId(exercise.id)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-error hover:text-error" onClick={() => setDeleteId(exercise.id)}>
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

      {/* View Dialog */}
      <Dialog open={!!viewId} onOpenChange={(o)=> !o && setViewId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Exercise Detail</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <video controls className="w-full rounded" src={viewing.videoUrl} poster={viewing.posterUrl} />
              <h3 className="text-xl font-semibold">{viewing.name}</h3>
              <p className="text-sm text-muted-foreground">{viewing.description}</p>
              <div className="flex flex-wrap gap-2">
                {viewing.metrics.map(m => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}
              </div>
              <p className="text-xs text-muted-foreground">Created by {viewing.createdBy} on {viewing.createdAt}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={()=> setViewId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editId} onOpenChange={(o)=> !o && setEditId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Exercise</DialogTitle></DialogHeader>
          {editing && (
            <form className="space-y-4" onSubmit={e=> { e.preventDefault(); const form = new FormData(e.currentTarget); updateExercise(editing.id,{ name: form.get('name') as string, description: form.get('description') as string }); pushNotification(`Edited exercise '${form.get('name')}'`,'exercise'); toast({ title: 'Exercise Updated'}); setEditId(null); }}>
              <Input name="name" defaultValue={editing.name} />
              <Textarea name="description" defaultValue={editing.description} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={()=> setEditId(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o)=> !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Exercise</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={()=> setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={()=> { if(!deleteId) return; deleteExercise(deleteId); pushNotification('Deleted exercise','exercise'); toast({ title: 'Exercise Deleted'}); setDeleteId(null); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExerciseLibrary;