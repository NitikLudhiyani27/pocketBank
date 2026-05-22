import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created!');
      nav('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container-x py-10 grid lg:grid-cols-2 gap-10 items-center min-h-[80vh] animate-fade-in">
      <div className="hidden lg:block aspect-[4/5] rounded-3xl overflow-hidden shadow-glow">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900" alt="" className="w-full h-full object-cover" />
      </div>
      <form onSubmit={submit} className="card p-8 max-w-md w-full mx-auto">
        <h1 className="heading-display text-3xl font-bold">Create Account</h1>
        <p className="text-sm text-gray-500 mt-1">Join Mayank Fashion family</p>
        <div className="mt-6 space-y-3">
          <input className="input" placeholder="Full Name" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" type="email" placeholder="Email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password (min 6)" required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button disabled={loading} className="btn-primary w-full mt-6">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-sm text-center mt-5">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}
