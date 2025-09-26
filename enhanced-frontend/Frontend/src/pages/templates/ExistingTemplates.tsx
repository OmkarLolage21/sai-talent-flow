import React, { useState } from 'react';
import { Search, Filter, Play, Edit, Trash2, Copy, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const typeOptions = ['assessment','training','skills','fitness'];
const sportOptions = ['General','Basketball','Football','Swimming','Athletics'];

const ExistingTemplates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'assessment', sport: 'General', exercises: 1, duration: 10, description: '' });
  const [assignCount, setAssignCount] = useState(10);
  const { templates, deleteTemplate, duplicateTemplate, updateTemplate, assignTemplate, addTemplate, pushNotification } = useAppStore();
  const { toast } = useToast();

  const types = ['all', 'assessment', 'training', 'skills', 'fitness'];
  const sports = ['all', ...sportOptions];

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
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">Create New Template</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              <Select value={form.type} onValueChange={v=>setForm({...form,type:v})}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>{typeOptions.map(t=> <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.sport} onValueChange={v=>setForm({...form,sport:v})}>
                <SelectTrigger><SelectValue placeholder="Sport" /></SelectTrigger>
                <SelectContent>{sportOptions.map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input type="number" min={1} value={form.exercises} onChange={e=>setForm({...form,exercises:+e.target.value})} placeholder="Exercises" />
                <Input type="number" min={1} value={form.duration} onChange={e=>setForm({...form,duration:+e.target.value})} placeholder="Duration (min)" />
              </div>
              <Textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={()=>setCreateOpen(false)}>Cancel</Button>
              <Button onClick={()=>{ if(!form.name){toast({title:'Name required'});return;} addTemplate({ ...form, createdBy: 'Admin User' }); setForm({ name:'', type:'assessment', sport:'General', exercises:1, duration:10, description:''}); setCreateOpen(false); pushNotification(`Template '${form.name}' created`,'template'); }}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

          <Button variant="outline" size="sm" onClick={() => toast({ title: 'Filters', description: 'Extend filters as needed.' })}>
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
                    <Button variant="outline" size="sm" title="Assign" onClick={()=>{ setAssignId(template.id); setAssignCount(10); }}>
                      <Users className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" title="Preview" onClick={()=> setPreviewId(template.id)}>
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" title="Duplicate" onClick={()=>{ duplicateTemplate(template.id); pushNotification(`Duplicated '${template.name}'`,'template'); }}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" title="Edit" onClick={()=>{ setEditingId(template.id); setForm({ name: template.name, type: template.type, sport: template.sport, exercises: template.exercises, duration: template.duration, description: template.description || '' }); }}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-error hover:text-error" title="Delete" onClick={()=>{ if(confirm('Delete template?')) { deleteTemplate(template.id); pushNotification(`Deleted '${template.name}'`,'template'); } }}>
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
      {/* Preview Dialog */}
      <Dialog open={!!previewId} onOpenChange={(o)=>!o && setPreviewId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Template Preview</DialogTitle></DialogHeader>
          {previewId && (()=>{ const t = templates.find(tp=>tp.id===previewId)!; return (
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {t.name}</p>
              <p><strong>Type:</strong> {t.type}</p>
              <p><strong>Sport:</strong> {t.sport}</p>
              <p><strong>Exercises:</strong> {t.exercises}</p>
              <p><strong>Duration:</strong> {t.duration} min</p>
              <p><strong>Assignments:</strong> {t.assignments}</p>
              {t.description && <p className="text-muted-foreground">{t.description}</p>}
            </div>
          ); })()}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={(o)=>!o && setEditingId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Template</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <Select value={form.type} onValueChange={v=>setForm({...form,type:v})}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>{typeOptions.map(t=> <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={form.sport} onValueChange={v=>setForm({...form,sport:v})}>
              <SelectTrigger><SelectValue placeholder="Sport" /></SelectTrigger>
              <SelectContent>{sportOptions.map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input type="number" min={1} value={form.exercises} onChange={e=>setForm({...form,exercises:+e.target.value})} />
              <Input type="number" min={1} value={form.duration} onChange={e=>setForm({...form,duration:+e.target.value})} />
            </div>
            <Textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={()=>setEditingId(null)}>Cancel</Button>
            <Button onClick={()=>{ if(!editingId) return; updateTemplate(editingId,{ name: form.name, type: form.type as any, sport: form.sport, exercises: form.exercises, duration: form.duration, description: form.description }); pushNotification(`Updated '${form.name}'`,'template'); setEditingId(null); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={!!assignId} onOpenChange={(o)=>!o && setAssignId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Template</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Increase assignment count (demo only).</p>
            <Input type="number" min={1} value={assignCount} onChange={e=> setAssignCount(+e.target.value)} />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={()=>setAssignId(null)}>Cancel</Button>
            <Button onClick={()=>{ if(!assignId) return; assignTemplate(assignId, assignCount); pushNotification('Template assigned', 'template'); setAssignId(null); }}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExistingTemplates;