import React, { useState } from 'react';
import { Plus, X, Save, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Exercise {
  id: string;
  name: string;
  duration: number;
  order: number;
}

interface Template {
  name: string;
  description: string;
  type: string;
  targetSport: string;
  duration: number;
  exercises: Exercise[];
}

const availableExercises = [
  { id: '1', name: 'Vertical Jump Test', defaultDuration: 5 },
  { id: '2', name: 'Shuttle Run 20m', defaultDuration: 10 },
  { id: '3', name: 'Push-up Endurance', defaultDuration: 15 },
  { id: '4', name: 'Swimming Technique', defaultDuration: 20 },
  { id: '5', name: 'Football Dribbling', defaultDuration: 12 },
  { id: '6', name: 'Boxing Combination', defaultDuration: 8 }
];

const CreateTemplate: React.FC = () => {
  const [template, setTemplate] = useState<Template>({
    name: '',
    description: '',
    type: '',
    targetSport: '',
    duration: 0,
    exercises: []
  });

  const addExercise = (exerciseId: string) => {
    const exercise = availableExercises.find(ex => ex.id === exerciseId);
    if (exercise && !template.exercises.find(ex => ex.id === exerciseId)) {
      const newExercise: Exercise = {
        id: exercise.id,
        name: exercise.name,
        duration: exercise.defaultDuration,
        order: template.exercises.length
      };
      
      setTemplate(prev => ({
        ...prev,
        exercises: [...prev.exercises, newExercise],
        duration: prev.duration + exercise.defaultDuration
      }));
    }
  };

  const removeExercise = (exerciseId: string) => {
    const exercise = template.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setTemplate(prev => ({
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
        duration: prev.duration - exercise.duration
      }));
    }
  };

  const updateExerciseDuration = (exerciseId: string, newDuration: number) => {
    setTemplate(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, duration: newDuration } : ex
      ),
      duration: prev.exercises.reduce((total, ex) => 
        total + (ex.id === exerciseId ? newDuration : ex.duration), 0
      )
    }));
  };

  const handleSave = () => {
    console.log('Saving template:', template);
    // Here would be the API call to save the template
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Template</h1>
          <p className="text-muted-foreground">Design training programs and assessment batteries</p>
        </div>
        <Button onClick={handleSave} className="btn-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="sai-card">
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Template Name</label>
                <Input
                  placeholder="e.g., Basketball Assessment Battery"
                  value={template.name}
                  onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe the purpose and goals of this template..."
                  value={template.description}
                  onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Template Type</label>
                  <Select value={template.type} onValueChange={(value) => setTemplate(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assessment">Assessment Battery</SelectItem>
                      <SelectItem value="training">Training Program</SelectItem>
                      <SelectItem value="skills">Skills Test</SelectItem>
                      <SelectItem value="fitness">Fitness Evaluation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Sport</label>
                  <Select value={template.targetSport} onValueChange={(value) => setTemplate(prev => ({ ...prev, targetSport: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="athletics">Athletics</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="boxing">Boxing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Builder */}
          <Card className="sai-card">
            <CardHeader>
              <CardTitle>Exercise Sequence</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total Duration: {template.duration} minutes
              </p>
            </CardHeader>
            <CardContent>
              {template.exercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No exercises added yet.</p>
                  <p className="text-sm">Start by selecting exercises from the library.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {template.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-card-border">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                      
                      <div className="flex-1">
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">Exercise {index + 1}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={exercise.duration}
                          onChange={(e) => updateExerciseDuration(exercise.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                          min="1"
                        />
                        <span className="text-sm text-muted-foreground">min</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExercise(exercise.id)}
                        className="text-error hover:text-error"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Exercise Library */}
        <div className="space-y-6">
          <Card className="sai-card">
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <p className="text-sm text-muted-foreground">
                Drag exercises to add them to your template
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableExercises.map((exercise) => {
                  const isAdded = template.exercises.find(ex => ex.id === exercise.id);
                  return (
                    <div
                      key={exercise.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isAdded 
                          ? 'bg-muted border-muted text-muted-foreground cursor-not-allowed' 
                          : 'bg-surface border-card-border hover:bg-surface-hover'
                      }`}
                      onClick={() => !isAdded && addExercise(exercise.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exercise.defaultDuration} min
                          </p>
                        </div>
                        {!isAdded && (
                          <Plus className="w-4 h-4 text-primary" />
                        )}
                        {isAdded && (
                          <Badge variant="secondary" className="text-xs">Added</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplate;