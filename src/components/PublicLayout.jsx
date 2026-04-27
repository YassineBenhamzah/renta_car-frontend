import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function PublicLayout() {
  const { token, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* HEADER */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-bg-darker/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-primary flex items-center justify-center font-bold text-xl text-primary tracking-tighter">
              Y/B
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-extrabold tracking-widest ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>YASSINE<span className="text-primary">BENHAMZAH</span></span>
              <span className={`text-[10px] tracking-widest uppercase ${scrolled ? 'text-gray-500' : 'text-gray-300'}`}>Premium Fleet</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>{t('nav.home')}</Link>
            <a href="/#cars" className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>{t('nav.cars')}</a>
            <a href="/#about" className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>{t('nav.about')}</a>
            <a href="/#faq" className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>{t('nav.faq')}</a>
          </nav>

          {/* Controls & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className={`hover:text-primary transition-colors ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
              {theme === "dark" ? '☀️' : '🌙'}
            </button>

            {/* Language Toggle */}
            <div className="flex gap-2 text-xs font-bold">
              <button 
                onClick={() => changeLanguage('en')} 
                className={`${i18n.language === 'en' ? 'text-primary' : (scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white')} hover:text-primary transition-colors`}
              >EN</button>
              <span className={scrolled ? 'text-gray-400' : 'text-gray-400'}>|</span>
              <button 
                onClick={() => changeLanguage('fr')} 
                className={`${i18n.language === 'fr' ? 'text-primary' : (scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white')} hover:text-primary transition-colors`}
              >FR</button>
            </div>

            {/* Auth */}
            <div className="flex items-center space-x-4">
              {token ? (
                <>
                  <Link to="/dashboard" className={`text-xs font-bold hover:text-primary transition ${scrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`}>{t('nav.dashboard')}</Link>
                  <button onClick={logout} className="text-red-500 hover:text-red-400 text-xs font-bold">{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`hover:text-primary transition font-bold text-xs ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>{t('nav.login')}</Link>
                  <Link to="/signup" className="px-5 py-2.5 bg-primary text-bg-darker text-xs font-extrabold tracking-wider rounded border border-primary hover:bg-transparent hover:text-primary transition-all">
                    {t('nav.signup')}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Burger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 z-[60] relative transition-colors ${(scrolled || mobileOpen) ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-0 bg-white/95 dark:bg-bg-darker/95 backdrop-blur-xl z-50 transition-all duration-500 ease-in-out flex flex-col justify-center items-center ${mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
            <nav className="flex flex-col items-center space-y-8 w-full px-6">
                <Link to="/" onClick={() => setMobileOpen(false)} className="text-gray-900 dark:text-white font-black text-3xl tracking-widest uppercase hover:text-primary transition">{t('nav.home')}</Link>
                <a href="/#cars" onClick={() => setMobileOpen(false)} className="text-gray-900 dark:text-white font-black text-3xl tracking-widest uppercase hover:text-primary transition">{t('nav.cars')}</a>
                <a href="/#about" onClick={() => setMobileOpen(false)} className="text-gray-900 dark:text-white font-black text-3xl tracking-widest uppercase hover:text-primary transition">{t('nav.about')}</a>
                <a href="/#faq" onClick={() => setMobileOpen(false)} className="text-gray-900 dark:text-white font-black text-3xl tracking-widest uppercase hover:text-primary transition">{t('nav.faq')}</a>
                
                <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 my-4"></div>

                <div className="flex gap-8">
                    <button onClick={toggleTheme} className="text-gray-900 dark:text-white font-bold text-lg">
                        {theme === "dark" ? '☀️' : '🌙'}
                    </button>
                    <div className="flex gap-4">
                        <button onClick={() => { changeLanguage('en'); setMobileOpen(false); }} className={`font-bold text-lg ${i18n.language === 'en' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>EN</button>
                        <button onClick={() => { changeLanguage('fr'); setMobileOpen(false); }} className={`font-bold text-lg ${i18n.language === 'fr' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>FR</button>
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-6 pt-8 w-full max-w-xs">
                {token ? (
                    <>
                        <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="w-full text-center py-4 bg-primary text-black font-extrabold uppercase tracking-widest">{t('nav.dashboard')}</Link>
                        <button onClick={() => { logout(); setMobileOpen(false); }} className="text-red-500 font-bold uppercase tracking-widest">{t('nav.logout')}</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest hover:text-primary transition">{t('nav.login')}</Link>
                        <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full text-center py-4 bg-primary text-black font-extrabold uppercase tracking-widest hover:opacity-90">{t('nav.signup')}</Link>
                    </>
                )}
                </div>
            </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-bg-darker text-white py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand / Logo */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 border-2 border-primary flex justify-center items-center font-bold text-xl text-primary">
                  Y/B
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-widest leading-none">YASSINE<span className="text-primary">BENHAMZAH</span></span>
                  <span className="text-xs text-gray-400 tracking-widest uppercase mt-1">Premium Fleet</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs">Privacy Policy</p>
            </div>

            {/* Address */}
            <div className="md:col-span-1 flex flex-col space-y-2">
              <p className="text-sm font-bold tracking-wider">{t('footer.address')}</p>
              <p className="text-sm font-bold tracking-wider text-gray-300">{t('footer.phone')}</p>
              <p className="text-sm tracking-wider text-gray-400">{t('footer.email')}</p>
              <div className="flex gap-4 mt-6">
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm hover:bg-primary hover:text-black transition cursor-pointer">f</span>
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm hover:bg-primary hover:text-black transition cursor-pointer">in</span>
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm hover:bg-primary hover:text-black transition cursor-pointer">ig</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <form className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Name" className="bg-transparent border border-gray-700 px-4 py-3 text-sm focus:border-primary focus:outline-none placeholder-gray-600 transition" />
                <textarea placeholder="Message" rows="3" className="bg-transparent border border-gray-700 px-4 py-3 text-sm focus:border-primary focus:outline-none placeholder-gray-600 transition col-span-1 row-span-3"></textarea>
                <input type="email" placeholder="Email" className="bg-transparent border border-gray-700 px-4 py-3 text-sm focus:border-primary focus:outline-none placeholder-gray-600 transition" />
                <input type="text" placeholder="Phone" className="bg-transparent border border-gray-700 px-4 py-3 text-sm focus:border-primary focus:outline-none placeholder-gray-600 transition" />
                <div className="col-span-2 flex justify-end mt-2">
                  <button type="button" className="px-10 py-3 bg-primary text-black font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-16 text-center md:text-right">
            <p className="text-gray-600 text-xs tracking-wider">{t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}