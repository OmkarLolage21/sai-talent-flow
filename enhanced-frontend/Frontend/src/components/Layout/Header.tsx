import React from 'react';
import { Bell, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sai-card m-4 mb-0 p-4 sai-hero-gradient">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center shadow-md">
            <span className="text-sai-blue font-bold text-xl">SAI</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Officials Dashboard</h1>
            <p className="text-white/80 text-sm">Sports Authority of India</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{currentDate}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-secondary w-5 h-5 rounded-full text-xs flex items-center justify-center">
              8
            </span>
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="hidden md:block">Admin</span>
          </Button>
        </div>
      </div>
    </header>
  );
};