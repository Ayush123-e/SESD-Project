import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, BookOpen, AlertCircle, CheckCircle2, BookmarkPlus, ChevronRight, ShoppingBag, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext); 
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [borrowing, setBorrowing] = useState(false);
  const [borrowError, setBorrowError] = useState('');
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(`/books/${id}`);
        setBook(res.data.data);
      } catch (err) {
        setError('Inventory asset unmapped or deprecated.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setBorrowing(true);
    setBorrowError('');
    setBorrowSuccess(false);

    try {
      await axiosInstance.post('/borrowing/borrow', { bookId: book._id });
      setBorrowSuccess(true);
      
      setBook(prev => ({ ...prev, availableQuantity: prev.availableQuantity - 1 }));
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
    } catch (err) {
      setBorrowError(err.response?.data?.message || 'Checkout protocol denied.');
    } finally {
      setBorrowing(false);
    }
  };

  const handleWaitlist = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setBorrowing(true);
    setBorrowError('');
    try {
      await axiosInstance.post(`/borrowing/waitlist/${book._id}`);
      setBorrowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
    } catch (err) {
      setBorrowError(err.response?.data?.message || 'Waitlist synchronization failed.');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">Fetching Asset Details</span>
    </div>
  );
  
  if (error) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 rounded-[2.5rem] text-center max-w-lg mx-auto border-red-500/20 mt-20">
      <AlertCircle className="mx-auto h-12 w-12 mb-6 text-red-500" />
      <h2 className="text-2xl font-black text-white mb-2 uppercase italic">Mapping Exception</h2>
      <p className="text-slate-400 mb-8 font-medium">{error}</p>
      <Link to="/books" className="btn-primary inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Return to Showroom
      </Link>
    </motion.div>
  );
  
  if (!book) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20"
    >
      <Link 
        to="/books" 
        className="inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors mb-8 group"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Exit Showroom
      </Link>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Visual Component */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-card aspect-[3/4] rounded-[3rem] overflow-hidden border-white/10 shadow-2xl relative group"
          >
            {book.coverImageUrl ? (
              <img 
                src={book.coverImageUrl.startsWith('http') ? book.coverImageUrl : `${axiosInstance.defaults.baseURL.replace('/api', '')}${book.coverImageUrl}`} 
                className="w-full h-full object-cover" 
                alt={book.title} 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <BookOpen className="w-24 h-24 text-indigo-500/20 mb-8" />
                <span className="text-xs uppercase font-black tracking-[0.2em] text-slate-700">Digital Archive Trace</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-10 left-10 right-10">
               <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-[0.2em] text-white uppercase italic">
                 {book.category} Edition
               </span>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="glass-card p-6 rounded-[2rem] border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Catalog Identity</span>
                <span className="text-lg font-black text-white italic tracking-tighter">{book.ISBN}</span>
             </div>
             <div className="glass-card p-6 rounded-[2rem] border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Local Stock</span>
                <span className="text-lg font-black text-white italic tracking-tighter">{book.availableQuantity} / {book.quantity}</span>
             </div>
          </div>
        </div>

        {/* Content Component */}
        <div className="lg:col-span-7 space-y-10 lg:pt-10">
          <div className="space-y-4">
             <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl sm:text-6xl font-black tracking-tighter text-white italic leading-tight"
             >
               {book.title}
             </motion.h1>
             <div className="flex items-center gap-4">
                <div className="w-10 h-[2px] bg-indigo-500/50" />
                <span className="text-xl font-bold text-indigo-400">By {book.author}</span>
             </div>
          </div>

          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
            This asset is part of the StyleStore curated collection. All physical checkouts are bound strictly by your membership tier and current active limits (Max 3 items).
          </p>

          <div className="space-y-6 pt-10 border-t border-white/5">
            <AnimatePresence mode="wait">
              {borrowSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 flex items-center gap-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Sync Successful</h3>
                    <p className="text-emerald-400/70 font-bold text-sm">Mapping transaction to your dashboard...</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {borrowError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5" />
                      {borrowError}
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={book.availableQuantity > 0 ? handleBorrow : handleWaitlist}
                      disabled={borrowing || (user?.role === 'LIBRARIAN')}
                      className={`flex-grow btn-primary py-5 text-white font-black tracking-widest uppercase text-xs flex items-center justify-center gap-3 group ${book.availableQuantity > 0 ? 'bg-indigo-600' : 'bg-orange-600'}`}
                    >
                      {borrowing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                        <>
                          {book.availableQuantity > 0 ? <ShoppingBag className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                          {token ? (
                            book.availableQuantity > 0 ? 'Initialize Checkout' : 'Enter Waiting Queue'
                          ) : 'Authorize to Access'}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    
                    {user?.role === 'LIBRARIAN' && (
                      <button className="px-8 py-5 glass-card rounded-2xl text-xs font-black uppercase text-indigo-400 tracking-widest border-indigo-500/20 hover:bg-indigo-500/10 transition-all">
                        Edit Metadata
                      </button>
                    )}
                  </div>
                  
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center sm:text-left">
                    {book.availableQuantity > 0 ? 'Asset physically available for synchronous mapping' : 'Inventory exhausted. Asynchronous reservation required.'}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookDetails;
