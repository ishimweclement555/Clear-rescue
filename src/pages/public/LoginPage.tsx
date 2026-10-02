import React, { useState } from 'react';
import { ShieldAlert, Flame, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginProps {
  setCurrentTab: (tab: string) => void;
}

export const LoginPage: React.FC<LoginProps> = ({ setCurrentTab }) => {
  const { loginWithGoogle, loginAsDemoUser, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    // Determine demo role from email or default to customer
    if (email.includes('admin')) {
      loginAsDemoUser('admin');
      setCurrentTab('admin-dashboard');
    } else if (email.includes('tech')) {
      loginAsDemoUser('technician');
      setCurrentTab('technician-dashboard');
    } else {
      loginAsDemoUser('customer');
      setCurrentTab('customer-dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      setCurrentTab('customer-dashboard');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Google sign-in was cancelled or failed.');
    }
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    loginAsDemoUser(role);
    if (role === 'customer') setCurrentTab('customer-dashboard');
    if (role === 'technician') setCurrentTab('technician-dashboard');
    if (role === 'admin' || role === 'superadmin') setCurrentTab('admin-dashboard');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-900/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">
            CLEAR RESCUE <span className="text-orange-500">AI</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access your environmental emergency monitoring portal
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google Sign-In</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px bg-slate-800 flex-1" />
            <span>or sign in with credentials</span>
            <span className="h-px bg-slate-800 flex-1" />
          </div>

          {/* Email Password Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@organization.rw"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-400 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentTab('forgot-password')}
                  className="text-orange-400 hover:text-orange-300"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 transition-all cursor-pointer"
            >
              Sign In to Clear Rescue
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2 text-center">
              Quick Role Switch for Review / Evaluation
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('customer')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-left cursor-pointer transition-colors"
              >
                <span className="font-bold text-emerald-400 block">Customer</span>
                <span className="text-[10px] text-slate-400">Kigali Office</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('technician')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-left cursor-pointer transition-colors"
              >
                <span className="font-bold text-amber-400 block">Technician</span>
                <span className="text-[10px] text-slate-400">Diagnostics</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('admin')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-left cursor-pointer transition-colors"
              >
                <span className="font-bold text-orange-400 block">Admin</span>
                <span className="text-[10px] text-slate-400">Full Fleet Control</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('superadmin')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-left cursor-pointer transition-colors"
              >
                <span className="font-bold text-purple-400 block">Super Admin</span>
                <span className="text-[10px] text-slate-400">Multi-Org Config</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setCurrentTab('register')}
              className="text-orange-400 hover:text-orange-300 font-semibold"
            >
              Register your organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
