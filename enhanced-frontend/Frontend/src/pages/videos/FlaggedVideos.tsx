import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const FlaggedVideos: React.FC = () => {
  const { videosFlagged, reviewFlaggedVideo, unflagVideo, pushNotification } = useAppStore();
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [score, setScore] = useState(8.0);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const { toast } = useToast();
  const reviewing = videosFlagged.find(v => v.id === reviewId);
  const removing = videosFlagged.find(v => v.id === removeId);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Flagged Videos</h1>
      <p className="text-muted-foreground">Videos flagged by reviewers or automated checks</p>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video ID</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Flagged On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videosFlagged.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.player}</TableCell>
                <TableCell>{v.reason}</TableCell>
                <TableCell>{v.flaggedOn}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setScore(8.0); setReviewId(v.id); }}>Review</Button>
                    <Button variant="ghost" onClick={() => setRemoveId(v.id)}>Remove</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!reviewId} onOpenChange={(o)=> !o && setReviewId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Review Flagged Video {reviewId}</DialogTitle></DialogHeader>
          {reviewing && (
            <div className="space-y-4">
              <video controls className="w-full rounded" src={reviewing.videoUrl} />
              <p className="text-sm text-muted-foreground">Reason: {reviewing.reason}</p>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Score</label>
                <Input type="number" min={0} max={10} step={0.1} value={score} onChange={e=> setScore(+e.target.value)} className="w-32" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={()=> setReviewId(null)}>Cancel</Button>
            <Button onClick={()=> { if(!reviewId) return; reviewFlaggedVideo(reviewId, score); pushNotification(`Reviewed flagged video ${reviewId}`,'video'); toast({ title: 'Flagged Video Reviewed', description: `Score: ${score}`}); setReviewId(null); }}>Save Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Flag Dialog */}
      <Dialog open={!!removeId} onOpenChange={(o)=> !o && setRemoveId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove Flag {removeId}</DialogTitle></DialogHeader>
          {removing && (
            <div className="space-y-3 text-sm">
              <p>This will remove the flag and discard the video from flagged list.</p>
              <p className="text-muted-foreground">Reason was: {removing.reason}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={()=> setRemoveId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={()=> { if(!removeId) return; unflagVideo(removeId); pushNotification(`Removed flag from video ${removeId}`,'video'); toast({ title: 'Flag Removed'}); setRemoveId(null); }}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlaggedVideos;
