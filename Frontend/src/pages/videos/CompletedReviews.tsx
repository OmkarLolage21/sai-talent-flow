import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const completed = [
  { id: 'V010', player: 'Meera Patel', exercise: 'Freestyle 50m', score: 8.9, reviewedOn: '2025-09-18' },
  { id: 'V011', player: 'Rohit Kumar', exercise: 'Sprint', score: 8.2, reviewedOn: '2025-09-19' }
];

const CompletedReviews: React.FC = () => {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {completed.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.player}</TableCell>
                <TableCell>{v.exercise}</TableCell>
                <TableCell>{v.score}</TableCell>
                <TableCell>{v.reviewedOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CompletedReviews;
