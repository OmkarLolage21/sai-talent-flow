import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const PendingReviews: React.FC = () => {
  const { videosPending, reviewVideo, flagVideo, pushNotification } = useAppStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flagId, setFlagId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(8.0);
  const [reason, setReason] = useState('Quality issue');
  const { toast } = useToast();

  const activeVideo = videosPending.find(v => v.id === activeId);
  const flagVideoObj = videosPending.find(v => v.id === flagId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Reviews</h1>
      <p className="text-muted-foreground">Videos awaiting review and scoring</p>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video ID</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Exercise</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videosPending.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.player}</TableCell>
                <TableCell>{v.exercise}</TableCell>
                <TableCell>{v.submitted}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button onClick={() => { setScore(8.0); setActiveId(v.id); }}>Review</Button>
                    <Button variant="ghost" onClick={() => { setReason('Quality issue'); setFlagId(v.id); }}>Flag</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!activeId} onOpenChange={(o)=> !o && setActiveId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Review Video {activeId}</DialogTitle></DialogHeader>
          {activeVideo && (
            <div className="space-y-4">
              <video controls className="w-full rounded" src={activeVideo.videoUrl} />
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Score</label>
                <Input type="number" min={0} max={10} step={0.1} value={score} onChange={e=> setScore(+e.target.value)} className="w-32" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={()=> setActiveId(null)}>Cancel</Button>
            <Button onClick={()=> { if(!activeId) return; reviewVideo(activeId, score); pushNotification(`Reviewed video ${activeId}`,'video'); toast({ title: 'Video Reviewed', description: `Score saved: ${score}`}); setActiveId(null); }}>Save Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={!!flagId} onOpenChange={(o)=> !o && setFlagId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Flag Video {flagId}</DialogTitle></DialogHeader>
          {flagVideoObj && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Provide reason for flagging.</p>
              <Input value={reason} onChange={e=> setReason(e.target.value)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={()=> setFlagId(null)}>Cancel</Button>
            <Button onClick={()=> { if(!flagId) return; flagVideo(flagId, reason); pushNotification(`Flagged video ${flagId}`,'video'); toast({ title: 'Video Flagged', description: reason }); setFlagId(null); }}>Flag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingReviews;
