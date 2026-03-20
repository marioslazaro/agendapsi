import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import Agenda from './pages/Agenda';
import AppointmentForm from './pages/AppointmentForm';
import Finances from './pages/Finances';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useAppStore } from './store';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, x: 20 },
  in: { opacity: 1, scale: 1, x: 0 },
  out: { opacity: 0, scale: 1.02, x: -20 }
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30
};

function AnimatedRoutes() {
  const location = useLocation();
  const user = useAppStore(state => state.user);
  
  // Auth Guard: Redireciona para login se nao logado
  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }
  
  // We use AnimatePresence to animate components on unmount
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MotionPage><Dashboard /></MotionPage>} />
        <Route path="/patients" element={<MotionPage><Patients /></MotionPage>} />
        <Route path="/patients/:id" element={<MotionPage><PatientForm /></MotionPage>} />
        <Route path="/agenda" element={<MotionPage><Agenda /></MotionPage>} />
        <Route path="/agenda/new" element={<MotionPage><AppointmentForm /></MotionPage>} />
        <Route path="/finances" element={<MotionPage><Finances /></MotionPage>} />
        <Route path="/settings" element={<MotionPage><Settings /></MotionPage>} />
        <Route path="/login" element={<MotionPage><Login /></MotionPage>} />
      </Routes>
    </AnimatePresence>
  );
}

function MotionPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial="initial" 
      animate="in" 
      exit="out" 
      variants={pageVariants} 
      transition={pageTransition} 
      className="absolute w-full h-full left-0 top-0 bg-background overflow-y-auto pb-safe"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  );
}
