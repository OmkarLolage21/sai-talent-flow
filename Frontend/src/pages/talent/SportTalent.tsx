import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Athletics', value: 120 },
  { name: 'Basketball', value: 75 },
  { name: 'Swimming', value: 58 },
  { name: 'Football', value: 90 }
];

const colors = ['#1e3a8a', '#ea580c', '#16a34a', '#eab308'];

const SportTalent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sport-wise Talent</h1>
      <p className="text-muted-foreground">Distribution of registered players across sports</p>

      <Card className="p-4">
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={4}>
                {data.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default SportTalent;
