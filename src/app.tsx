import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

import { Navbar } from '@/components/navbar/navbar.tsx';
import { StartAnalysis } from '@/pages/analysis/start-analysis';
import { AnalysisPage } from '@/pages/analysis/analysis.tsx';
import { Documentation } from '@/pages/documentation.tsx';
import { Register } from '@/pages/register/register.tsx';
import { Dashboard } from '@/pages/dashboard/dashboard.tsx';
import { NotFound } from '@/pages/not-found.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { Login } from '@/pages/login/login.tsx';
import { Theme } from '@/pages/theme/theme.tsx';
import { useAuthStore } from '@/store/auth.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/assets/themes/piece-css/index.ts';
import '@/assets/themes/board-css/index.css';
import '@/styles/autofill.css';
import '@/styles/font.css';
import '@/styles/index.css';
import '@/styles/scrollbar.css';
import { useAnalysisStore } from '@/store/analysis.ts';

const queryClient = new QueryClient();

function App() {
  const analysis = useAnalysisStore((state) => state.analysis);
  const user = useAuthStore((state) => state.user);

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Router>
          <Navbar />
          <div className="h-[calc(100vh-4rem)]">
            <Routes>
              {/* Global */}
              <Route path="/start-analysis" element={<StartAnalysis />} />
              <Route
                path="/analysis/"
                element={
                  <ProtectedRoute allow={!!analysis} redirect={'/start-analysis'}>
                    <AnalysisPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/analysis/:id" element={<AnalysisPage />} />
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

              {/* 404 */}
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
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
