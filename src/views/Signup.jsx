import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── SVG icon helpers ── */
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M1 9h3m16 7h1a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0017.52 7H13" />
  </svg>
);

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 placeholder-gray-400 " +
  "focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200";

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
    <div className="flex w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-white">

      {/* ── LEFT: Form panel ── */}
      <div className="flex flex-col justify-center w-full md:w-3/5 px-10 py-10 bg-white overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30">
            <CarIcon />
          </div>
          <span className="font-extrabold text-gray-800 text-base tracking-tight">RentaCar</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Create account</h1>
        <p className="text-sm text-gray-400 mb-6">Join us today and start renting in minutes.</p>

        {/* Error */}
        {errors && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {typeof errors === "object"
              ? Object.values(errors).flat().join(" · ")
              : "Something went wrong."}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <input ref={nameRef} type="text" placeholder="Full name" required className={inputCls} />
            <input ref={emailRef} type="email" placeholder="Email address" required className={inputCls} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3">
            <input ref={passwordRef} type="password" placeholder="Password" required className={inputCls} />
            <input ref={passwordConfirmationRef} type="password" placeholder="Confirm password" required className={inputCls} />
          </div>

          {/* Divider label */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Identity & Contact</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-3">
            <input ref={cinRef} type="text" placeholder="CIN number" className={inputCls} />
            <input ref={permisRef} type="text" placeholder="Driver's license" className={inputCls} />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-3">
            <input ref={phoneRef} type="tel" placeholder="Phone number" className={inputCls} />
            <input ref={addressRef} type="text" placeholder="City / Address" className={inputCls} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl tracking-wide text-sm shadow-lg shadow-blue-600/30 transition-all duration-200 disabled:opacity-60 mt-2"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Mobile CTA */}
        <p className="text-center text-xs text-gray-400 md:hidden mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">Sign In</Link>
        </p>

        {/* Feature strip */}
        <div className="mt-8 pt-5 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-400">
            {["🚗 200+ Cars", "🛡️ Full Insurance", "⚡ Instant Booking"].map((f) => (
              <span key={f} className="font-medium">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Dark panel ── */}
      <div className="hidden md:flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 relative overflow-hidden px-10 text-center py-16">
        {/* Blobs */}
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-blue-600 rounded-full opacity-20 blur-2xl" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl" />

        {/* Decorative shapes */}
        <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/10 rounded-full" />
        <div className="absolute bottom-10 right-8 w-10 h-10 border-2 border-blue-400/20 rotate-45" />
        <div className="absolute bottom-20 left-6 w-6 h-6 bg-blue-500/30 rounded-full" />
        <div className="absolute top-24 right-6 w-4 h-4 bg-white/10 rotate-12 rounded-sm" />

        {/* Car icon */}
        <div className="w-16 h-16 bg-blue-600/30 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm">
          <CarIcon />
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-3 relative z-10 leading-tight">
          Hello,<br />Friend!
        </h2>
        <p className="text-blue-200/80 text-sm mb-8 leading-relaxed relative z-10">
          Already have an account?<br />Sign in and continue your journey.
        </p>
        <Link
          to="/login"
          className="relative z-10 border-2 border-blue-400/60 text-blue-100 font-semibold py-2.5 px-9 rounded-full text-xs uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 hover:text-white active:scale-95 transition-all duration-200"
        >
          Sign In
        </Link>

        <span className="absolute bottom-4 text-[10px] text-blue-300/40 tracking-widest uppercase z-10">
          RentaCar · Premium Fleet
        </span>
      </div>
    </div>
  );
}