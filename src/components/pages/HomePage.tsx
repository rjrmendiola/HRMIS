import React from 'react';
import { Shield, Users, CalendarCheck, FileText, ArrowRight, CheckCircle2, Lock, Sparkles, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../types';

interface HomePageProps {
  onGoToAuth: (mode: 'LOG IN' | 'SIGN UP') => void;
  currentUser: User | null;
  onOpenPortal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onGoToAuth,
  currentUser,
  onOpenPortal,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-6xl mx-auto px-4"
    >
      {/* Hero Container */}
      <div className="rounded-[32px] bg-[#090f1d] border border-blue-900/30 p-8 sm:p-12 lg:p-14 shadow-[0_25px_60px_-15px_rgba(2,10,28,0.85),0_0_50px_-10px_rgba(26,92,206,0.25)] text-white relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Next-Generation Human Resource Management
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight font-display-serif text-white leading-[1.15]">
            Welcome to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-white">HRMIS</span>
          </h1>

          <p className="mt-5 text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-light">
            A unified, secure Human Resource Management Information System for automated employee directories, daily time record tracking, leave processing, and real-time payroll computation.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {currentUser ? (
              <button
                onClick={onOpenPortal}
                className="px-8 py-3.5 rounded-full text-sm font-semibold text-white hrmis-btn-gradient flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/40"
              >
                <span>Launch HR Management Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onGoToAuth('LOG IN')}
                  className="px-8 py-3.5 rounded-full text-sm font-semibold text-white hrmis-btn-gradient flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/40"
                >
                  <span>Log in to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onGoToAuth('SIGN UP')}
                  className="px-8 py-3.5 rounded-full text-sm font-semibold text-blue-200 bg-[#142038] hover:bg-[#1a2b4d] border border-blue-500/30 transition-all cursor-pointer"
                >
                  <span>Sign up for Account</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 pt-10 border-t border-blue-900/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#121a2d] border border-blue-900/30 hover:border-blue-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 w-fit mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Personnel Directory</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete employee records, role hierarchy, contact logs, and digital profiles.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121a2d] border border-blue-900/30 hover:border-blue-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-sky-600/20 text-sky-400 w-fit mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Live Attendance & DTR</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time clock in/out, Daily Time Record (DTR) PDF uploads, and CSC Form 48 audits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121a2d] border border-blue-900/30 hover:border-blue-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 w-fit mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Leave Credits</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamless vacation, sick, and bereavement filings with instant approval flow.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121a2d] border border-blue-900/30 hover:border-blue-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 w-fit mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Payroll & Slips</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent itemized deductions, net pay computation, and printable slips.
            </p>
          </div>
        </div>

        {/* System security status bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 bg-[#0d1627] p-4 rounded-xl border border-blue-900/40">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HRMIS Core v3.4 Production Online</span>
          </div>
          <div className="flex items-center gap-4">
            <span>256-Bit SSL Enforced</span>
            <span>•</span>
            <span>Single Sign-On (SSO) Ready</span>
            <span>•</span>
            <span>Audit Trail Enabled</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
