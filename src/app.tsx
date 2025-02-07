import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

import { Navbar } from '@/components/navbar/navbar.tsx';
import { Analysis } from '@/pages/analysis/analysis.tsx';
import { StartAnalysis } from '@/pages/start-analysis/start-analysis.tsx';
import { Documentation } from '@/pages/documentation.tsx';
import { Register } from '@/pages/register/register.tsx';
import { Dashboard } from '@/pages/dashboard/dashboard.tsx';
import { NotFound } from '@/pages/not-found.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { Login } from '@/pages/login/login.tsx';
import { Theme } from '@/pages/theme/theme.tsx';
import { useAnalysisStore } from '@/store/analysis.ts';
import { Profile } from '@/pages/profile/profile.tsx';
import { useAuthStore } from '@/store/auth.ts';
import { History } from '@/pages/history/history-page';

import '@/assets/themes/piece-css/index.ts';
import '@/assets/themes/board-css/index.css';
import '@/styles/autofill.css';
import '@/styles/font.css';
import '@/styles/index.css';
import '@/styles/scrollbar.css';

function App() {
  const analysis = useAnalysisStore((state) => state.analysis);
  const user = useAuthStore((state) => state.user);

  return (
    <main>
      <Toaster />
      <Router>
        <Navbar />
        <div className="h-[calc(100vh-3rem)]">
          <Routes>
            {/* Global */}
            <Route path="/start-analysis" element={<StartAnalysis />} />
            <Route
              path="/analysis/"
              element={
                <ProtectedRoute allow={!!analysis} redirect={'/start-analysis'}>
                  <Analysis />
                </ProtectedRoute>
              }
            />
            <Route path="/analysis/:id" element={<Analysis />} />
            <Route
              path="/theme"
              element={
                <ProtectedRoute allow={!!user} redirect="/">
                  <Theme />
                </ProtectedRoute>
              }
            />
            <Route path="/documentation" element={<Documentation />} />

            {/* Authentication */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Connected */}
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allow={!!user} redirect="/dashboard">
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allow={!!user} redirect="/login">
                  <History />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </main>
  );
}

const ProtectedRoute = ({ allow, children, redirect }: { allow: boolean; redirect: string; children: ReactNode }) => {
  if (!allow) {
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default App;
