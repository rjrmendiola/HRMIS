import React, { useState } from 'react';
import { X, Mail, KeyRound, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordResetSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onPasswordResetSuccess,
}) => {
  const [step, setStep] = useState<'request' | 'verify' | 'new-password' | 'done'>('request');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      setError('Please provide your registered username or email.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetCode('492815'); // simulated code
      setStep('verify');
    }, 600);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode.trim().length < 4) {
      setError('Please enter the verification code.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('new-password');
    }, 500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('done');
      setTimeout(() => {
        onPasswordResetSuccess();
        onClose();
        setStep('request');
      }, 1500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#090f1d] border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-white">Reset Password</h3>
          <p className="text-xs text-slate-400 mt-1">
            Human Resource Management Information System Security
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'request' && (
            <motion.form
              key="step-request"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleRequestCode}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 pl-1">
                  Username or Work Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="e.g. rogelio or hello@reallygreatsite.com"
                    className="w-full h-11 pl-11 pr-4 rounded-full bg-[#172033] text-white text-sm border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full text-white font-medium text-sm hrmis-btn-gradient flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset PIN</span>}
              </button>
            </motion.form>
          )}

          {step === 'verify' && (
            <motion.form
              key="step-verify"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleVerifyCode}
              className="space-y-4"
            >
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/40 text-xs text-blue-200">
                A verification code was dispatched. (Demo autofilled: <b>492815</b>)
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 pl-1">
                  6-Digit Verification PIN
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="492815"
                  className="w-full h-11 px-5 rounded-full bg-[#172033] text-white text-center tracking-widest text-lg font-mono border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full text-white font-medium text-sm hrmis-btn-gradient flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify PIN</span>}
              </button>
            </motion.form>
          )}

          {step === 'new-password' && (
            <motion.form
              key="step-password"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 pl-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-11 px-5 rounded-full bg-[#172033] text-white text-sm border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 pl-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full h-11 px-5 rounded-full bg-[#172033] text-white text-sm border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full text-white font-medium text-sm hrmis-btn-gradient flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
              </button>
            </motion.form>
          )}

          {step === 'done' && (
            <motion.div
              key="step-done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-3"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-semibold text-white">Password Updated!</h4>
              <p className="text-xs text-slate-400">
                You can now log into your HRMIS account with your new credentials.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
