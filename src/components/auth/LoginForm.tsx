import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginFormProps {
  onSuccess: (username: string, remember: boolean) => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToSignUp,
  onForgotPassword,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load remembered username if exists
  useEffect(() => {
    const saved = localStorage.getItem('hrmis_remembered_user');
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username or work email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Check stored custom registered users or default accounts
      const storedUsersRaw = localStorage.getItem('hrmis_registered_users');
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const matchedCustomUser = storedUsers.find(
        (u: any) =>
          u.username.toLowerCase() === username.trim().toLowerCase() ||
          u.email.toLowerCase() === username.trim().toLowerCase()
      );

      // Verify credentials
      if (
        username.trim().toLowerCase() === 'rogelio' ||
        username.trim().toLowerCase() === 'admin' ||
        username.trim().toLowerCase() === 'hello@reallygreatsite.com' ||
        matchedCustomUser
      ) {
        if (matchedCustomUser && matchedCustomUser.password !== password && password !== 'password123') {
          setIsLoading(false);
          setErrorMessage('Invalid password for this account.');
          return;
        }

        if (rememberMe) {
          localStorage.setItem('hrmis_remembered_user', username.trim());
        } else {
          localStorage.removeItem('hrmis_remembered_user');
        }

        setIsLoading(false);
        onSuccess(username.trim(), rememberMe);
      } else {
        // Allow login with any mock username/password if testing, or alert
        if (password.length >= 6) {
          if (rememberMe) {
            localStorage.setItem('hrmis_remembered_user', username.trim());
          }
          setIsLoading(false);
          onSuccess(username.trim(), rememberMe);
        } else {
          setIsLoading(false);
          setErrorMessage('Invalid credentials. Password must be at least 6 characters, or click Demo Login.');
        }
      }
    }, 600);
  };

  const handleDemoFill = () => {
    setUsername('rogelio');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[430px] mx-auto"
    >
      {/* Dark Centered Prototype Card */}
      <div className="relative rounded-[32px] bg-[#090f1d] border border-blue-900/30 p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(2,10,28,0.85),0_0_50px_-10px_rgba(26,92,206,0.3)]">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-[34px] font-normal text-white tracking-wide font-display-serif">
            Log in
          </h2>
        </div>

        {/* Quick Demo Helper Hint */}
        <div className="mb-6 flex items-center justify-between p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/30 text-xs">
          <div className="flex items-center gap-1.5 text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">Demo: <b>rogelio</b> / <b>password123</b></span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-2 shrink-0"
          >
            Auto Fill
          </button>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full h-12 px-5 rounded-full bg-[#172033] text-white placeholder-slate-400 text-sm border border-blue-900/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Input with Lock & Eye */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <div className="absolute left-4.5 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-12 pl-12 pr-12 rounded-full bg-[#172033] text-white placeholder-slate-400 text-sm border border-blue-900/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1 pb-2 px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                  rememberMe
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-[#172033] border border-blue-800/60 hover:border-blue-500'
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="italic font-light text-slate-300">Remember Me</span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="italic font-light text-blue-300/90 hover:text-blue-200 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Log in Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full text-white font-medium text-sm hrmis-btn-gradient flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Log in</span>
            )}
          </button>
        </form>

        {/* Bottom Card Divider & Switch to Sign up */}
        <div className="mt-8 pt-5 border-t border-blue-900/30 text-center text-xs text-slate-400">
          <span>or </span>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer ml-0.5"
          >
            Sign up
          </button>
        </div>

      </div>
    </motion.div>
  );
};
