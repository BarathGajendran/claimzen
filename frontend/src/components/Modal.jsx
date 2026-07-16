import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable modal overlay component.
 * Features: focus lock escape, backdrop click closability, blur filters, and size options.
 */
const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  // Lock scroll and register escape key bind
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Container */}
      <div
        className={`relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl w-full ${sizeClasses[size] || sizeClasses.md} shadow-premium dark:shadow-premium-dark overflow-hidden animate-fade-in z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] text-slate-600 dark:text-slate-350">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
