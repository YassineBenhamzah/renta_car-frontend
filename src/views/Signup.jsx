import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const phoneRef = useRef();
  const cinRef = useRef();
  const permisRef = useRef();
  const addressRef = useRef();

  const { register } = useAuth();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng) => { i18n.changeLanguage(lng); };

  const inputCls = "w-full border-b border-gray-300 dark:border-gray-700 bg-transparent px-2 py-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary dark:focus:border-primary transition-all duration-300 tracking-wider rounded-none focus:ring-0";

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setErrors(null);
    register({
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
      role: "user",
      phone: phoneRef.current.value,
      cin: cinRef.current.value,
      permis: permisRef.current.value,
      address: addressRef.current.value,
    })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) setErrors(res.data.errors);
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

      <div className="flex w-full max-w-6xl md:rounded shadow-2xl bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 relative z-10 overflow-hidden min-h-screen md:min-h-[85vh] transition-colors duration-300">
        
        {/* ── LEFT: Cinematic Background ── */}
        <div className="hidden md:flex flex-col items-center justify-end w-2/5 relative bg-black p-12 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=2000" alt="Luxury Ride" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-black/40 to-transparent dark:from-[#050505]/90 dark:via-[#050505]/40 light:from-white/90"></div>
          
          <div className="relative z-10 text-center w-full pb-10">
             <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest w-full drop-shadow-lg">
               {t('auth.joinPremium')} <br/><span className="text-primary">{t('auth.premiumFleet')}</span>
             </h2>
             <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase mt-6 leading-relaxed drop-shadow-md">
               {t('auth.signupDesc')}
             </p>
          </div>
        </div>

        {/* ── RIGHT: Form panel ── */}
        <div className="flex flex-col justify-center w-full md:w-3/5 px-8 py-16 md:px-16 overflow-y-auto max-h-screen">
          
          <Link to="/" className="flex items-center gap-3 mb-10 w-fit hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 border-2 border-primary flex justify-center items-center font-bold text-xl text-primary">Y/B</div>
            <div className="flex flex-col">
              <span className="text-xl text-gray-900 dark:text-white font-black tracking-widest leading-none">YASSINE<span className="text-primary">BENHAMZAH</span></span>
              <span className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">{t('auth.premium')}</span>
            </div>
          </Link>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest">{t('auth.applyMembership')}</h1>
          <p className="text-primary text-xs font-bold mb-10 tracking-[0.2em] uppercase">{t('auth.setupProfile')}</p>

          {errors && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500 text-red-600 dark:text-red-500 text-[10px] tracking-widest uppercase px-4 py-3 mb-6">
              {typeof errors === "object"
                ? Object.values(errors).flat().join(" · ")
                : "Something went wrong."}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input ref={nameRef} type="text" placeholder={t('auth.fullName')} required className={inputCls} />
              <input ref={emailRef} type="email" placeholder={t('auth.email')} required className={inputCls} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input ref={passwordRef} type="password" placeholder={t('auth.password')} required className={inputCls} />
              <input ref={passwordConfirmationRef} type="password" placeholder={t('auth.confirmPassword')} required className={inputCls} />
            </div>

            <div className="flex items-center gap-4 pt-6 pb-2">
              <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">{t('auth.reqDocs')}</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input ref={cinRef} type="text" placeholder={t('auth.cin')} className={inputCls} />
              <input ref={permisRef} type="text" placeholder={t('auth.license')} className={inputCls} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input ref={phoneRef} type="tel" placeholder={t('auth.mobile')} className={inputCls} />
              <input ref={addressRef} type="text" placeholder={t('auth.address')} className={inputCls} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-black hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black font-black py-4 tracking-[0.2em] uppercase text-xs transition-all duration-300 disabled:opacity-50 mt-8 cursor-pointer active:scale-[0.98]">
              {loading ? t('auth.processing') : t('auth.requestMember')}
            </button>
          </form>

          <div className="mt-12 flex flex-col md:flex-row text-center justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-8 gap-4">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
              {t('auth.existingMember')}
            </span>
            <Link to="/login" className="text-xs text-gray-900 dark:text-white font-black tracking-widest uppercase hover:text-primary dark:hover:text-primary transition-colors">
              {t('auth.signInHere')}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}