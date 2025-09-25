import React, { useState } from 'react';
import { Upload, Play, Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExerciseForm {
  name: string;
  description: string;
  sport: string;
  difficulty: string;
  instructions: string;
  targetMetrics: string[];
  scoringCriteria: string;
}

const CreateExercise: React.FC = () => {
  const [form, setForm] = useState<ExerciseForm>({
    name: '',
    description: '',
    sport: '',
    difficulty: '',
    instructions: '',
    targetMetrics: [],
    scoringCriteria: ''
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const availableMetrics = [
    'Speed', 'Accuracy', 'Form', 'Endurance', 'Strength', 
    'Flexibility', 'Balance', 'Coordination', 'Power', 'Agility'
  ];

  const sports = [
    'Athletics', 'Basketball', 'Football', 'Cricket', 
    'Swimming', 'Wrestling', 'Boxing', 'Badminton'
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('video/')) {
      setVideoFile(files[0]);
    }
  };

  const addMetric = (metric: string) => {
    if (!form.targetMetrics.includes(metric)) {
      setForm(prev => ({
        ...prev,
        targetMetrics: [...prev.targetMetrics, metric]
      }));
    }
  };

  const removeMetric = (metric: string) => {
    setForm(prev => ({
      ...prev,
      targetMetrics: prev.targetMetrics.filter(m => m !== metric)
    }));
  };

  const handleSubmit = () => {
    console.log('Creating exercise:', form, videoFile);
    // Here would be the API call to create the exercise
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Dynamic Exercise</h1>
          <p className="text-muted-foreground">Design new exercises for athlete assessment</p>
        </div>
        <Button onClick={handleSubmit} className="btn-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Exercise
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Details */}
        <Card className="sai-card">
          <CardHeader>
            <CardTitle>Exercise Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Exercise Name</label>
              <Input
                placeholder="e.g., Vertical Jump Test"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Brief description of the exercise..."
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Sport</label>
                <Select value={form.sport} onValueChange={(value) => setForm(prev => ({ ...prev, sport: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map(sport => (
                      <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                <Select value={form.difficulty} onValueChange={(value) => setForm(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Instructions for Athletes</label>
              <Textarea
                placeholder="Step-by-step instructions..."
                value={form.instructions}
                onChange={(e) => setForm(prev => ({ ...prev, instructions: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Scoring Criteria</label>
              <Textarea
                placeholder="How will this exercise be scored?"
                value={form.scoringCriteria}
                onChange={(e) => setForm(prev => ({ ...prev, scoringCriteria: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Video Upload & Metrics */}
        <div className="space-y-6">
          {/* Video Upload */}
          <Card className="sai-card">
            <CardHeader>
              <CardTitle>Reference Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? 'border-primary bg-primary/5' : 'border-card-border'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
              >
                {videoFile ? (
                  <div className="space-y-4">
                    <Play className="w-12 h-12 mx-auto text-primary" />
                    <div>
                      <p className="font-medium">{videoFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVideoFile(null)}
                    >
                      Remove Video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drop your reference video here</p>
                      <p className="text-sm text-muted-foreground">
                        Or click to browse (MP4, MOV, AVI)
                      </p>
                    </div>
                    <Button variant="outline">Browse Files</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Target Metrics */}
          <Card className="sai-card">
            <CardHeader>
              <CardTitle>Performance Metrics to Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {availableMetrics.map(metric => (
                    <Button
                      key={metric}
                      variant="outline"
                      size="sm"
                      onClick={() => addMetric(metric)}
                      disabled={form.targetMetrics.includes(metric)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {metric}
                    </Button>
                  ))}
                </div>

                {form.targetMetrics.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Selected Metrics:</label>
                    <div className="flex flex-wrap gap-2">
                      {form.targetMetrics.map(metric => (
                        <Badge
                          key={metric}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {metric}
                          <button
                            onClick={() => removeMetric(metric)}
                            className="ml-1 hover:text-error"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateExercise;