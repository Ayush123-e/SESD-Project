import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Search, User, Shield, Crown, Trash2, CheckCircle2, AlertCircle, X, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ role: '', membershipTier: '' });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ role: user.role, membershipTier: user.membershipTier });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axiosInstance.patch(`/admin/users/${selectedUser._id}`, formData);
      setMessage({ type: 'success', text: 'Identity mapping updated successfully.' });
      fetchUsers();
      setTimeout(() => setIsModalOpen(false), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Update protocol denied.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Purge this identity from local system bounds?')) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Deletion restricted.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-5xl font-black tracking-tighter text-white italic leading-none uppercase">Identity Hub</h1>
           <p className="text-slate-500 font-medium mt-4">Manage global member access, tiers, and administrative role boundaries.</p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-3xl flex items-center gap-4">
         <Search className="w-6 h-6 text-slate-500 ml-4" />
         <input 
           type="text" 
           placeholder="Search network members by name or email..." 
           className="bg-transparent border-none focus:ring-0 text-white w-full py-4 text-lg font-medium placeholder:text-slate-700"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/5 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">
                     <th className="px-8 py-6">Member Profile</th>
                     <th className="px-8 py-6">Role Authority</th>
                     <th className="px-8 py-6">Membership Tier</th>
                     <th className="px-8 py-6 text-right">Ops</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                       <td colSpan="4" className="py-24 text-center text-slate-600 font-black uppercase text-xs tracking-widest italic animate-pulse">Syncing User Network...</td>
                    </tr>
                  ) : filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-white/2 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
                                <User className="w-5 h-5 text-indigo-400" />
                             </div>
                             <div>
                                <p className="text-white font-bold tracking-tight">{user.name}</p>
                                <p className="text-xs text-slate-500 italic lowercase">{user.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'LIBRARIAN' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/10' : 'bg-slate-500/10 text-slate-400 border border-white/5'}`}>
                             {user.role === 'LIBRARIAN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                             {user.role}
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <Crown className={`w-4 h-4 ${user.membershipTier === 'Premium' ? 'text-yellow-500 text-glow' : 'text-slate-600'}`} />
                             <span className="text-sm font-bold text-white tracking-tight uppercase italic">{user.membershipTier}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleEdit(user)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                                <Filter className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDelete(user._id)} className="p-3 bg-white/5 hover:bg-red-600/20 rounded-2xl text-slate-400 hover:text-red-500 transition-all">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="glass-card w-full max-w-lg rounded-[3rem] p-10 relative z-10">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Update Identity</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                {message.text && (
                  <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Authority Role</label>
                      <select className="input-field" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                         <option value="MEMBER">MEMBER</option>
                         <option value="LIBRARIAN">LIBRARIAN</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subscription Tier</label>
                      <select className="input-field" value={formData.membershipTier} onChange={(e) => setFormData({...formData, membershipTier: e.target.value})}>
                         <option value="Free">Free</option>
                         <option value="Standard">Standard</option>
                         <option value="Premium">Premium</option>
                      </select>
                   </div>
                   <button type="submit" disabled={updating} className="w-full btn-primary py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
                      {updating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Execute Access Update <ChevronRight className="w-4 h-4" /></>}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserManagement;
