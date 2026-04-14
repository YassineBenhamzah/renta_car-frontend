import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axios";
import { useAuth } from "../context/AuthContext";

/* ── SVG icon helpers ── */
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M1 9h3m16 7h1a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0017.52 7H13" />
  </svg>
);

const inputCls =
  "w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 placeholder-gray-400 " +
  "focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setErrors(null);
    axiosClient
      .post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then(({ data }) => login(data.token, data.user))
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) setErrors(res.data.errors);
        else setErrors({ email: [res?.data?.message ?? "Login failed."] });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-white">

      {/* ── LEFT: Dark panel ── */}
      <div className="hidden md:flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 relative overflow-hidden px-10 text-center py-16">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-600 rounded-full opacity-20 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-700 rounded-full opacity-10 blur-3xl" />

        {/* Decorative geometric shapes */}
        <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/10 rounded-full" />
        <div className="absolute bottom-10 left-8 w-10 h-10 border-2 border-blue-400/20 rotate-45" />
        <div className="absolute bottom-20 right-6 w-6 h-6 bg-blue-500/30 rounded-full" />
        <div className="absolute top-24 left-6 w-4 h-4 bg-white/10 rotate-12 rounded-sm" />

        {/* Car silhouette icon */}
        <div className="w-16 h-16 bg-blue-600/30 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm">
          <CarIcon />
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-3 relative z-10 leading-tight">
          Welcome<br />Back!
        </h2>
        <p className="text-blue-200/80 text-sm mb-8 leading-relaxed relative z-10">
          Enter your credentials and<br />start your journey with us
        </p>
        <Link
          to="/signup"
          className="relative z-10 border-2 border-blue-400/60 text-blue-100 font-semibold py-2.5 px-9 rounded-full text-xs uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 hover:text-white active:scale-95 transition-all duration-200"
        >
          Sign Up
        </Link>

        {/* bottom tag */}
        <span className="absolute bottom-4 text-[10px] text-blue-300/40 tracking-widest uppercase z-10">
          RentaCar · Premium Fleet
        </span>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div className="flex flex-col justify-center w-full md:w-3/5 px-10 py-12 bg-white">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30">
            <CarIcon />
          </div>
          <span className="font-extrabold text-gray-800 text-base tracking-tight">RentaCar</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Sign in</h1>
        <p className="text-sm text-gray-400 mb-8">Welcome back! Please enter your details.</p>

        {/* Error */}
        {errors && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {errors.email?.[0] ?? "Something went wrong."}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MailIcon /></span>
            <input ref={emailRef} type="email" placeholder="Email address" required className={inputCls} />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><LockIcon /></span>
            <input ref={passwordRef} type="password" placeholder="Password" required className={inputCls} />
          </div>

          {/* Forgot */}
          <div className="text-right">
            <span className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors">
              Forgot your password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl tracking-wide text-sm shadow-lg shadow-blue-600/30 transition-all duration-200 disabled:opacity-60 mt-2"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Mobile CTA */}
        <p className="text-center text-xs text-gray-400 md:hidden mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">Sign Up</Link>
        </p>

        {/* Divider with features */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-400">
            {["🚗 200+ Cars", "🛡️ Insured", "⚡ Fast Booking"].map((f) => (
              <span key={f} className="font-medium">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}