import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useNavigation } from '@/hooks/useNavigation';

// Import available page components
import Dashboard from '@/pages/Dashboard';
import CreateExercise from '@/pages/exercises/CreateExercise';
import ExerciseLibrary from '@/pages/exercises/ExerciseLibrary';
import ExerciseAnalytics from '@/pages/exercises/ExerciseAnalytics';
import CreateTemplate from '@/pages/templates/CreateTemplate';
import ExistingTemplates from '@/pages/templates/ExistingTemplates';
import TemplateAnalytics from '@/pages/templates/TemplateAnalytics';
import AllPlayers from '@/pages/players/AllPlayers';
import SearchPlayers from '@/pages/players/SearchPlayers';
import PlayerAnalytics from '@/pages/players/PlayerAnalytics';
import PlaceholderPage from '@/components/PlaceholderPage';

const DashboardLayout: React.FC = () => {
  const { activeSection, activeSubItem } = useNavigation();

  const renderContent = () => {
    // Main sections
    if (activeSection === 'dashboard') return <Dashboard />;
    
    // Exercise Management
    if (activeSection === 'exercises') {
      if (activeSubItem === 'create-exercise') return <CreateExercise />;
      if (activeSubItem === 'exercise-library') return <ExerciseLibrary />;
      if (activeSubItem === 'exercise-analytics') return <ExerciseAnalytics />;
      return <ExerciseLibrary />; // Default
    }
    
    // Template Management
    if (activeSection === 'templates') {
      if (activeSubItem === 'create-template') return <CreateTemplate />;
      if (activeSubItem === 'existing-templates') return <ExistingTemplates />;
      if (activeSubItem === 'template-analytics') return <TemplateAnalytics />;
      return <ExistingTemplates />; // Default
    }
    
    // Player Profiles
    if (activeSection === 'players') {
      if (activeSubItem === 'all-players') return <AllPlayers />;
      if (activeSubItem === 'search-players') return <SearchPlayers />;
      if (activeSubItem === 'player-analytics') return <PlayerAnalytics />;
      return <AllPlayers />; // Default
    }
    
    // Talent Pool
    if (activeSection === 'talent') {
      if (activeSubItem === 'selected-candidates') return <PlaceholderPage title="Selected Candidates" />;
      if (activeSubItem === 'sport-talent') return <PlaceholderPage title="Sport-wise Talent" />;
      if (activeSubItem === 'recruitment') return <PlaceholderPage title="Recruitment Pipeline" />;
      return <PlaceholderPage title="Talent Pool" />;
    }
    
    // Video Reviews
    if (activeSection === 'videos') {
      if (activeSubItem === 'pending-reviews') return <PlaceholderPage title="Pending Reviews" />;
      if (activeSubItem === 'completed-reviews') return <PlaceholderPage title="Completed Reviews" />;
      if (activeSubItem === 'flagged-videos') return <PlaceholderPage title="Flagged Videos" />;
      return <PlaceholderPage title="Video Reviews" />;
    }
    
    // Settings
    if (activeSection === 'settings') {
      if (activeSubItem === 'system-config') return <PlaceholderPage title="System Configuration" />;
      if (activeSubItem === 'user-management') return <PlaceholderPage title="User Management" />;
      if (activeSubItem === 'export-data') return <PlaceholderPage title="Export Data" />;
      return <PlaceholderPage title="Settings" />;
    }
    
    return <Dashboard />; // Fallback
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;