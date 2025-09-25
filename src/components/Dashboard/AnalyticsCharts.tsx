import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, MapPin } from 'lucide-react';

const submissionData = [
  { day: 'Mon', submissions: 45 },
  { day: 'Tue', submissions: 52 },
  { day: 'Wed', submissions: 38 },
  { day: 'Thu', submissions: 61 },
  { day: 'Fri', submissions: 74 },
  { day: 'Sat', submissions: 89 },
  { day: 'Sun', submissions: 67 }
];

const sportDistribution = [
  { name: 'Athletics', value: 35, color: '#1e3a8a' },
  { name: 'Basketball', value: 18, color: '#ea580c' },
  { name: 'Football', value: 22, color: '#16a34a' },
  { name: 'Cricket', value: 15, color: '#eab308' },
  { name: 'Swimming', value: 10, color: '#dc2626' }
];

const exercisePerformance = [
  { exercise: 'Vertical Jump', avgScore: 7.8 },
  { exercise: 'Shuttle Run', avgScore: 8.2 },
  { exercise: 'Sit-ups', avgScore: 7.9 },
  { exercise: 'Push-ups', avgScore: 8.5 },
  { exercise: 'Sprint', avgScore: 8.1 },
  { exercise: 'Endurance', avgScore: 7.6 }
];

const stateData = [
  { state: 'Maharashtra', players: 425 },
  { state: 'Punjab', players: 381 },
  { state: 'Kerala', players: 298 },
  { state: 'Gujarat', players: 267 },
  { state: 'Karnataka', players: 245 }
];

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Submission Trends */}
      <div className="sai-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Weekly Submission Trends</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={submissionData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))' 
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="submissions" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--secondary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sport Distribution */}
      <div className="sai-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Player Distribution by Sport</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sportDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {sportDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))' 
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-4">
          {sportDistribution.map((sport, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: sport.color }}
              />
              <span className="text-sm">{sport.name} ({sport.value}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Performance */}
      <div className="sai-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Exercise Performance Averages</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={exercisePerformance} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis type="number" domain={[0, 10]} />
            <YAxis dataKey="exercise" type="category" width={80} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))' 
              }} 
            />
            <Bar 
              dataKey="avgScore" 
              fill="hsl(var(--secondary))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Participation */}
      <div className="sai-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Top States by Player Count</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))' 
              }} 
            />
            <Bar 
              dataKey="players" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};