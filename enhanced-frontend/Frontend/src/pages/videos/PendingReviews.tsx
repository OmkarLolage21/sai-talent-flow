import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const pending = [
  { id: 'V001', player: 'Priya Sharma', exercise: 'Vertical Jump', submitted: '2025-09-20' },
  { id: 'V002', player: 'Arjun Singh', exercise: 'Sprint', submitted: '2025-09-22' }
];

const PendingReviews: React.FC = () => {
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
            {pending.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.player}</TableCell>
                <TableCell>{v.exercise}</TableCell>
                <TableCell>{v.submitted}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button>Review</Button>
                    <Button variant="ghost">Flag</Button>
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

export default PendingReviews;
