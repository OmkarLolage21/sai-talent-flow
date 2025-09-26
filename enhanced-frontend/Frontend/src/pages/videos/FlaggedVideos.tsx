import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const flagged = [
  { id: 'V020', player: 'Unknown', reason: 'Inappropriate content', flaggedOn: '2025-09-23' }
];

const FlaggedVideos: React.FC = () => {
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
            {flagged.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.player}</TableCell>
                <TableCell>{v.reason}</TableCell>
                <TableCell>{v.flaggedOn}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline">Review</Button>
                    <Button variant="ghost">Remove</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FlaggedVideos;
