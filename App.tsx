
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { LanguageProvider } from './components/LanguageContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen bg-[#0f172a] text-gray-100 selection:bg-red-500/30">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Navigate to="/login-page" replace />} />
            <Route path="/login-page" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/register" replace />} />
            {/* Added fallback to redirect correctly to login */}
            <Route path="*" element={<Navigate to="/login-page" replace />} />
          </Routes>
        </div>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
