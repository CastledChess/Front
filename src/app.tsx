import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Navbar } from '@/components/navbar/navbar.tsx';
import { StartAnalysis } from '@/pages/analysis/start-analysis';
import { Home } from '@/pages/home.tsx';
import { AnalysisContextProvider } from '@/contexts/analysisContext.tsx';
import { Analysis } from '@/pages/analysis/analysis.tsx';
import { Documentation } from '@/pages/documentation.tsx';
import { Register } from '@/pages/register.tsx';
import { Login } from '@/pages/login.tsx';
import { Logout } from '@/pages/logout.tsx';
import { Dashboard } from '@/pages/dashboard.tsx';
import { NotFound } from '@/pages/not-found.tsx';

import './styles/font.css';
import './styles/index.css';

function App() {
  return (
    <main>
      <Navbar />
      <div className="h-[calc(100vh-3.5rem)] p-20">
        <Router>
          <Routes>
            {/* Global */}
            <Route path="/" element={<Home />} />
            <Route path="start-analysis" element={<StartAnalysis />} />
            <Route
              path="/analysis"
              element={
                <AnalysisContextProvider>
                  <Analysis />
                </AnalysisContextProvider>
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

export default App;
