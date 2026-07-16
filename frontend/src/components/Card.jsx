import React from 'react';

/**
 * Premium Card wrapper.
 * Integrates outline glows on hover, rounded corners, and depth shadow transitions.
 */
export const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`card-outline-glow rounded-3xl p-6 shadow-premium dark:shadow-premium-dark ${
        onClick 
          ? 'cursor-pointer hover:shadow-premium-hover hover:-translate-y-1 active:scale-[0.99]' 
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * Premium Stat KPI card with colored icon containers, numerical stats, and subtexts.
 */
export const StatCard = ({ title, value, icon: Icon, color = 'brand', subtitle, className = '' }) => {
  const colorMaps = {
    brand: 'text-brand-600 bg-brand-50/50 border border-brand-100 dark:bg-brand-950/20 dark:border-brand-900/30 dark:text-brand-400',
    emerald: 'text-emerald-600 bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400',
    amber: 'text-amber-600 bg-amber-50/50 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400',
    rose: 'text-rose-600 bg-rose-50/50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400',
    purple: 'text-purple-600 bg-purple-50/50 border border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400',
  };

  return (
    <Card className={`flex items-center gap-5 ${className}`}>
      <div className={`p-4 rounded-2xl shrink-0 flex items-center justify-center ${colorMaps[color] || colorMaps.brand}`}>
        {Icon && <Icon className="w-5.5 h-5.5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate">{title}</p>
        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-50 mt-1 truncate">{value}</h4>
        {subtitle && (
          <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1.5 font-medium truncate">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};
