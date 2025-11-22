import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import EventRegistration from './pages/EventRegistration';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GalleryPage from './pages/GalleryPage';

import { supabase } from './lib/supabase';

function App() {
  const isSupabaseConfigured = !!supabase;

  return (
    <AuthProvider>
      <Router>
        {!isSupabaseConfigured && (
          <div className="bg-red-600 text-white text-center p-4 font-bold sticky top-0 z-[100]">
            ERROR CRÍTICO: Supabase no está configurado. Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
          </div>
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/event/:id" element={<EventRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
