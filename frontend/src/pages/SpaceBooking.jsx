import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../services/axiosInstance';
import { MapPin, Clock, CheckCircle2, AlertCircle, Calendar, ChevronRight, Info, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const SpaceBooking = () => {
  const { user } = useContext(AuthContext);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [bookingTime, setBookingTime] = useState({ start: '', end: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/spaces');
      setSpaces(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSpace) return;
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Create absolute Date objects for today
      const today = new Date().toISOString().split('T')[0];
      const startIso = `${today}T${bookingTime.start}:00Z`;
      const endIso = `${today}T${bookingTime.end}:00Z`;

      await axiosInstance.post('/spaces/book', { 
        spaceId: selectedSpace._id, 
        startTime: startIso, 
        endTime: endIso 
      });
      setMessage({ type: 'success', text: 'Space slot locked successfully. Tracing back to dashboard...' });
      setTimeout(() => window.location.href = '/dashboard', 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking denied by system protocol.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-950 to-slate-950 p-12 sm:p-16 border border-white/5 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
           <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Space <span className="text-indigo-500 not-italic">Allocation</span></h1>
           <p className="text-slate-400 text-lg font-medium leading-relaxed">Reserve high-fidelity study zones tailored for deep mapping session. Bounded by your membership tier limits.</p>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_-20%,_rgba(99,102,241,0.15)_0%,_transparent_50%)] pointer-events-none" />
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
           <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Available Study Zones</h2>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{spaces.length} Network Nodes Detected</span>
           </div>

           {loading ? (
             <div className="py-40 text-center flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
               <span className="text-slate-600 font-black uppercase text-[10px] tracking-widest italic">Syncing Environments...</span>
             </div>
           ) : (
             <div className="grid sm:grid-cols-2 gap-6">
                {spaces.map(space => (
                  <motion.div 
                    key={space._id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedSpace(space)}
                    className={`glass-card p-8 rounded-[2.5rem] border-white/5 cursor-pointer transition-all relative overflow-hidden group ${selectedSpace?._id === space._id ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : 'hover:bg-white/5'}`}
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-2xl ${space.status === 'active' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-red-500/20 text-red-400'}`}>
                           <MapPin className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${space.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {space.status}
                        </span>
                     </div>
                     <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2">{space.name}</h3>
                     <div className="flex items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-tight">
                        <User className="w-4 h-4" /> Capacity: {space.capacity} Slots
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </motion.div>
                ))}
             </div>
           )}
        </div>

        <div className="lg:col-span-5 space-y-8 sticky top-28">
           <div className="glass-card rounded-[3rem] p-10 border-white/10 relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic mb-8 flex items-center gap-3">
                    Protocol <span className="text-indigo-400 not-italic">Configuration</span>
                 </h3>

                 {!selectedSpace ? (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                       <Info className="w-12 h-12 text-slate-800" />
                       <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest leading-relaxed italic">Select a network node from the inventory to initialize allocation session.</p>
                    </div>
                 ) : (
                    <form onSubmit={handleBooking} className="space-y-8">
                       <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 mb-8">
                          <span className="text-[10px] font-black text-indigo-900/50 uppercase tracking-widest mb-1.5 block">Selected Zone</span>
                          <span className="text-xl font-black text-white italic tracking-tighter uppercase">{selectedSpace.name}</span>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Phase</label>
                             <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                  type="time" required className="input-field pl-12"
                                  value={bookingTime.start} onChange={(e) => setBookingTime({...bookingTime, start: e.target.value})}
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Phase</label>
                             <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                  type="time" required className="input-field pl-12"
                                  value={bookingTime.end} onChange={(e) => setBookingTime({...bookingTime, end: e.target.value})}
                                />
                             </div>
                          </div>
                       </div>

                       <div className="bg-white/2 border border-white/5 rounded-3xl p-6 flex flex-col gap-3">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Allocation Policy</h4>
                          <ul className="space-y-2">
                             <li className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Max synchronization: 4 hours
                             </li>
                             <li className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Auto-purge after slot expiration
                             </li>
                          </ul>
                       </div>

                       {message.text && (
                         <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                           {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                           {message.text}
                         </div>
                       )}

                       <button 
                        type="submit" disabled={submitting}
                        className="w-full btn-primary py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 group"
                       >
                          {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                            <>
                              Initialize Allocation 
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </>
                          )}
                       </button>
                    </form>
                 )}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpaceBooking;
