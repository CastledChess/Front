import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css';
import './styles/font.css';
import './styles/index.css';
import './styles/output.css';
import './styles/input.css';

// Global
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Documentation from './pages/Documentation';
import NotFound from './pages/NotFound';

// Authentication
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';

// Connected
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
