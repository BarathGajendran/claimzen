import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';

/**
 * Top Navbar header. Designed as a clean corporate layout with fine dividers.
 */
const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path === '/scan') return 'AI Camera Scanner';
    if (path === '/upload') return 'File New Claim';
    if (path === '/history') return 'Claims Repository';
    if (path.startsWith('/claims/')) return 'AI Assessment Report';
    return 'Console';
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/80 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left side breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200 transition-colors lg:hidden cursor-pointer"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <h1 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight uppercase">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-550 hidden sm:block font-medium">
            ClaimZen Enterprise Portal
          </p>
        </div>
      </div>

      {/* Right side status indicators */}
      <div className="flex items-center gap-3.5">
        {user && (
          <Link 
            to="/profile" 
            className="flex items-center gap-2.5 hover:opacity-80 transition-all cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-none">
                {user.name}
              </p>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1 block">
                Adjuster Profile
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-305 flex items-center justify-center font-bold text-xs uppercase select-none border border-slate-200/60 dark:border-slate-700/50">
              {user.name.charAt(0)}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
