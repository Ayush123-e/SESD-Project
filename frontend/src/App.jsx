import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import Catalog from './pages/Catalog';
import BookDetails from './pages/BookDetails';
import InventoryManagement from './pages/InventoryManagement';
import UserManagement from './pages/UserManagement';
import AdminFines from './pages/AdminFines';
import SpaceBooking from './pages/SpaceBooking';
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Catalog Space */}
        <Route path="/books" element={<Catalog />} />
        <Route path="/books/:id" element={<BookDetails />} />
        
        {/* Public Auth Map */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes - Member Context */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/spaces" 
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <SpaceBooking />
            </ProtectedRoute>
          } 
        />

        {/* Shielded Librarian Space */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/inventory" 
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN']}>
              <InventoryManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/fines" 
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN']}>
              <AdminFines />
            </ProtectedRoute>
          } 
        />

        {/* Generic fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-[#0b1120] text-slate-200 transition-colors duration-300 flex flex-col font-sans relative overflow-hidden">
            {/* Global Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <Navbar />
            <main className="flex-grow w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
              <AnimatedRoutes />
            </main>
            
            <footer className="py-8 text-center text-slate-600 text-xs font-bold tracking-widest uppercase border-t border-white/5 relative z-10">
              © 2026 StyleStore | Intelligent Library Ecosystem
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
