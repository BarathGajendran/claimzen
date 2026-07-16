import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, Sun, Moon, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import Spinner from '../components/Spinner';

/**
 * Centered Register Page.
 * Displays registration inputs with clean, standard placeholders ("Full Name", "Email", "Password", "Confirm Password").
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill out all registration fields', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      showToast('Account registered successfully', 'success');
      navigate('/dashboard');
    } else {
      showToast(result.error || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-55 bg-zinc-50 dark:bg-black px-4 transition-colors duration-200 relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-505 dark:text-zinc-405 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-zinc-500" />}
      </button>

      {/* Main Register Card */}
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-8 rounded-2xl shadow-sm flex flex-col gap-6 animate-fade-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-55 dark:text-zinc-50 uppercase tracking-wider mt-1">
            Create Account
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4" autoComplete="off">
          {/* Full Name field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-805 dark:border-zinc-800 bg-white dark:bg-zinc-955 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-955 dark:focus:ring-zinc-50 text-xs transition-all shadow-sm"
              placeholder="Full Name"
              required
              autoComplete="off"
            />
          </div>

          {/* Email address field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-805 dark:border-zinc-800 bg-white dark:bg-zinc-955 dark:bg-zinc-955 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-955 dark:focus:ring-zinc-50 text-xs transition-all shadow-sm"
              placeholder="Email"
              required
              autoComplete="off"
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-805 dark:border-zinc-800 bg-white dark:bg-zinc-955 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-955 dark:focus:ring-zinc-50 text-xs transition-all shadow-sm"
              placeholder="Password"
              required
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-805 dark:border-zinc-800 bg-white dark:bg-zinc-955 dark:bg-zinc-955 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50 text-xs transition-all shadow-sm"
              placeholder="Confirm Password"
              required
              autoComplete="new-password"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-850 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {loading ? (
              <>
                <Spinner size="sm" color={theme === 'dark' ? 'black' : 'white'} />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Redirect */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 text-center">
          <p className="text-xs text-zinc-500 dark:text-slate-400 dark:text-zinc-400 font-medium">
            Already have an adjuster account?{' '}
            <Link
              to="/login"
              className="text-zinc-900 dark:text-zinc-100 font-bold hover:underline transition-colors"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
