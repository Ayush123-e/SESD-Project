import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Search, Plus, Edit2, Trash2, BookOpen, Clock, AlertCircle, CheckCircle2, ChevronRight, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', ISBN: '', category: 'FICTION', quantity: 1 });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY', 'HISTORY', 'BIOGRAPHY'];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/books', { params: { limit: 100 } });
      setBooks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenModal = (book = null) => {
    if (book) {
      setCurrentBook(book);
      setFormData({ 
        title: book.title, 
        author: book.author, 
        ISBN: book.ISBN, 
        category: book.category, 
        quantity: book.quantity 
      });
    } else {
      setCurrentBook(null);
      setFormData({ title: '', author: '', ISBN: '', category: 'FICTION', quantity: 1 });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('coverImage', imageFile);

    try {
      if (currentBook) {
        await axiosInstance.patch(`/books/${currentBook._id}`, data);
        setMessage({ type: 'success', text: 'Asset metadata updated successfully.' });
      } else {
        await axiosInstance.post('/books', data);
        setMessage({ type: 'success', text: 'New asset initialized into showroom.' });
      }
      fetchBooks();
      setTimeout(() => setIsModalOpen(false), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Transaction failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to purge this asset from mapping?')) return;
    try {
      await axiosInstance.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      alert('Delete protocol failed.');
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.ISBN.includes(search)
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-5xl font-black tracking-tighter text-white italic leading-none uppercase">Inventory Suite</h1>
           <p className="text-slate-500 font-medium mt-4">Execute structural modifications to the physical stock database.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 self-start md:self-end"
        >
          <Plus className="w-5 h-5" /> Initialize New Asset
        </button>
      </div>

      <div className="glass-card p-4 rounded-3xl flex items-center gap-4">
         <Search className="w-6 h-6 text-slate-500 ml-4" />
         <input 
           type="text" 
           placeholder="Synchronize search by title, author or ISBN..." 
           className="bg-transparent border-none focus:ring-0 text-white w-full py-4 text-lg font-medium placeholder:text-slate-700"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border-white/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/5 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">
                     <th className="px-8 py-6">Identity Mapping</th>
                     <th className="px-8 py-6">Category</th>
                     <th className="px-8 py-6 text-center">Stock Levels</th>
                     <th className="px-8 py-6 text-right">Structural Ops</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center text-slate-500 font-black uppercase text-xs tracking-widest italic animate-pulse">Syncing Inventory...</td>
                    </tr>
                  ) : filteredBooks.map(book => (
                    <tr key={book._id} className="hover:bg-white/2 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-14 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-white/5 shrink-0">
                                {book.coverImageUrl ? <img src={book.coverImageUrl.startsWith('http') ? book.coverImageUrl : `${axiosInstance.defaults.baseURL.replace('/api', '')}${book.coverImageUrl}`} className="w-full h-full object-cover" /> : <BookOpen className="w-5 h-5 text-slate-800" />}
                             </div>
                             <div className="min-w-0">
                                <p className="text-white font-bold truncate tracking-tight">{book.title}</p>
                                <p className="text-xs font-medium text-slate-500 truncate italic">By {book.author}</p>
                                <p className="text-[9px] font-black font-mono text-indigo-500 mt-1 uppercase tracking-tighter">ISBN: {book.ISBN}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black tracking-widest text-slate-400 uppercase border border-white/5">
                             {book.category} Edition
                          </span>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <div className="flex flex-col items-center">
                             <span className="text-lg font-black text-white italic tracking-tighter">{book.availableQuantity} / {book.quantity}</span>
                             <div className="w-12 h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${(book.availableQuantity/book.quantity)*100}%` }} />
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => handleOpenModal(book)} className="p-3 bg-white/5 hover:bg-indigo-600 rounded-2xl text-slate-400 hover:text-white transition-all">
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDelete(book._id)} className="p-3 bg-white/5 hover:bg-red-600 rounded-2xl text-slate-400 hover:text-white transition-all">
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

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-2xl rounded-[3rem] p-8 sm:p-12 relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                  {currentBook ? 'Modify Mapping' : 'Initialize Asset'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {message.text && (
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                   {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                   {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Title</label>
                    <input 
                      type="text" required className="input-field" placeholder="Entry Label..." 
                      value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Creator/Author</label>
                    <input 
                      type="text" required className="input-field" placeholder="Author Identity..." 
                      value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Structural ISBN</label>
                    <input 
                      type="text" required className="input-field" placeholder="ISBN Fingerprint..." 
                      value={formData.ISBN} onChange={(e) => setFormData({...formData, ISBN: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Edition Category</label>
                    <select 
                      className="input-field appearance-none cursor-pointer"
                      value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Limit / Quantity</label>
                    <input 
                      type="number" required min="1" className="input-field" 
                      value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    />
                 </div>
                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cover Mapping (JPG/PNG)</label>
                    <div className="relative">
                       <input 
                        type="file" accept="image/*" className="hidden" id="cover-upload"
                        onChange={(e) => setImageFile(e.target.files[0])}
                       />
                       <label htmlFor="cover-upload" className="w-full input-field flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
                          <Upload className="w-5 h-5 text-indigo-500" />
                          <span className="truncate">{imageFile ? imageFile.name : 'Select cryptographic binary cover...'}</span>
                       </label>
                    </div>
                 </div>

                 <button 
                  type="submit" disabled={submitting}
                  className="col-span-2 btn-primary py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3"
                 >
                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                      <>
                        <Terminal className="w-5 h-5" />
                        Execute Structural Transaction
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Terminal = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
);

export default InventoryManagement;
