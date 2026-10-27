import React from 'react';
import { ShieldCheck, Users, Clock, Award, CheckCircle, Database, Lock, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutUsPageProps {
  onGoToAuth: (mode: 'LOG IN' | 'SIGN UP') => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onGoToAuth }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-6xl mx-auto px-4"
    >
      {/* Wide dark rounded card matching prototype Screen 4 */}
      <div className="rounded-[32px] bg-[#090f1d] border border-blue-900/30 p-8 sm:p-12 shadow-[0_25px_60px_-15px_rgba(2,10,28,0.85),0_0_50px_-10px_rgba(26,92,206,0.25)] text-white">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5" />
            Enterprise Workforce Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight font-display-serif text-white">
            About HRMIS
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            The Human Resource Management Information System (HRMIS) is an integrated, secure enterprise platform designed to modernize human capital operations, streamline talent lifecycle tracking, automate attendance, and deliver accurate payroll disbursement.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-[#131b2e] border border-blue-900/30 hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Talent & Digital 201 Files</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Centralized employee profiles, compensation history, employment status, contracts, and credential audits in one unified digital directory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#131b2e] border border-blue-900/30 hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Time & Attendance</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Accurate shift tracking, clock-in verification, overtime computation, tardiness tracking, and automated timesheet reconciliation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#131b2e] border border-blue-900/30 hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Governance & Leave Approvals</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transparent multi-tier approval workflow for vacation, sick, and statutory leave credits with real-time balance calculations.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0d162a] via-[#101e38] to-[#0d162a] border border-blue-800/30 mb-10 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">99.98%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">System Availability</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">10,000+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Managed Personnel</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-sky-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Statutory Compliance</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">&lt; 1 sec</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Verification Latency</div>
          </div>
        </div>

        {/* Security & Access Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-blue-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Bank-Grade Role-Based Access Control (RBAC)</p>
              <p className="text-xs text-slate-400">Encrypted data in-transit and at-rest compliant with national data privacy standards.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onGoToAuth('LOG IN')}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white hrmis-btn-gradient cursor-pointer"
            >
              Access HR Portal
            </button>
            <button
              onClick={() => onGoToAuth('SIGN UP')}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/70 border border-blue-500/40 cursor-pointer transition-colors"
            >
              Register Account
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
