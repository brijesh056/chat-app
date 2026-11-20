import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axios";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p>}

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input id="name" name="name" required minLength={2} value={form.name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} className={inputClass} />
          <p className="text-xs text-slate-500 mt-1">At least 6 characters.</p>
        </div>

        <button disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 transition">
          {submitting && <Spinner size="sm" />} Create account
        </button>

        <p className="text-sm text-center text-slate-500">
          Already registered? <Link to="/login" className="text-brand-700 font-semibold hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
