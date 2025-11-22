import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Courtroom from './pages/Courtroom';
import LoginPage from './pages/LoginPage';

import StudentDashboard from './pages/StudentDashboard';
import JudgeDashboard from './pages/JudgeDashboard';
import LearningModule from './pages/LearningModule';
import Leaderboard from './pages/Leaderboard';
import CaseLibrary from './pages/CaseLibrary';
import SessionRecordings from './pages/SessionRecordings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/judge-dashboard" element={<JudgeDashboard />} />
        <Route path="/learning/:moduleId" element={<LearningModule />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/case-library" element={<CaseLibrary />} />
        <Route path="/recordings" element={<SessionRecordings />} />
        <Route path="/courtroom/:caseId" element={<Courtroom />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
