import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-12 rounded-[3.5rem] border-red-500/20 max-w-xl w-full"
      >
        <div className="bg-red-500/10 p-8 rounded-full mb-8 border-2 border-red-500/20 shadow-inner inline-block">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic italic">Access Denied</h1>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto text-lg font-medium leading-relaxed">
          You are attempting to access an executive domain without explicit librarian verification. Protocol restricted.
        </p>
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center gap-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Navigate to Safety
        </Link>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
