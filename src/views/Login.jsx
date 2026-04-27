import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="square" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="square" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng) => { i18n.changeLanguage(lng); };

  const inputCls = "w-full border-b border-gray-300 dark:border-gray-700 bg-transparent pl-9 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary dark:focus:border-primary transition-all duration-300 rounded-none focus:ring-0";

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setErrors(null);
    axiosClient.post("/login", { email: emailRef.current.value, password: passwordRef.current.value })
      .then(({ data }) => login(data.token, data.user))
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) setErrors(res.data.errors);
        else setErrors({ email: [res?.data?.message ?? "Login failed."] });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-[#050505] items-center justify-center p-0 md:p-6 transition-colors duration-300 relative">
      
      {/* Absolute Back Button */}
      <div className="absolute top-6 left-6 z-50">
          <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-widest hover:text-primary dark:hover:text-primary transition-colors cursor-pointer drop-shadow-md bg-white/50 dark:bg-black/50 backdrop-blur-md px-4 py-2 hover:bg-white dark:hover:bg-black">
              <span>←</span> Return to Home
          </Link>
      </div>

      {/* Absolute Toggles */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-6">
          <button onClick={toggleTheme} className="text-gray-900 dark:text-white font-bold text-xl drop-shadow-md cursor-pointer hover:opacity-75 transition-opacity">
              {theme === "dark" ? '☀️' : '🌙'}
          </button>
          <div className="flex gap-4 drop-shadow-md">
              <button onClick={() => changeLanguage('en')} className={`font-bold text-sm cursor-pointer hover:opacity-75 transition-opacity ${i18n.language === 'en' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>EN</button>
              <button onClick={() => changeLanguage('fr')} className={`font-bold text-sm cursor-pointer hover:opacity-75 transition-opacity ${i18n.language === 'fr' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>FR</button>
          </div>
      </div>

      <div className="flex w-full max-w-5xl md:rounded shadow-2xl bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 relative z-10 overflow-hidden min-h-screen md:min-h-0 transition-colors duration-300">
        
        {/* ── LEFT: Form panel ── */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-8 py-16 md:px-16">
          
          <Link to="/" className="flex items-center gap-3 mb-16 w-fit hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 border-2 border-primary flex justify-center items-center font-bold text-xl text-primary">Y/B</div>
            <div className="flex flex-col">
              <span className="text-xl text-gray-900 dark:text-white font-black tracking-widest leading-none">YASSINE<span className="text-primary">BENHAMZAH</span></span>
              <span className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">{t('auth.premium')}</span>
            </div>
          </Link>

          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest">{t('auth.signInTitle')}</h1>
          <p className="text-xs text-primary font-bold mb-10 tracking-[0.2em] uppercase">{t('auth.signInWelcome')}</p>

          {errors && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500 text-red-600 dark:text-red-500 text-[10px] tracking-widest uppercase px-4 py-3 mb-6">
              {errors.email?.[0] ?? "Something went wrong."}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="relative group">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 group-focus-within:text-primary transition-colors"><MailIcon /></span>
              <input ref={emailRef} type="email" placeholder={t('auth.email')} required className={inputCls} />
            </div>

            <div className="relative group">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 group-focus-within:text-primary transition-colors"><LockIcon /></span>
              <input ref={passwordRef} type="password" placeholder={t('auth.password')} required className={inputCls} />
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-500 dark:text-gray-600 hover:text-primary dark:hover:text-primary cursor-pointer font-bold tracking-widest uppercase transition-colors">
                {t('auth.forgot')}
              </span>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-transparent border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:bg-primary dark:hover:bg-primary hover:text-black dark:hover:text-black active:scale-[0.98] text-gray-900 dark:text-white font-bold py-4 tracking-[0.2em] uppercase text-xs transition-all duration-300 disabled:opacity-50 mt-4 cursor-pointer">
              {loading ? t('auth.authorizing') : t('auth.authorize')}
            </button>
          </form>

          <div className="mt-12 flex flex-col gap-4 text-center border-t border-gray-200 dark:border-gray-800 pt-8">
            <p className="text-[10px] text-gray-400 dark:text-gray-600 tracking-widest uppercase mb-1">{t('auth.newAccountText')}</p>
            <Link to="/signup" className="text-xs text-gray-900 dark:text-white font-black tracking-widest uppercase hover:text-primary transition-colors">{t('auth.createAccount')}</Link>
          </div>
        </div>

        {/* ── RIGHT: Cinematic Background ── */}
        <div className="hidden md:flex flex-col items-center justify-end w-1/2 relative bg-black p-12 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1500" alt="Luxury Car Welcome" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-black/40 to-transparent dark:from-[#050505]/90 dark:via-[#050505]/40 light:from-white/90"></div>
          
          <div className="relative z-10 text-center w-full mb-10">
             <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-widest w-full drop-shadow-lg">
               {t('auth.unleash')} <br/><span className="text-primary">{t('auth.power')}</span>
             </h2>
             <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase mt-4 drop-shadow-md">
               {t('auth.signInDesc')}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}