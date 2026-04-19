import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';
import { BookOpen, CalendarClock, DollarSign, BookmarkX, MapPin, CheckCircle2, ChevronRight, Crown, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/dashboard/member/stats');
      setStats(res.data.data);
    } catch (err) {
      setError('Failed to synchronize dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReturnAction = async (recordId) => {
    try {
      await axiosInstance.patch(`/borrowing/return/${recordId}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Return protocol failed.');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">Hydrating Identity Hub</span>
    </div>
  );

  if (error || !stats) return (
    <div className="glass-card p-12 rounded-[2rem] text-center max-w-lg mx-auto border-red-500/20">
      <h2 className="text-2xl font-black text-red-400 mb-4">{error ? 'Sync Error' : 'Mapping Identity...'}</h2>
      <p className="text-slate-400 mb-8">{error || 'Synchronizing your member profile with the library network.'}</p>
      <button onClick={fetchDashboardData} className="btn-primary bg-red-600 hover:bg-red-500">Retry Synchronization</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black tracking-widest uppercase border border-indigo-500/20">Member Session</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Command Center</h1>
          <p className="text-slate-500 text-lg font-medium mt-2">Welcome back, {user?.name.split(' ')[0]}. Active inventory traces synchronized.</p>
        </div>
        
        <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Account Status</span>
            <span className="text-lg font-black text-white italic tracking-tighter">{stats.membershipTier} Tier</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<BookOpen className="w-6 h-6" />} title="Active Issues" value={stats.borrowedBooks} color="text-indigo-400" />
        <StatCard icon={<BookmarkX className="w-6 h-6" />} title="Waitlisted" value={stats.waitlistCount} color="text-purple-400" />
        <Link to="/spaces" className="block cursor-pointer">
          <StatCard icon={<MapPin className="w-6 h-6" />} title="Slots Locked" value={stats.activeSpaceBookings?.length || 0} color="text-emerald-400" />
        </Link>
        <StatCard icon={<DollarSign className="w-6 h-6" />} title="Total Dues" value={`₹${stats.pendingFinesTotal}`} color="text-red-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Inventory Grid */}
          <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/2">
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Active Issues</h3>
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="p-4">
              {stats.dueDates.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-slate-700" />
                  </div>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No active asset issued</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.dueDates.map((b) => (
                    <motion.div 
                      key={b.recordId}
                      whileHover={{ x: 5 }}
                      className="group flex items-center justify-between p-4 rounded-3xl bg-white/2 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-16 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                            <BookOpen className="w-6 h-6 text-slate-700" />
                         </div>
                         <div>
                            <p className="text-white font-bold tracking-tight">{b.bookTitle}</p>
                            <p className="text-[10px] uppercase font-black text-slate-500 mt-1 tracking-widest">Due Date: {new Date(b.dueDate).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${b.isOverdue ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                          {b.isOverdue ? 'Overdue' : 'Secure'}
                        </span>
                        <button 
                          onClick={() => handleReturnAction(b.recordId)}
                          className="p-3 bg-white/5 hover:bg-indigo-600 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Study Slots Card */}
          <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/2">
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Locked Slots</h3>
              <MapPin className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="p-4 grid sm:grid-cols-2 gap-3">
              {stats.activeSpaceBookings?.length === 0 ? (
                 <div className="col-span-2 py-10 text-center text-slate-600 font-bold uppercase text-[10px] tracking-widest italic">Physical Presence Unmapped</div>
              ) : stats.activeSpaceBookings?.map(b => (
                <div key={b.id} className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-white font-black italic tracking-tighter text-lg leading-none">{b.spaceName}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                      <CalendarClock className="w-4 h-4" />
                      {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span>-</span>
                      {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Fines Panel */}
          <div className="glass-card rounded-[2.5rem] overflow-hidden border-red-500/10">
             <div className="px-8 py-6 border-b border-red-500/10 flex justify-between items-center bg-red-500/5">
                <h3 className="text-xl font-black text-red-400 italic tracking-tight uppercase">Dues Trace</h3>
                <DollarSign className="w-5 h-5 text-red-500" />
             </div>
             <div className="p-6">
                {stats.detailedFines?.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center gap-4">
                     <CheckCircle2 className="w-12 h-12 text-emerald-500/20" />
                     <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">Account Fully Secured</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {stats.detailedFines.map(f => (
                       <div key={f.recordId} className="p-5 rounded-[2rem] bg-red-500/5 border border-red-500/10 flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-red-900/40 uppercase tracking-widest">Penalty Mapping</span>
                                <span className="text-white font-bold leading-tight mt-1">{f.bookTitle || 'Inventory Asset'}</span>
                             </div>
                             <span className="text-2xl font-black text-white italic tracking-tighter shrink-0">₹{f.fineAmount}</span>
                          </div>
                          <button className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all">Resolve Fine Natively</button>
                       </div>
                     ))}
                  </div>
                )}
             </div>
          </div>

          {/* Waitlist Panel */}
          <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
             <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Reservations</h3>
                <BookmarkX className="w-5 h-5 text-orange-500" />
             </div>
             <div className="p-6">
                <div className="space-y-4">
                   {stats.waitlistedBooks?.length === 0 ? (
                     <p className="text-center py-10 text-slate-600 font-bold uppercase text-[10px] tracking-widest italic">Waiting Queue Clear</p>
                   ) : stats.waitlistedBooks.map(b => (
                     <div key={b.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
                        <div className="flex-grow min-w-0">
                           <p className="text-white font-bold truncate text-sm">{b.title}</p>
                           <p className={`text-[10px] font-black uppercase mt-1 tracking-tighter ${b.status === 'notified' ? 'text-emerald-400' : 'text-orange-400 text-glow'}`}>
                             {b.status === 'notified' ? 'Ready to Claim' : 'In Queue Bound'}
                           </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-700" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between border-white/5"
  >
    <div className={`p-3 w-fit rounded-2xl bg-white/5 mb-6 ${color}`}>
       {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-4xl font-black text-white tracking-tighter italic">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;
