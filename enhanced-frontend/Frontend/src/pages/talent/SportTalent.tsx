import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';

const rawData = [
  { name: 'Athletics', value: 120 },
  { name: 'Basketball', value: 75 },
  { name: 'Swimming', value: 58 },
  { name: 'Football', value: 90 }
];

const colors = ['#1e3a8a', '#ea580c', '#16a34a', '#eab308'];

const RADIAL_CENTER = { cx: '50%', cy: '50%' };

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const SportTalent: React.FC = () => {
  const total = useMemo(() => rawData.reduce((s, d) => s + d.value, 0), []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Talent Distribution by Sport</h1>
          <p className="text-muted-foreground">Distribution of registered players across sports</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total players</p>
          <p className="text-xl font-semibold">{total}</p>
        </div>
      </div>

      <Card className="p-4">
        <div style={{ width: '100%', height: 420 }} aria-label="Talent distribution by sport">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={rawData}
                dataKey="value"
                nameKey="name"
                innerRadius={90}
                outerRadius={150}
                paddingAngle={4}
                label={renderCustomizedLabel}
                {...RADIAL_CENTER}
              >
                {rawData.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
              <Legend verticalAlign="bottom" align="center" height={36} formatter={(value: any) => <span className="text-sm">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / details for small screens - also accessible */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {rawData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <div style={{ width: 14, height: 14, backgroundColor: colors[i % colors.length], borderRadius: 4 }} />
              <div>
                <div className="text-sm font-medium">{d.name}</div>
                <div className="text-xs text-muted-foreground">{d.value} ({((d.value / total) * 100).toFixed(0)}%)</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SportTalent;
