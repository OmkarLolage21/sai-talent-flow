import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const sampleCandidates = [
  { id: 'ATH001', name: 'Priya Sharma', sport: 'Athletics', score: 9.1, status: 'Shortlisted' },
  { id: 'BBL002', name: 'Arjun Singh', sport: 'Basketball', score: 8.8, status: 'Interview' },
  { id: 'BDM005', name: 'Sneha Rao', sport: 'Badminton', score: 8.5, status: 'Shortlisted' }
];

const SelectedCandidates: React.FC = () => {
  const [query, setQuery] = useState('');

  const filtered = sampleCandidates.filter(c =>
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
          <Button variant="outline">Export</Button>
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
                    <Button variant="ghost">View</Button>
                    <Button variant="outline">Advance</Button>
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

export default SelectedCandidates;
