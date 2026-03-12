import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function PublicLayout() {
  const { token, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            RentACar
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Home</Link>
            <a href="/#cars" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Our Cars</a>
            <a href="/#about" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">About</a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {token ? (
              <>
                <span className="text-sm font-medium text-gray-500">Hi, {user?.name}</span>
                <Link to="/dashboard" className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition">Dashboard</Link>
                <button onClick={logout} className="text-red-500 hover:text-red-700 text-sm font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm">Login</Link>
                <Link to="/signup" className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Burger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
            <nav className="flex flex-col space-y-3 pt-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium py-1">Home</Link>
              <a href="/#cars" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium py-1">Our Cars</a>
              <a href="/#about" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium py-1">About</a>
              <hr className="border-gray-100" />
              {token ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-blue-600 font-bold py-1">Dashboard</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-red-500 font-medium text-left py-1">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium py-1">Login</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-blue-600 font-bold py-1">Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">RentACar</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Your trusted partner for premium car rentals across Morocco. Quality vehicles, unbeatable prices.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-500 hover:text-white text-sm transition-colors">Home</Link></li>
                <li><a href="/#cars" className="text-gray-500 hover:text-white text-sm transition-colors">Browse Cars</a></li>
                <li><Link to="/login" className="text-gray-500 hover:text-white text-sm transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-gray-500 hover:text-white text-sm transition-colors">Register</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Services</h4>
              <ul className="space-y-2">
                <li className="text-gray-500 text-sm">Luxury Rentals</li>
                <li className="text-gray-500 text-sm">Economy Cars</li>
                <li className="text-gray-500 text-sm">Long-Term Leasing</li>
                <li className="text-gray-500 text-sm">Airport Pickup</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-500 text-sm flex items-center gap-2">📍 Casablanca, Morocco</li>
                <li className="text-gray-500 text-sm flex items-center gap-2">📞 +212 6XX-XXXXXX</li>
                <li className="text-gray-500 text-sm flex items-center gap-2">✉️ info@rentacar.ma</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs">© 2026 RentACar. All rights reserved.</p>
            <div className="flex space-x-4 text-gray-600 text-xs">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}