import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const pipeline = [
  { id: 'ATH001', stage: 'Screening', owner: 'Coach A' },
  { id: 'BBL002', stage: 'Interview', owner: 'Coach B' },
  { id: 'FTB004', stage: 'Trials', owner: 'Coach C' }
];

const RecruitmentPipeline: React.FC = () => {
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
                <TableCell>{p.stage}</TableCell>
                <TableCell>{p.owner}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline">Advance</Button>
                    <Button variant="ghost">Assign</Button>
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

export default RecruitmentPipeline;
