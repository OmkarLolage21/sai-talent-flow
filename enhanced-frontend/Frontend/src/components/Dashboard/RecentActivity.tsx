import React from 'react';
import { Clock, User, Trophy, MessageCircle, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ActivityItem {
  id: string;
  type: 'submission' | 'achievement' | 'comment' | 'review';
  user: string;
  action: string;
  time: string;
  sport?: string;
  score?: number;
}

const ActivityIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons = {
    submission: User,
    achievement: Trophy,
    comment: MessageCircle,
    review: Star
  };
  
  const Icon = icons[type as keyof typeof icons] || User;
  
  const colors = {
    submission: 'text-primary',
    achievement: 'text-secondary',
    comment: 'text-blue-600',
    review: 'text-yellow-600'
  };
  
  return <Icon className={`w-4 h-4 ${colors[type as keyof typeof colors]}`} />;
};

export const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'submission',
      user: 'Priya Sharma',
      action: 'submitted vertical jump exercise',
      time: '2 minutes ago',
      sport: 'Athletics',
      score: 8.7
    },
    {
      id: '2',
      type: 'achievement',
      user: 'Arjun Singh',
      action: 'achieved personal best in shuttle run',
      time: '15 minutes ago',
      sport: 'Basketball',
      score: 9.2
    },
    {
      id: '3',
      type: 'comment',
      user: 'Coach Rajesh',
      action: 'commented on Meera Patel\'s swimming technique',
      time: '32 minutes ago',
      sport: 'Swimming'
    },
    {
      id: '4',
      type: 'review',
      user: 'Dr. Sunita',
      action: 'reviewed and approved 5 video submissions',
      time: '1 hour ago'
    },
    {
      id: '5',
      type: 'submission',
      user: 'Rohit Kumar',
      action: 'completed endurance run assessment',
      time: '1 hour ago',
      sport: 'Football',
      score: 7.8
    },
    {
      id: '6',
      type: 'achievement',
      user: 'Sneha Rao',
      action: 'selected for national badminton camp',
      time: '2 hours ago',
      sport: 'Badminton'
    }
  ];

  return (
    <div className="sai-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {activity.user.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ActivityIcon type={activity.type} />
                <span className="font-medium text-sm">{activity.user}</span>
                {activity.sport && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {activity.sport}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-1">
                {activity.action}
                {activity.score && (
                  <span className="ml-2 font-medium text-foreground">
                    Score: {activity.score}/10
                  </span>
                )}
              </p>
              
              <p className="text-xs text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};