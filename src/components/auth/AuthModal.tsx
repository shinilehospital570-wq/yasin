import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DESIGNATED_ADMIN_EMAIL } from '../../services/storage';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    signup, 
    loginAsDesignatedAdmin, 
    loginAsCustomerDemo 
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (authModalMode === 'signup') {
      if (password !== confirmPassword) {
        setError('Furayaasha sirta ah isma laha (Passwords do not match).');
        setIsLoading(false);
        return;
      }
      const res = await signup(fullName, email, phone, password);
      if (!res.success) {
        setError(res.error || 'Diiwaangelintu way fashilantay.');
      }
    } else if (authModalMode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Email-ka ama furaha sirta ah waa qalad.');
      }
    } else if (authModalMode === 'forgot') {
      setResetSent(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 my-auto overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setError(null);
            setResetSent(false);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {authModalMode === 'login' && 'Gal Koontadaada (Login)'}
            {authModalMode === 'signup' && 'Fur Koonto Cusub (Sign Up)'}
            {authModalMode === 'forgot' && 'Dib u Hel Furahaaga Sirta ah'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authModalMode === 'login' && 'Ku soo dhawoow Fuad E-Commerce — Shinile, Ethiopia.'}
            {authModalMode === 'signup' && 'Geli xogtaada si aad u dalbato una la socoto alaabtaada.'}
            {authModalMode === 'forgot' && 'Geli email-kaaga si laguu soo diro tilmaamaha dib u dejinta.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {resetSent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-bold text-sm">Tilmaamaha Furaha Waa La Diray!</p>
            <p>Fadlan hubi email-kaaga ({email}) si aad dib ugu dejiso furahaaga sirta ah.</p>
            <button
              onClick={() => {
                setAuthModalMode('login');
                setResetSent(false);
              }}
              className="mt-2 text-xs font-bold text-slate-900 underline"
            >
              Ku laabo Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
            {authModalMode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Magacaaga oo Buuxa *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tusaale: Ahmed Omar Hassan"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white text-xs"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email-kaaga *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white text-xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {authModalMode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lambarka Taleefanka *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0915234567 ama +251 915..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white text-xs"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-bold text-slate-700">Furaha Sirta ah *</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('forgot')}
                      className="text-[11px] text-orange-600 hover:underline"
                    >
                      Ma ilowday furaha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white text-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            {authModalMode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Xaqiiji Furaha Sirta ah *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white text-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 disabled:bg-slate-300 mt-2"
            >
              {isLoading
                ? 'Fadlan sug...'
                : authModalMode === 'login'
                ? 'Gal Koontada'
                : authModalMode === 'signup'
                ? 'Diiwaangeli Koontada'
                : 'Soo Dir Tilmaamaha'}
            </button>
          </form>
        )}

        {/* Toggle between login and signup */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {authModalMode === 'login' ? (
            <p>
              Ma lihid koonto?{' '}
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setError(null);
                }}
                className="font-bold text-orange-600 hover:underline"
              >
                Hadda Is Diiwaangeli
              </button>
            </p>
          ) : (
            <p>
              Hore ma u lahayd koonto?{' '}
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setError(null);
                }}
                className="font-bold text-orange-600 hover:underline"
              >
                Halkan Ka Gal (Login)
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <p className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider">
            Galka Degdegga ah (Quick Test / Demo):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => loginAsDesignatedAdmin()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-1.5 transition text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>Admin (diisyasin)</span>
            </button>

            <button
              type="button"
              onClick={() => loginAsCustomerDemo()}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center justify-center gap-1.5 transition text-[11px]"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Macmiil Tijaabo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
