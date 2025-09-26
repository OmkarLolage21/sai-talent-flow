import React, { useState, useEffect, useRef } from 'react';
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
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleBrowseClick = () => fileInputRef.current && fileInputRef.current.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f && f.type.startsWith('video/')) setVideoFile(f);
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

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

  useEffect(() => {
    // fetch templates from backend to allow selecting existing template for analysis
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${API_BASE}/templates`);
        if (!res.ok) return;
        const data = await res.json();
        // backend returns { templates: { id: templateObj, ... } }
        const tpl = data.templates || {};
        const items: Array<{ id: string; name: string; description?: string }> = [];
        if (Array.isArray(tpl)) {
          // in case backend returns list
          tpl.forEach((t: any) => items.push({ id: t.id || '', name: t.name || 'Template', description: t.description }));
        } else {
          Object.entries(tpl).forEach(([id, t]: any) => items.push({ id, name: (t as any).name || id, description: (t as any).description }));
        }
        // fallback sample templates if none returned
        const sampleTemplates = [
          { id: 'TEMPLATE-001', name: 'Standard Squat', description: 'Squat reference template' },
          { id: 'TEMPLATE-002', name: 'Push-Up', description: 'Push-up reference' },
          { id: 'TEMPLATE-003', name: 'Vertical Jump', description: 'Jump test' }
        ];
        setTemplates(items.length ? items : sampleTemplates);
      } catch (e) {
        console.warn('Could not fetch templates', e);
        // set fallback sample templates
        setTemplates([
          { id: 'TEMPLATE-001', name: 'Standard Squat', description: 'Squat reference template' },
          { id: 'TEMPLATE-002', name: 'Push-Up', description: 'Push-up reference' },
          { id: 'TEMPLATE-003', name: 'Vertical Jump', description: 'Jump test' }
        ]);
      }
    };

    fetchTemplates();
  }, []);

  const analyzeVideo = async () => {
    if (!videoFile) {
      alert('Please add a reference video first');
      return;
    }
    if (!selectedTemplateId) {
      alert('Please select a template to analyze against');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch(`${API_BASE}/analyze/video/${selectedTemplateId}`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Analysis failed');
      setAnalysisResult(json);
    } catch (err: any) {
      console.error('Analysis error', err);
      alert('Analysis error: ' + (err.message || err));
    } finally {
      setAnalyzing(false);
    }
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
                <div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-2">Select Template to Analyze Against</label>
                    <Select value={selectedTemplateId} onValueChange={(v) => setSelectedTemplateId(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={templates.length ? 'Choose template' : 'No templates available'} />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              
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
                      <Button variant="outline" onClick={handleBrowseClick}>Browse Files</Button>
                  </div>
                )}
              </div>
              
                <div className="mt-4 flex items-center gap-2">
                  <Button onClick={analyzeVideo} disabled={analyzing || !videoFile || !selectedTemplateId}>
                    {analyzing ? 'Analyzing...' : 'Analyze Video'}
                  </Button>
                  <Button variant="ghost" onClick={() => { setAnalysisResult(null); setVideoFile(null); }}>Clear</Button>
                </div>
              </div>
            </CardContent>
          </Card>

            {analysisResult && (
              <Card className="sai-card mt-4">
                <CardHeader>
                  <CardTitle>Analysis Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div><strong>Session:</strong> {analysisResult.session_id}</div>
                    <div><strong>Overall similarity:</strong> {analysisResult.overall_similarity?.toFixed(1)}%</div>
                    <div><strong>Total frames:</strong> {analysisResult.total_frames}</div>
                    <div><strong>Duration (s):</strong> {analysisResult.analysis_duration?.toFixed(1)}</div>
                    <div>
                      <strong>Recommendations:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {(analysisResult.recommendations || []).map((r: string, i: number) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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