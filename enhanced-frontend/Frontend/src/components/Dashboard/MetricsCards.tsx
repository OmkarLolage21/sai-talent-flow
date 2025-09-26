import React from 'react';
import { Dumbbell, Trophy, Users, Video, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    timeframe: string;
  };
  gradient?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  gradient = false 
}) => {
  return (
    <div className={`metric-card ${gradient ? 'sai-hero-gradient text-white' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${gradient ? 'bg-white/20' : 'bg-primary/10'}`}>
              <Icon className={`w-6 h-6 ${gradient ? 'text-white' : 'text-primary'}`} />
            </div>
            <h3 className={`font-semibold ${gradient ? 'text-white' : 'text-foreground'}`}>
              {title}
            </h3>
          </div>
          
          <div className="space-y-2">
            <p className={`text-3xl font-bold ${gradient ? 'text-white' : 'text-foreground'}`}>
              {value}
            </p>
            <p className={`text-sm ${gradient ? 'text-white/80' : 'text-muted-foreground'}`}>
              {subtitle}
            </p>
          </div>
        </div>
        
        {trend && (
          <div className={`text-right ${gradient ? 'text-white/90' : 'text-muted-foreground'}`}>
            <div className="flex items-center gap-1 text-sm">
              {trend.direction === 'up' ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error" />
              )}
              <span className={trend.direction === 'up' ? 'text-success' : 'text-error'}>
                {trend.value}
              </span>
            </div>
            <p className="text-xs mt-1">{trend.timeframe}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const MetricsCards: React.FC = () => {
  const metrics = [
    {
      title: 'Total Exercises',
      value: '24',
      subtitle: 'Active exercise types',
      icon: Dumbbell,
      trend: {
        value: '+12%',
        direction: 'up' as const,
        timeframe: 'from last month'
      }
    },
    {
      title: 'Sports Categories',
      value: '8',
      subtitle: 'Athletics, Basketball, Football, Cricket, Swimming, Wrestling, Boxing, Badminton',
      icon: Trophy,
      gradient: true
    },
    {
      title: 'Active Players',
      value: '2,847',
      subtitle: 'Registered athletes',
      icon: Users,
      trend: {
        value: '+18%',
        direction: 'up' as const,
        timeframe: 'this week'
      }
    },
    {
      title: 'Video Submissions Today',
      value: '156',
      subtitle: '89 pending review',
      icon: Video,
      trend: {
        value: '+5%',
        direction: 'up' as const,
        timeframe: 'vs yesterday'
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};