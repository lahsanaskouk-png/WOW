
import React from 'react';
import { useLang } from './LanguageContext';
import { translations } from '../lib/translations';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const { lang, setLang } = useLang();
  const t = translations[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-[#0f172a] relative overflow-hidden">
      {/* Language Switcher */}
      <div className="absolute top-6 left-6 right-6 flex justify-end z-50">
        <button
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="bg-[#1e293b] border border-white/10 px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all text-red-400 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      {/* Decorative background elements */}
      <div className={`absolute top-[-10%] ${lang === 'ar' ? 'right-[-10%]' : 'left-[-10%]'} w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none`}></div>
      <div className={`absolute bottom-[-10%] ${lang === 'ar' ? 'left-[-10%]' : 'right-[-10%]'} w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full pointer-events-none`}></div>

      <div className="w-full max-w-[420px] z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 mb-4 transform -rotate-12">
            <svg className="w-10 h-10 text-white transform rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
        </div>
        
        <div className="bg-[#1e293b] rounded-3xl p-8 shadow-2xl border border-white/5 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
