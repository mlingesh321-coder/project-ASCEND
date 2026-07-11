import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Onboarding from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import PillarsPage from './pages/PillarsPage';
import PillarDetail from './pages/PillarDetail';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FeaturesPage from './pages/FeaturesPage';
import TeamPage from './pages/TeamPage';
import FinalAchievement from './pages/FinalAchievement';
import SettingsPage from './pages/SettingsPage';
import MemoPage from './pages/MemoPage';

const SETUP_KEY = 'future-goal-setup-done';

function App() {
  const theme = useStore(s => s.theme);
  const [setupDone, setSetupDone] = useState<boolean>(() => {
    return localStorage.getItem(SETUP_KEY) === 'true';
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem(SETUP_KEY, 'true');
    setSetupDone(true);
  };

  if (!setupDone) {
    return (
      <div className={theme === 'light' ? 'light' : ''}>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className={theme === 'light' ? 'light' : ''} style={{ minHeight: '100vh' }}>
      <BrowserRouter>
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pillars" element={<PillarsPage />} />
            <Route path="/pillars/:id" element={<PillarDetail />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/memo" element={<MemoPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/achievement" element={<FinalAchievement />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
