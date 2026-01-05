
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { supabase, formatEmail } from '../lib/supabase';
import { useLang } from '../components/LanguageContext';
import { translations } from '../lib/translations';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const email = formatEmail(formData.phone);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password
      });

      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(t.error_login);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t.title_login}>
      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Phone Input */}
          <div className="relative group">
            <div className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors z-10`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className={`relative flex items-center bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500/50 focus-within:border-red-500 transition-all ${lang === 'en' ? 'flex-row-reverse' : ''}`}>
               <input
                type="tel"
                maxLength={9}
                required
                placeholder={t.phone_placeholder}
                className={`w-full bg-transparent py-3.5 ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:outline-none text-sm placeholder:text-gray-600 text-left`}
                style={{ direction: 'ltr' }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              />
              <span className={`bg-gray-800 px-3 py-3.5 text-gray-400 text-sm ${lang === 'ar' ? 'border-r' : 'border-l'} border-white/5 font-mono select-none`}>
                +212
              </span>
            </div>
          </div>

          {/* Password Input with Toggle */}
          <div className="relative group">
            <div className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder={t.password_placeholder}
              className={`w-full bg-[#1e293b] border border-white/10 rounded-xl py-3.5 ${lang === 'ar' ? 'pr-12 pl-12' : 'pl-12 pr-12'} focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm placeholder:text-gray-600`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 transition-colors`}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{t.logging_in}</span>
            </div>
          ) : (
            t.login_btn
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-gray-400 text-sm">
            {t.no_acc}{' '}
            <Link to="/register" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              {t.sign_up}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
