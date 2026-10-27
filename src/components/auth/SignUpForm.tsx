import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../types';

interface SignUpFormProps {
  onSuccess: (newUser: User) => void;
  onSwitchToLogin: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePreFill = () => {
    setFullName('Rogelio Mendiola Jr.');
    setEmail('hello@reallygreatsite.com');
    setPassword('password123');
    setConfirmPassword('password123');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid work email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Create user object
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: fullName.trim(),
        username: username || 'user',
        email: email.trim().toLowerCase(),
        role: 'Employee',
        department: 'Operations & Strategy',
        position: 'HR Associate Specialist',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      };

      // Save to localStorage for registered users list
      try {
        const storedUsersRaw = localStorage.getItem('hrmis_registered_users');
        const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        storedUsers.push({
          ...newUser,
          password: password,
        });
        localStorage.setItem('hrmis_registered_users', JSON.stringify(storedUsers));
      } catch (err) {
        console.error('Error saving user', err);
      }

      setIsLoading(false);
      onSuccess(newUser);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[450px] mx-auto"
    >
      {/* Dark Centered Prototype Card */}
      <div className="relative rounded-[32px] bg-[#090f1d] border border-blue-900/30 p-8 sm:p-9 shadow-[0_25px_60px_-15px_rgba(2,10,28,0.85),0_0_50px_-10px_rgba(26,92,206,0.3)]">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-[34px] font-normal text-white tracking-wide font-display-serif">
            Sign up
          </h2>
        </div>

        {/* Quick sample populate hint matching prototype values */}
        <div className="mb-5 flex items-center justify-between p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/30 text-xs">
          <span className="text-blue-200 text-[11px]">Click to use prototype values</span>
          <button
            type="button"
            onClick={handlePreFill}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            Fill Prototype Values
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-normal text-slate-300 pl-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rogelio Mendiola Jr."
              className="w-full h-11 px-5 rounded-full bg-[#172033] text-white placeholder-slate-400 text-sm border border-blue-900/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-normal text-slate-300 pl-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@reallygreatsite.com"
              className="w-full h-11 px-5 rounded-full bg-[#172033] text-white placeholder-slate-400 text-sm border border-blue-900/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Password & Confirm Password Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-normal text-slate-300 pl-1">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-4 pr-10 rounded-full bg-[#172033] text-white placeholder-slate-400 text-sm border border-blue-900/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-normal text-slate-300 pl-1">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-4 pr-10 rounded-full bg-[#172033] text-white placeholder-slate-400 text-sm border border-blue-900/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full text-white font-medium text-sm hrmis-btn-gradient flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Bottom Card Divider & Switch to Log in */}
        <div className="mt-7 pt-4 border-t border-blue-900/30 text-center text-xs text-slate-400">
          <span>or </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer ml-0.5"
          >
            Log in
          </button>
        </div>

      </div>
    </motion.div>
  );
};
