import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { MetricsCards } from '@/components/Dashboard/MetricsCards';
import { AnalyticsCharts } from '@/components/Dashboard/AnalyticsCharts';
import { RecentActivity } from '@/components/Dashboard/RecentActivity';
import { Leaderboards } from '@/components/Dashboard/Leaderboards';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Key Metrics */}
        <MetricsCards />
        
        {/* Analytics Charts */}
        <AnalyticsCharts />
        
        {/* Activity and Leaderboards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecentActivity />
          <Leaderboards />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;