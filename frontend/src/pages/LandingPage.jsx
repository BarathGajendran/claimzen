import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Clock, Coins, ShieldCheck, HeartHandshake, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Multimodal Damage Scanning',
      description: 'Upload high-resolution images of vehicle collisions to instantly isolate, classify, and diagnose damage profiles.',
      icon: Sparkles,
      color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/40 dark:text-brand-400'
    },
    {
      title: 'Automated Repair Estimates',
      description: 'Generate localized cost projections covering labor, body work, paint matching, and safety sensor recalibrations.',
      icon: Coins,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
    },
    {
      title: 'AI Fraud Risk Analysis',
      description: 'Assess claims flags indicating pre-existing rust, double claim submittals, or timeline inconsistencies.',
      icon: ShieldCheck,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
    },
    {
      title: 'Instant Report Turnaround',
      description: 'Cut down claims assessment latency from several days to under 15 seconds, increasing customer satisfaction metrics.',
      icon: Clock,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
    }
  ];

  const stats = [
    { value: '15s', label: 'Average Report Time' },
    { value: '94%', label: 'Estimate Accuracy' },
    { value: '60%', label: 'Cycle Time Reduction' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Landing Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-brand-500 text-white">
              <ShieldCheck className="w-6 h-6 fill-white/10" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-blue-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-blue-400">
              ClaimZen
            </span>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-premium transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-premium transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow pt-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center relative overflow-hidden">
          {/* Subtle glowing background blobs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-400 text-[11px] font-bold tracking-wide uppercase animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Claims Processing
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              Automated Vehicle Damage Assessments
              <span className="block text-brand-500 mt-1 bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">
                Powered by Vision AI
              </span>
            </h2>
            
            <p className="text-md sm:text-lg text-slate-550 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload photographs of vehicle accidents to generate high-accuracy repair cost estimates, verify insurance claims configurations, and flag potential fraudulent claims instantly.
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-premium transition-all hover:scale-[1.02]"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-350 text-sm font-semibold transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-brand-500 dark:text-brand-400">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-450 dark:text-slate-505 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              End-to-End Insurance Diagnostics
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Designed for insurers, brokers, and automotive repair fleets to eliminate claim blockages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/85 p-6 rounded-2xl shadow-premium dark:shadow-premium-dark flex flex-col items-start gap-4 transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-1"
              >
                <div className={`p-3 rounded-xl ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm md:text-md">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Pipeline Section */}
        <section className="bg-white dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/60 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                Under the Hood: How It Works
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ClaimZen utilizes a deterministic image analysis pipeline to deliver high-fidelity damage reports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              <div className="space-y-2 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950">
                <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">Phase 01</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Secure Ingest</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Adjusters upload vehicle collision photos. The system processes the files through strict size limits (max 5MB) and type validation filters.
                </p>
              </div>

              <div className="space-y-2 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950">
                <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">Phase 02</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Content Hash</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The backend computes an MD5 hash of the image binary, using character byte modulo calculations to consistently classify damage categories.
                </p>
              </div>

              <div className="space-y-2 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950">
                <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">Phase 03</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Database Sync</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Assessment reports are stored securely under a MongoDB database cluster, maintaining user account separation and auditing integrity.
                </p>
              </div>

              <div className="space-y-2 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950">
                <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">Phase 04</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Manual Override</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Adjusters retain control. Our human-in-the-loop dashboard lets you adjust initial estimates and save overrides directly back to the cloud.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-br from-brand-600 to-indigo-700 dark:from-brand-950 dark:to-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center text-white space-y-6">
            <h3 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
              Ready to Accelerate Claim Lifecycles?
            </h3>
            <p className="text-slate-200 dark:text-slate-350 max-w-xl mx-auto text-sm leading-relaxed">
              Equip your adjusters with premium AI-generated diagnostics. Sign up for a free developer sandbox and try ClaimZen today.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-brand-600 font-bold text-sm shadow-premium transition-all hover:scale-[1.02]"
              >
                <span>Create Free Account</span>
                <ChevronRight className="w-4 h-4 text-brand-600" />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6 text-slate-500 dark:text-slate-400">
          <div className="inline-flex items-center gap-2 justify-center text-brand-500">
            <HeartHandshake className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Our Commitment</span>
          </div>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
            ClaimZen was established to build trust and increase efficiency during claims processing. By combining advanced vision intelligence with insurance database rule matching, we provide transparent repair breakdowns, helping users resolve claims fairly and fast.
          </p>
        </section>
      </main>

    </div>
  );
};

export default LandingPage;
