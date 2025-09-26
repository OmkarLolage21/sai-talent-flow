import React, { useState } from 'react';
import { 
  BarChart3, 
  Dumbbell, 
  FileText, 
  Users, 
  Trophy, 
  Video, 
  Settings,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigation } from '@/hooks/useNavigation';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { 
    id: 'exercises', 
    label: 'Exercise Management', 
    icon: Dumbbell,
    subItems: [
      { id: 'create-exercise', label: 'Create Dynamic Exercises' },
      { id: 'exercise-library', label: 'Exercise Library' },
      { id: 'exercise-analytics', label: 'Performance Analytics' }
    ]
  },
  { 
    id: 'templates', 
    label: 'Template Management', 
    icon: FileText,
    subItems: [
      { id: 'create-template', label: 'Create New Templates' },
      { id: 'existing-templates', label: 'Existing Templates' },
      { id: 'template-analytics', label: 'Template Analytics' }
    ]
  },
  {
    id: 'players',
    label: 'Players',
    icon: Users,
    subItems: [
      { id: 'all-players', label: 'Manage Players' },
      { id: 'player-analytics', label: 'Player Analytics' }
    ]
  },
  { 
    id: 'talent', 
    label: 'Talent Pool', 
    icon: Trophy,
    subItems: [
      { id: 'selected-candidates', label: 'Selected Candidates' },
      { id: 'recruitment', label: 'Recruitment Pipeline' }
    ]
  },
  { 
    id: 'videos', 
    label: 'Video Reviews', 
    icon: Video,
    subItems: [
      { id: 'pending-reviews', label: 'Pending Reviews' },
      { id: 'completed-reviews', label: 'Completed Reviews' },
      { id: 'flagged-videos', label: 'Flagged Videos' }
    ]
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    subItems: [
      { id: 'system-config', label: 'System Configuration' },
      { id: 'user-management', label: 'User Management' },
      { id: 'export-data', label: 'Export Data' }
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { activeSection, activeSubItem, expandedItems, setActiveSection, toggleExpanded } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemClick = (itemId: string, subItemId?: string) => {
    if (subItemId) {
      setActiveSection(itemId, subItemId);
    } else {
      setActiveSection(itemId);
      if (navigationItems.find(item => item.id === itemId)?.subItems) {
        toggleExpanded(itemId);
      }
    }
  };

  const filteredPlayers = [
    'Priya Sharma - Athletics',
    'Arjun Singh - Basketball', 
    'Meera Patel - Swimming',
    'Rohit Kumar - Football',
    'Sneha Rao - Badminton'
  ].filter(player => 
    player.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 bg-surface border-r border-card-border h-screen overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleItemClick(item.id)}
                className={`sidebar-item w-full text-left ${
                  activeSection === item.id ? 'active' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
                {item.subItems && (
                  <div className="ml-auto">
                    {expandedItems.includes(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
              
              {item.subItems && expandedItems.includes(item.id) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleItemClick(item.id, subItem.id)}
                      className={`sidebar-item w-full text-left text-sm py-2 ${
                        activeSubItem === subItem.id ? 'active' : ''
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Player Search Section */}
        <div className="mt-8 pt-6 border-t border-card-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Quick Player Search
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          
          {searchQuery && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection('players', 'all-players')}
                    className="w-full text-left p-2 text-sm rounded-md hover:bg-surface-hover transition-colors"
                  >
                    {player}
                  </button>
                ))
              ) : (
                <p className="text-muted-foreground text-sm p-2">No players found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};