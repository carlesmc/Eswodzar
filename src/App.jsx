import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import EventRegistration from './pages/EventRegistration';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GalleryPage from './pages/GalleryPage';
import BadgeNotification from './components/BadgeNotification';
import AnimatedPage from './components/AnimatedPage';

import { supabase } from './lib/supabase';

// Wrapper to access auth context
const BadgeNotificationWrapper = () => {
  const { user } = useAuth();
  return user ? <BadgeNotification userId={user.id} /> : null;
};

// Component to handle route animations
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
        <Route path="/event/:id" element={<AnimatedPage><EventRegistration /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/signup" element={<AnimatedPage><Signup /></AnimatedPage>} />
        <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
        <Route path="/gallery" element={<AnimatedPage><GalleryPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

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
        <BadgeNotificationWrapper />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
