
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLang } from '../components/LanguageContext';
import { translations } from '../lib/translations';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const t = translations[lang];

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login-page');
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login-page');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 lg:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-1/3 h-1/3 bg-red-600/5 blur-[120px] rounded-full`}></div>
      
      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.welcome}</h1>
            <p className="text-gray-400">{t.account}: +212 {user?.user_metadata?.phone_number || user?.email?.split('@')[0]}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <button 
              onClick={handleSignOut}
              className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-medium"
            >
              {t.sign_out}
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1e293b] border border-white/5 p-8 rounded-3xl col-span-1 md:col-span-2">
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
               </div>
               <p className="text-xl font-semibold text-gray-300">{t.dashboard_title}</p>
               <p className="text-gray-500 text-sm mt-2 text-center max-w-sm px-4">
                 {t.dashboard_desc}
               </p>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <h3 className="text-lg font-bold text-white mb-2">{t.energy_status}</h3>
             <p className="text-red-400 font-mono text-2xl">{t.connected}</p>
             <div className="mt-6 pt-6 border-t border-white/5 w-full">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{t.efficiency}</span>
                  <span>94%</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[94%]"></div>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
