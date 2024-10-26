import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Navbar } from '@/components/navbar/navbar.tsx';
import { StartAnalysis } from '@/pages/analysis/start-analysis';
import { Home } from '@/pages/home.tsx';
import { Analysis } from '@/pages/analysis/analysis.tsx';
import { Documentation } from '@/pages/documentation.tsx';
import { Register } from '@/pages/register.tsx';
import { Login } from '@/pages/login.tsx';
import { Logout } from '@/pages/logout.tsx';
import { Dashboard } from '@/pages/dashboard.tsx';
import { NotFound } from '@/pages/not-found.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { ReactNode } from 'react';
import { useAnalysisStore } from '@/store/analysis.ts';

import './styles/font.css';
import './styles/index.css';
import '@/styles/scrollbar.css';

function App() {
  const { analysis } = useAnalysisStore();

  return (
    <main>
      <Toaster />
      <Navbar />
      <div className="h-[calc(100vh-4rem)]">
        <Router>
          <Routes>
            {/* Global */}
            <Route path="/" element={<Home />} />
            <Route path="/start-analysis" element={<StartAnalysis />} />
            <Route
              path="/analysis/:id"
              element={
                <ProtectedRoute allow={!!analysis} redirect="/start-analysis">
                  <Analysis />
                </ProtectedRoute>
              }
            />
            <Route path="/documentation" element={<Documentation />} />

            {/* Authentication */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            {/* Connected */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 404 */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
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
