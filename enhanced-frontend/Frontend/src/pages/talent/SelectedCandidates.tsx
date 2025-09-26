import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button as UIButton } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const SelectedCandidates: React.FC = () => {
  const [query, setQuery] = useState('');
  const { candidates, advanceCandidate, pushNotification } = useAppStore();
  const [viewId, setViewId] = useState<string | null>(null);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Selected Candidates</h1>
          <p className="text-muted-foreground">Manage shortlisted candidates across sports</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search by name or ID" value={query} onChange={e => setQuery(e.target.value)} />
          <Button variant="outline" onClick={() => {
            const csv = 'id,name,sport,score,status\n' + candidates.map(c=>`${c.id},${c.name},${c.sport},${c.score},${c.status}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'candidates.csv'; a.click();
            pushNotification('Exported candidates list','candidate');
          }}>Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player ID</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.sport}</TableCell>
                <TableCell>{c.score}</TableCell>
                <TableCell><Badge>{c.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setViewId(c.id)}>View</Button>
                    <Button variant="outline" onClick={() => { advanceCandidate(c.id); pushNotification(`Advanced ${c.name}`,'candidate'); }}>Advance</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={!!viewId} onOpenChange={(o)=> !o && setViewId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Candidate Detail</DialogTitle></DialogHeader>
          {viewId && (()=>{ const cand = candidates.find(c=>c.id===viewId); if(!cand) return null; return (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {cand.name}</p>
              <p><span className="font-medium">Sport:</span> {cand.sport}</p>
              <p><span className="font-medium">Score:</span> {cand.score}</p>
              <p><span className="font-medium">Status:</span> {cand.status}</p>
            </div>
          ); })()}
          <DialogFooter>
            <UIButton variant="outline" onClick={()=> setViewId(null)}>Close</UIButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectedCandidates;
