import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    axiosClient.post("/login", payload)
      .then(({ data }) => {
        login(data.token, data.user);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
           setErrors({email: [response.data.message]});
        }
      });
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">Sign In</h2>
      {errors && <div className="text-red-500 text-sm mb-2">{errors.email && errors.email[0]}</div>}
      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <input ref={emailRef} type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <input ref={passwordRef} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
        <p className="text-center text-sm">
            Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
        </p>
      </form>
    </div>
  );
}