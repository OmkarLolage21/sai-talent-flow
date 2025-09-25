import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Users, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const templateUsageData = [
  { template: 'Basketball Assessment', assignments: 89, completion: 82, avgScore: 8.2 },
  { template: 'Football Skills', assignments: 124, completion: 91, avgScore: 7.9 },
  { template: 'General Fitness', assignments: 267, completion: 95, avgScore: 7.6 },
  { template: 'Swimming Program', assignments: 56, completion: 73, avgScore: 8.7 },
  { template: 'Athletics Sprint', assignments: 178, completion: 88, avgScore: 8.0 }
];

const typeDistribution = [
  { name: 'Assessment', value: 45, color: '#1e3a8a' },
  { name: 'Training', value: 25, color: '#ea580c' },
  { name: 'Skills', value: 20, color: '#16a34a' },
  { name: 'Fitness', value: 10, color: '#eab308' }
];

const TemplateAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Template Analytics</h1>
        <p className="text-muted-foreground">Track template usage and effectiveness</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">15</p>
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
                <p className="text-sm text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold">714</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">86%</p>
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
                <p className="text-sm text-muted-foreground">Avg Effectiveness</p>
                <p className="text-2xl font-bold">8.1/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="sai-card">
          <CardHeader>
            <CardTitle>Template Usage Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={templateUsageData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="template" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assignments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="sai-card">
          <CardHeader>
            <CardTitle>Template Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-4">
              {typeDistribution.map((type, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm">{type.name} ({type.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card className="sai-card">
        <CardHeader>
          <CardTitle>Template Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-3 px-4 font-medium">Template</th>
                  <th className="text-left py-3 px-4 font-medium">Assignments</th>
                  <th className="text-left py-3 px-4 font-medium">Completion</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Score</th>
                  <th className="text-left py-3 px-4 font-medium">Effectiveness</th>
                </tr>
              </thead>
              <tbody>
                {templateUsageData.map((template, index) => (
                  <tr key={index} className="border-b border-card-border hover:bg-surface-hover">
                    <td className="py-3 px-4 font-medium">{template.template}</td>
                    <td className="py-3 px-4">{template.assignments}</td>
                    <td className="py-3 px-4">{template.completion}%</td>
                    <td className="py-3 px-4">{template.avgScore}/10</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        template.completion >= 85 && template.avgScore >= 8.0
                          ? 'bg-success/10 text-success' 
                          : template.completion >= 75 && template.avgScore >= 7.5
                          ? 'bg-warning/10 text-warning'
                          : 'bg-error/10 text-error'
                      }`}>
                        {template.completion >= 85 && template.avgScore >= 8.0 ? 'Excellent' : 
                         template.completion >= 75 && template.avgScore >= 7.5 ? 'Good' : 'Needs Improvement'}
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

export default TemplateAnalytics;