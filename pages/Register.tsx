
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { supabase, formatEmail } from '../lib/supabase';
import { useLang } from '../components/LanguageContext';
import { translations } from '../lib/translations';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang];
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    referralCode: ''
  });

  const generateOtp = useCallback(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(code);
  }, []);

  useEffect(() => {
    generateOtp();
  }, [generateOtp]);

  const validatePhone = (phone: string) => {
    return /^[67]\d{8}$/.test(phone);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username.trim()) {
      setError(t.error_username);
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError(t.error_phone);
      return;
    }

    if (formData.password.length < 8) {
      setError(t.error_password);
      return;
    }

    if (userOtp !== otp) {
      setError(t.error_otp);
      generateOtp();
      setUserOtp('');
      return;
    }

    setLoading(true);
    try {
      const email = formatEmail(formData.phone);
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            phone_number: formData.phone,
            referral_code: formData.referralCode || null
          }
        }
      });

      if (signUpError) throw signUpError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || t.error_general);
      generateOtp();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t.title_register}>
      <form onSubmit={handleRegister} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Username Input */}
          <div className="relative group">
            <div className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors z-10`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              required
              placeholder={t.username_placeholder}
              className={`w-full bg-[#1e293b] border border-white/10 rounded-xl py-3.5 ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm placeholder:text-gray-600`}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

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
              minLength={8}
              placeholder={`${t.password_placeholder} (${t.password_hint})`}
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

          {/* Referral Code */}
          <div className="relative group">
            <div className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t.referral_placeholder}
              className={`w-full bg-[#1e293b] border border-white/10 rounded-xl py-3.5 ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm placeholder:text-gray-600`}
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
            />
          </div>

          {/* OTP Section */}
          <div className="flex gap-3">
            <div className="relative group flex-1">
              <div className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input
                type="text"
                required
                maxLength={4}
                placeholder={t.otp_placeholder}
                className={`w-full bg-[#1e293b] border border-white/10 rounded-xl py-3.5 ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm placeholder:text-gray-600`}
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div 
              className="flex flex-col items-center justify-center min-w-[100px] bg-gray-800 rounded-xl border border-white/5 select-none relative group cursor-pointer overflow-hidden" 
              onClick={generateOtp}
            >
               <span className="text-xl font-mono font-bold tracking-[0.2em] text-red-400 italic">
                 {otp}
               </span>
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-500/10 transition-opacity">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
               </div>
            </div>
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
              <span>{t.creating_acc}</span>
            </div>
          ) : (
            t.register_btn
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-gray-400 text-sm">
            {t.have_acc}{' '}
            <Link to="/login-page" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              {t.login_btn}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
