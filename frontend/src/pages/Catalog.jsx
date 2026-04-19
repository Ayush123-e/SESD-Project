import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { Search, Filter, BookOpen, ChevronRight, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('newest');
  
  const categories = ['FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY', 'HISTORY', 'BIOGRAPHY'];

  const fetchBooks = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    try {
      const params = { page: pageNum, limit: 12 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      if (availability) params.availability = availability;
      if (sort) params.sort = sort;

      const res = await axiosInstance.get('/books', { params });
      console.log("Catalog API Response Path:", res.config.url, "Status:", res.status, "Data Count:", res.data?.data?.length);
      
      if (pageNum === 1) {
         setBooks(res.data?.data || []);
      } else {
         setBooks(prev => [...prev, ...(res.data?.data || [])]);
      }
      setHasMore(res.data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to map inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchBooks(1);
  }, [debouncedSearch, category, availability, sort]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900/40 p-8 sm:p-12 border border-white/5 shadow-inner">
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-4 italic"
          >
            Digital <span className="text-indigo-400 not-italic">Showroom</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg font-medium leading-relaxed"
          >
            Explore our curated selection of high-fidelity literature, meticulously categorized for the modern mind.
          </motion.p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--brand-primary)_0%,_transparent_70%)] pointer-events-none" />
      </div>

      <div className="flex flex-col xl:flex-row gap-6 sticky top-24 z-30">
        <div className="flex-grow glass-card p-2 rounded-2xl flex flex-wrap lg:flex-nowrap items-center gap-2">
          <div className="relative flex-grow min-w-[250px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
             <input
                type="text"
                placeholder="Search catalog title, author or ISBN..."
                className="w-full bg-white/5 border-none rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-slate-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
          </div>
          
          <div className="h-8 w-[1px] bg-white/10 hidden lg:block mx-2" />
          
          <div className="flex items-center gap-2 flex-wrap">
            <select
              className="bg-white/5 border-none rounded-xl py-3 px-4 text-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" className="bg-slate-900">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>

            <select
              className="bg-white/5 border-none rounded-xl py-3 px-4 text-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer appearance-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest" className="bg-slate-900">New Arrivals</option>
              <option value="popular" className="bg-slate-900">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-40 gap-4"
          >
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">Loading Collection</span>
          </motion.div>
        ) : books.length > 0 ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {books.map((book, idx) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/books/${book._id}`} className="block group">
                  <div className="glass-card rounded-[2rem] overflow-hidden group-hover:border-indigo-500/50 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-indigo-500/10">
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                      {book.coverImageUrl ? (
                        <img 
                          src={book.coverImageUrl.startsWith('http') ? book.coverImageUrl : `${axiosInstance.defaults.baseURL.replace('/api', '')}${book.coverImageUrl}`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          alt={book.title} 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-12 text-center">
                          <BookOpen className="w-16 h-16 text-indigo-500/30 mb-6 group-hover:scale-110 transition-transform duration-500" />
                          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 opacity-60">Cover Mapping Unavailable</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-[0.1em] text-white uppercase">
                          {book.category}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-xl font-bold text-white tracking-tight line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">{book.author}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Availability</span>
                        <span className={`text-sm font-bold ${book.availableQuantity > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                          {book.availableQuantity > 0 ? 'INSTOCK' : 'WAITLISTED'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                        <span className="text-xs font-bold text-indigo-400 uppercase">Details</span>
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass-card rounded-[3rem] p-20 text-center flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full bg-slate-950 flex items-center justify-center mb-8 border border-white/5">
              <BookOpen className="w-10 h-10 text-slate-700" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white mb-4">No matching inventory</h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              We couldn't synchronize any catalog items with your current filter boundaries. Try clearing your parameters to resets the mapping.
            </p>
            <button 
              onClick={() => { setSearch(''); setCategory(''); setAvailability(''); setSort('newest'); }}
              className="mt-10 btn-primary"
            >
              Reset Digital Showroom
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {hasMore && !loading && (
        <div className="flex justify-center pt-12">
          <button 
            onClick={() => fetchBooks(page + 1)}
            className="group relative px-12 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all overflow-hidden"
          >
             <span className="relative z-10 text-white font-bold tracking-widest uppercase text-xs">Load Extra Mapping</span>
             <motion.div 
              className="absolute inset-0 bg-indigo-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
             />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Catalog;
