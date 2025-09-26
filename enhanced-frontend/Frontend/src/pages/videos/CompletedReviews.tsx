import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useAppStore } from '@/store/appStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CompletedReviews: React.FC = () => {
  const { videosCompleted } = useAppStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const openVideo = videosCompleted.find(v => v.id === openId);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Completed Reviews</h1>
      <p className="text-muted-foreground">Recently reviewed videos and scores</p>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video ID</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Exercise</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Reviewed On</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videosCompleted.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.player}</TableCell>
                <TableCell>{v.exercise}</TableCell>
                <TableCell>{v.score}</TableCell>
                <TableCell>{v.reviewedOn}</TableCell>
                <TableCell><button className="text-primary underline text-sm" onClick={()=> setOpenId(v.id)}>Open</button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!openId} onOpenChange={(o)=> !o && setOpenId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Video {openId}</DialogTitle></DialogHeader>
          {openVideo && (
            <div className="space-y-3">
              <video controls className="w-full rounded" src={openVideo.videoUrl} />
              <p className="text-sm text-muted-foreground">Score: {openVideo.score} | Reviewed On: {openVideo.reviewedOn}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompletedReviews;
