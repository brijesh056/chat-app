import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axios";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your conversations.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} className={inputClass} />
        </div>

        <button disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 transition">
          {submitting && <Spinner size="sm" />} Log in
        </button>

        <p className="text-sm text-center text-slate-500">
          New here? <Link to="/register" className="text-brand-700 font-semibold hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
