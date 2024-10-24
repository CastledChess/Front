import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/font.css';
import './styles/index.css';

// Global
import Home from './pages/Home';
import Analysis from './pages/Analysis/Analysis.tsx';
import Documentation from './pages/Documentation';
import NotFound from './pages/NotFound';

// Authentication
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';

// Connected
import Dashboard from './pages/Dashboard';
import { Navbar } from './components/Navbar/Navbar.tsx';

function App() {
  return (
    <main>
      <Navbar />
      <div className="h-[calc(100vh-3.5rem)] p-20">
        <Router>
          <Routes>
            {/* Global */}
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/documentation" element={<Documentation />} />

            {/* Authentication */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            {/* Connected */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 404 */}
            {/* Ne fonctionnera pas totalement, il faut adapter la config en fonction d'ou on héberge le site */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </main>
  );
}

export default App;
