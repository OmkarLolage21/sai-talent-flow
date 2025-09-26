import React, { useState } from 'react';
import { Bell, User, Calendar, Check, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export const Header: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const { notifications, markAllNotificationsRead, pushNotification } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;
  const { toast } = useToast();

  const handleLogout = () => {
    toast({ title: 'Logged out (demo)', description: 'Implement real auth integration.' });
    pushNotification('User logged out','system');
  };

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
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 relative">
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              <div className="p-3 flex items-center justify-between">
                <h4 className="font-semibold text-sm">Notifications</h4>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={markAllNotificationsRead}>Mark all read</Button>
              </div>
              <Separator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="text-xs text-muted-foreground p-3">No notifications yet.</p>
                )}
                {notifications.map(n => (
                  <div key={n.id} className={`px-3 py-2 text-xs flex items-start gap-2 ${!n.read ? 'bg-muted/40' : ''}`}>
                    <span className="mt-0.5"><Bell className="w-3 h-3" /></span>
                    <div>
                      <p className="leading-snug">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="hidden md:block">Admin</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                <p className="text-sm font-medium">Admin User</p>
                <Separator />
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => toast({ title: 'Profile', description: 'Profile dialog not implemented in demo.' })}>
                  <User className="w-4 h-4" /> Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => toast({ title: 'Settings', description: 'Settings page coming later.' })}>
                  <SettingsIcon className="w-4 h-4" /> Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};