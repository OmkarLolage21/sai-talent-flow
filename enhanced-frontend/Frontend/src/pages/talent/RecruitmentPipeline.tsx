import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const RecruitmentPipeline: React.FC = () => {
  const { pipeline, advancePipelineStage, assignCandidateOwner, pushNotification } = useAppStore();
  const [assignId, setAssignId] = React.useState<string | null>(null);
  const [owner, setOwner] = React.useState('');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recruitment Pipeline</h1>
      <p className="text-muted-foreground">View and progress candidates through the recruitment stages</p>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player ID</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipeline.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{p.owner || '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { advancePipelineStage(p.id); pushNotification(`Advanced pipeline stage for ${p.id}`,'candidate'); }}>Advance</Button>
                    <Button variant="ghost" onClick={() => { setAssignId(p.id); setOwner(p.owner || ''); }}>Assign</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={!!assignId} onOpenChange={(o)=> !o && setAssignId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Owner</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Owner name" value={owner} onChange={e=> setOwner(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=> setAssignId(null)}>Cancel</Button>
            <Button onClick={()=> { if(!assignId) return; assignCandidateOwner(assignId, owner); pushNotification(`Assigned ${owner} to ${assignId}`,'candidate'); setAssignId(null); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruitmentPipeline;
