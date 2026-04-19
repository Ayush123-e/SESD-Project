import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { DollarSign, Search, User, Book, CheckCircle2, AlertCircle, Calendar, Hash, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminFines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [settlingId, setSettlingId] = useState(null);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/borrowing/fines/all');
      setFines(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handleSettle = async (fineId, recordId) => {
    if (!window.confirm('Executing manual settlement overrides and clears fine status. Proceed?')) return;
    setSettlingId(fineId);
    try {
      // Backend expects recordId for settlement natively
      await axiosInstance.patch(`/borrowing/fines/${recordId}/pay`);
      fetchFines();
    } catch (err) {
      alert('Settlement protocol failed.');
    } finally {
      setSettlingId(null);
    }
  };

  const filteredFines = fines.filter(f => 
    f.borrowRecordId?.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    f.borrowRecordId?.book?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-5xl font-black tracking-tighter text-white italic leading-none uppercase">Finance Board</h1>
           <p className="text-slate-500 font-medium mt-4">Oversee global overdue penalties and execute manual security settlements.</p>
        </div>
        <div className="glass-card px-8 py-5 rounded-3xl flex items-center gap-4 bg-red-500/5 border-red-500/10">
           <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <DollarSign className="w-6 h-6 text-white" />
           </div>
           <div>
              <span className="text-[10px] font-black text-red-900/40 uppercase tracking-widest block font-sans">Total Unpaid Trace</span>
              <span className="text-lg font-black text-white italic tracking-tighter italic">₹{filteredFines.reduce((acc, f) => acc + (f.amount || 0), 0)}</span>
           </div>
        </div>
      </div>

      <div className="glass-card p-4 rounded-3xl flex items-center gap-4">
         <Search className="w-6 h-6 text-slate-500 ml-4" />
         <input 
           type="text" 
           placeholder="Search fines by member name or book asset..." 
           className="bg-transparent border-none focus:ring-0 text-white w-full py-4 text-lg font-medium placeholder:text-slate-700 font-sans"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/5 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">
                     <th className="px-8 py-6">Member Identity</th>
                     <th className="px-8 py-6">Inventory Asset</th>
                     <th className="px-8 py-6">Dues Amount</th>
                     <th className="px-8 py-6 text-right">Ops</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                       <td colSpan="4" className="py-24 text-center text-slate-600 font-black uppercase text-xs tracking-widest italic animate-pulse">Syncing Global Fines...</td>
                    </tr>
                  ) : filteredFines.length === 0 ? (
                    <tr>
                       <td colSpan="4" className="py-24 text-center">
                          <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" />
                          <p className="text-slate-600 font-black uppercase tracking-widest text-xs italic">System Clear. No active penalties mapped.</p>
                       </td>
                    </tr>
                  ) : filteredFines.map(fine => (
                    <tr key={fine._id} className="hover:bg-white/2 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-500" />
                             </div>
                             <div>
                                <p className="text-white font-bold tracking-tight">{fine.borrowRecordId?.user?.name || 'Unknown Identity'}</p>
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{fine.borrowRecordId?.user?.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <Book className="w-4 h-4 text-indigo-500/50" />
                             <span className="text-sm font-bold text-slate-400">{fine.borrowRecordId?.book?.title || 'System Asset'}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-xl font-black text-white italic tracking-tighter italic">₹{fine.amount}</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button 
                            disabled={settlingId === fine._id}
                            onClick={() => handleSettle(fine._id, fine.borrowRecordId?._id)}
                            className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/10 transition-all flex items-center justify-center gap-2 ml-auto"
                          >
                             {settlingId === fine._id ? <Activity className="w-3 h-3 animate-pulse" /> : <DollarSign className="w-3 h-3" />}
                             Execute Settlement
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </motion.div>
  );
};

export default AdminFines;
