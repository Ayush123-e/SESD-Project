import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Library, LogOut, User, ShoppingBag, MapPin, Settings, ShieldCheck, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-nav px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white leading-none">STYLESTORE</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 upper-case">Library Suite</span>
            </div>
          </Link>
        </motion.div>
        
        <div className="flex items-center gap-1 sm:gap-4 lg:gap-6">
          <NavLink to="/books" icon={<Library />} label="Inventory" />
          <NavLink to="/spaces" icon={<MapPin />} label="Spaces" />

          {/* Librarian Quick Shortcuts */}
          {user?.role === 'LIBRARIAN' && (
             <div className="hidden lg:flex items-center gap-1 border-x border-white/5 px-2">
                <IconLink to="/admin/inventory" icon={<Settings />} title="Manage Books" />
                <IconLink to="/admin/users" icon={<Users />} title="Manage Users" />
                <IconLink to="/admin/fines" icon={<DollarSign />} title="Finance Board" />
             </div>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2">
              <Link 
                to={user.role === 'LIBRARIAN' ? '/admin' : '/dashboard'}
                className="flex items-center gap-3 p-1 pr-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner ${user.role === 'LIBRARIAN' ? 'bg-red-500' : 'bg-gradient-to-tr from-indigo-500 to-purple-500'}`}>
                  {user.role === 'LIBRARIAN' ? <ShieldCheck className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-none">{user.name.split(' ')[0]}</span>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">{user.role}</span>
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all group"
                title="Logout Session"
              >
                <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary flex items-center gap-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="text-slate-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2"
  >
    {React.cloneElement(icon, { className: "w-4 h-4" })}
    <span className="hidden md:block uppercase tracking-widest">{label}</span>
  </Link>
);

const IconLink = ({ to, icon, title }) => (
   <Link 
    to={to} title={title}
    className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"
   >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
   </Link>
);

export default Navbar;
