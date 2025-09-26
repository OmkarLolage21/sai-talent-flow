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
import PlayerAnalytics from '@/pages/players/PlayerAnalytics';
import AthleteProfile from '@/pages/players/AthleteProfile';
import PlaceholderPage from '@/components/PlaceholderPage';
import SelectedCandidates from '@/pages/talent/SelectedCandidates';
import RecruitmentPipeline from '@/pages/talent/RecruitmentPipeline';
import PendingReviews from '@/pages/videos/PendingReviews';
import CompletedReviews from '@/pages/videos/CompletedReviews';
import FlaggedVideos from '@/pages/videos/FlaggedVideos';

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
      if (activeSubItem === 'athlete-profile') return <AthleteProfile athleteId={undefined} />;
      if (activeSubItem === 'player-analytics') return <PlayerAnalytics />;
      return <AllPlayers />; // Default
    }
    
    // Talent Pool
    if (activeSection === 'talent') {
      if (activeSubItem === 'selected-candidates') return <SelectedCandidates />;
      if (activeSubItem === 'recruitment') return <RecruitmentPipeline />;
      return <SelectedCandidates />;
    }
    
    // Video Reviews
    if (activeSection === 'videos') {
      if (activeSubItem === 'pending-reviews') return <PendingReviews />;
      if (activeSubItem === 'completed-reviews') return <CompletedReviews />;
      if (activeSubItem === 'flagged-videos') return <FlaggedVideos />;
      return <PendingReviews />;
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