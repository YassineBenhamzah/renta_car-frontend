import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  // New fields
  const roleRef = useRef(); // role (user by default, maybe allow agent?)
  const phoneRef = useRef();
  const cinRef = useRef();
  const permisRef = useRef();
  const addressRef = useRef();

  const { register } = useAuth();
  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
      // Optional: allow user to select role or default to 'user'
      role: 'user',
      phone: phoneRef.current.value,
      cin: cinRef.current.value,
      permis: permisRef.current.value,
      address: addressRef.current.value,
    };

    register(payload)
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold mb-4">Create Account</h2>
      {errors && <div className="bg-red-50 text-red-500 text-sm p-4 rounded mb-4 border border-red-100">{JSON.stringify(errors)}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <input ref={nameRef} type="text" placeholder="Full Name" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
        <input ref={emailRef} type="email" placeholder="Email Address" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
        <div className="grid grid-cols-2 gap-4">
          <input ref={passwordRef} type="password" placeholder="Password" className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          <input ref={passwordConfirmationRef} type="password" placeholder="Confirm" className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-2 gap-4">
          <input ref={cinRef} type="text" placeholder="CIN" className="border p-2 rounded" />
          <input ref={permisRef} type="text" placeholder="License (Permis)" className="border p-2 rounded" />
        </div>
        <input ref={phoneRef} type="text" placeholder="Phone Number" className="w-full border p-2 rounded" />
        <input ref={addressRef} type="text" placeholder="Address" className="w-full border p-2 rounded" />

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">Sign Up</button>

        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
        </p>
      </form>
    </div>
  );
}