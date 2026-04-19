import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { Users, BookText, BookmarkX, Library, PlusCircle, PenSquare, ArrowRight, ShieldCheck, Activity, Terminal, DollarSign, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const [res, logRes] = await Promise.all([
         axiosInstance.get('/dashboard/admin/stats'),
         axiosInstance.get('/dashboard/admin/logs').catch(() => ({ data: { data: [] } }))
      ]);
      setStats(res.data.data);
      setLogs(logRes.data.data);
    } catch (err) {
      setError('System synchronization failed at aggregate level.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">Initializing Executive Center</span>
    </div>
  );

  if (error || !stats) return (
    <div className="glass-card p-12 rounded-[2rem] text-center max-w-lg mx-auto border-red-500/20">
      <h2 className="text-2xl font-black text-red-400 mb-4">{error ? 'Core Link Failure' : 'Initializing Executive Center...'}</h2>
      <p className="text-slate-400 mb-8">{error || 'Establishing secure link to the global administrative data network.'}</p>
      <button onClick={fetchAdminStats} className="btn-primary bg-red-600 hover:bg-red-500">{error ? 'Relink Core API' : 'Refresh'}</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-[10px] font-black tracking-widest uppercase border border-red-500/20">Executive Authority</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">Global Control</h1>
          <p className="text-slate-500 text-lg font-medium mt-4">Administrative interface for inventory networks and financial accruals.</p>
        </div>
        
        <div className="glass-card px-8 py-5 rounded-3xl flex items-center gap-4 bg-white/2">
           <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
           </div>
           <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">System Integrity</span>
              <span className="text-lg font-black text-white italic tracking-tighter">Verified Native</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/inventory" className="block">
          <AdminStatCard icon={<Library className="w-6 h-6" />} title="Total Stock" value={stats.totalBooks} color="text-indigo-400" />
        </Link>
        <AdminStatCard icon={<BookText className="w-6 h-6" />} title="Live Borrows" value={stats.borrowedBooks} color="text-emerald-400" />
        <Link to="/admin/fines" className="block">
          <AdminStatCard icon={<BookmarkX className="w-6 h-6" />} title="Defaulters" value={stats.overdueBooks} color="text-red-400" />
        </Link>
        <Link to="/admin/users" className="block">
          <AdminStatCard icon={<Users className="w-6 h-6" />} title="Total Users" value={stats.totalMembers} color="text-blue-400" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div whileHover={{ y: -5 }} className="glass-card rounded-[3rem] p-10 flex flex-col justify-between border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[1.7]">
            <Library className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4 flex items-center gap-3">
              Inventory <span className="text-indigo-500 uppercase not-italic text-[10px] tracking-widest font-black ml-2">Mapping</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium mb-12">Execute absolute structural modifications to the catalogue.</p>
          </div>
          <Link to="/admin/inventory" className="btn-primary w-fit flex items-center gap-3 group/btn py-4 text-xs">
             <PlusCircle className="w-4 h-4" />
             Manage Stock
             <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-card rounded-[3rem] p-10 flex flex-col justify-between border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12 transition-transform group-hover:scale-[1.7]">
            <Users className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4 flex items-center gap-3 text-blue-400">
              User Network <span className="text-blue-900 uppercase not-italic text-[10px] tracking-widest font-black ml-2">Oversight</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium mb-12">Manage global member access, tiers, and administrative boundaries.</p>
          </div>
          <Link to="/admin/users" className="flex items-center gap-3 px-8 py-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 font-black tracking-widest text-[10px] uppercase rounded-2xl border border-blue-500/20 transition-all group/btn self-start">
             <UserCog className="w-4 h-4" />
             Manage Members
             <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-card rounded-[3rem] p-10 flex flex-col justify-between border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[1.7]">
            <BookmarkX className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4 flex items-center gap-3 text-red-400">
              Penalties <span className="text-red-900 uppercase not-italic text-[10px] tracking-widest font-black ml-2">Executive</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium mb-12">Override fine computations clearing accrued contextual dues globally.</p>
          </div>
          <Link to="/admin/fines" className="flex items-center gap-3 px-8 py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-black tracking-widest text-[10px] uppercase rounded-2xl border border-red-500/20 transition-all group/btn self-start">
             <DollarSign className="w-4 h-4" />
             Finance Board
             <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Global Activity Feed */}
      <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/5">
        <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/2">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                 <Terminal className="w-6 h-6 text-slate-400" />
              </div>
              <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Activity Stream</h2>
           </div>
           <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
        </div>
        <div className="p-4">
          <div className="space-y-3 max-h-[500px] overflow-y-auto px-4 custom-scrollbar">
            <AnimatePresence>
            {logs.length > 0 ? (
               logs.map((log, idx) => (
                 <motion.div 
                   key={log._id} 
                   initial={{ opacity: 0, x: -10 }} 
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="p-5 rounded-3xl bg-white/2 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all flex items-center justify-between gap-6"
                 >
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner">
                          <span className="text-indigo-400 font-black text-xs tracking-tighter">{log.action.slice(0, 2)}</span>
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                             <span className="text-white font-bold text-sm tracking-tight">{log.user?.name || 'ROOT System'}</span>
                             <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${log.action.includes('REGISTER') ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>{log.action}</span>
                          </div>
                          <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-tight">{log.details}</p>
                       </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end">
                       <span className="text-slate-600 font-black text-[10px] tracking-widest">{new Date(log.createdAt).toLocaleTimeString()}</span>
                       <span className="text-slate-700 font-bold text-[9px] tracking-widest">{new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                 </motion.div>
               ))
            ) : (
               <div className="py-24 text-center">
                  <Activity className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                  <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Waiting for cryptographic activity...</p>
               </div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdminStatCard = ({ icon, title, value, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="glass-card p-8 rounded-[2.5rem] flex items-center border-white/5 group h-full"
  >
    <div className={`p-4 rounded-2xl bg-white/5 mr-6 transition-colors group-hover:bg-white/10 ${color}`}>
       {icon}
    </div>
    <div className="flex flex-col">
       <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{title}</span>
       <span className="text-3xl font-black text-white italic tracking-tighter leading-none">{value}</span>
    </div>
  </motion.div>
);

export default AdminDashboard;
