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
import { Profile } from '@/pages/profile/profile.tsx';
import { useAuthStore } from '@/store/auth.ts';

import '@/assets/themes/piece-css/index.ts';
import '@/assets/themes/board-css/index.css';
import '@/styles/autofill.css';
import '@/styles/font.css';
import '@/styles/index.css';
import '@/styles/scrollbar.css';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <main>
      <Toaster />
      <Router>
        <Navbar />
        <div className="h-[calc(100vh-3rem)]">
          <Routes>
            {/* Global */}
            <Route path="/documentation" element={<Documentation />} />

            {/* Authentication */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Connected */}
            <Route
              path="/start-analysis"
              element={
                <ProtectedRoute allow={!!user} redirect="/login">
                  <StartAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis/:id"
              element={
                <ProtectedRoute allow={!!user} redirect="/login">
                  <Analysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/theme"
              element={
                <ProtectedRoute allow={!!user} redirect="/login">
                  <Theme />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute allow={!!user} redirect="/login">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allow={!!user} redirect="/login">
                  <Profile />
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
