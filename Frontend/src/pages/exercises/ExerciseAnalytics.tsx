import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const performanceData = [
  { exercise: 'Vertical Jump', submissions: 245, avgScore: 7.8, improvement: 12 },
  { exercise: 'Shuttle Run', submissions: 189, avgScore: 8.2, improvement: 8 },
  { exercise: 'Push-ups', submissions: 312, avgScore: 7.5, improvement: 15 },
  { exercise: 'Swimming', submissions: 98, avgScore: 8.7, improvement: 5 },
  { exercise: 'Football Skills', submissions: 167, avgScore: 7.9, improvement: 18 },
  { exercise: 'Boxing Combo', submissions: 78, avgScore: 8.4, improvement: 22 }
];

const monthlyTrends = [
  { month: 'Jan', submissions: 1250, avgScore: 7.8 },
  { month: 'Feb', submissions: 1380, avgScore: 8.0 },
  { month: 'Mar', submissions: 1520, avgScore: 8.1 },
  { month: 'Apr', submissions: 1450, avgScore: 8.3 },
  { month: 'May', submissions: 1680, avgScore: 8.2 },
  { month: 'Jun', submissions: 1890, avgScore: 8.4 }
];

const ExerciseAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exercise Performance Analytics</h1>
        <p className="text-muted-foreground">Track exercise effectiveness and athlete progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Exercises</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">1,289</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Award className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">8.1/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className="text-2xl font-bold">+14%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="sai-card">
          <CardHeader>
            <CardTitle>Exercise Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="exercise" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="sai-card">
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Performance Table */}
      <Card className="sai-card">
        <CardHeader>
          <CardTitle>Detailed Exercise Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-3 px-4 font-medium">Exercise</th>
                  <th className="text-left py-3 px-4 font-medium">Submissions</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Score</th>
                  <th className="text-left py-3 px-4 font-medium">Improvement</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((exercise, index) => (
                  <tr key={index} className="border-b border-card-border hover:bg-surface-hover">
                    <td className="py-3 px-4 font-medium">{exercise.exercise}</td>
                    <td className="py-3 px-4">{exercise.submissions}</td>
                    <td className="py-3 px-4">{exercise.avgScore}/10</td>
                    <td className="py-3 px-4 text-success">+{exercise.improvement}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        exercise.avgScore >= 8.0 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {exercise.avgScore >= 8.0 ? 'Excellent' : 'Good'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseAnalytics;