import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, HelpCircle, Sun, Moon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // MVP flow without backend auth: navigate directly to Chat page
    navigate('/chat');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between relative overflow-x-hidden transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-surface text-on-surface'}`}>
      {/* Ambient Radial Gradient and Dot Matrix Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 dot-pattern ${isDarkMode ? 'opacity-20' : 'opacity-60'}`} />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-indigo-100/20 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[20%] w-[500px] h-[400px] bg-gradient-to-br from-indigo-100/40 via-slate-100/30 to-transparent dark:from-indigo-950/30 dark:via-slate-900/40 dark:to-transparent rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
          <Logo size="sm" />
          <span className="text-lg font-bold text-primary tracking-tight font-sans">
            ChatFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <a
            href="#help"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Need help?</span>
          </a>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px]">
          {/* Card Container */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 sm:p-9 shadow-card transition-all duration-300">
            {/* Header Branding */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3.5">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-sm opacity-30" />
                <Logo size="lg" className="relative rounded-2xl shadow-md border-2 border-white dark:border-slate-800" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white mb-1.5 font-sans">
                Sign in to ChatFlow
              </h1>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-[320px]">
                Welcome back! Sign in to continue your conversations.
              </p>
            </div>

            {/* Social SSO Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-slate-800/80 border border-outline-variant/70 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150 group"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-xs font-semibold text-on-surface dark:text-slate-200 group-hover:text-primary transition-colors">
                  Google
                </span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-slate-800/80 border border-outline-variant/70 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150 group"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0 fill-on-surface dark:fill-slate-200 group-hover:fill-primary transition-colors"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span className="text-xs font-semibold text-on-surface dark:text-slate-200 group-hover:text-primary transition-colors">
                  GitHub
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-outline-variant/50 dark:border-slate-800" />
              <span className="absolute px-3 bg-white dark:bg-slate-900 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                or continue with
              </span>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                name="email"
                label="Email address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
                autoComplete="email"
              />

              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
                autoComplete="current-password"
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/25 cursor-pointer accent-primary"
                  />
                  <span className="text-xs text-on-surface-variant dark:text-slate-400">
                    Remember me
                  </span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-semibold text-primary hover:underline hover:text-primary-hover transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Sign In
                </Button>
              </div>
            </form>

            {/* Sign-up Link */}
            <div className="mt-6 pt-4 border-t border-outline-variant/40 dark:border-slate-800 text-center">
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                Don't have an account?{' '}
                <a
                  href="#signup"
                  onClick={(e) => e.preventDefault()}
                  className="font-semibold text-primary hover:text-primary-hover transition-colors ml-1"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>

          {/* Trust & Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-on-surface-variant dark:text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Protected by enterprise-grade end-to-end encryption</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-on-surface-variant dark:text-slate-400 border-t border-outline-variant/30 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium">System Status: All systems normal</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">
            Security
          </a>
          <span className="opacity-60">© 2024 ChatFlow Inc. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};
