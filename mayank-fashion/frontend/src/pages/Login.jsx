import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      nav(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container-x py-10 grid lg:grid-cols-2 gap-10 items-center min-h-[80vh] animate-fade-in">
      <div className="hidden lg:block aspect-[4/5] rounded-3xl overflow-hidden shadow-glow">
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900" alt="" className="w-full h-full object-cover" />
      </div>
      <form onSubmit={submit} className="card p-8 max-w-md w-full mx-auto">
        <h1 className="heading-display text-3xl font-bold">Welcome Back</h1>
        <p className="text-sm text-gray-500 mt-1">Login to continue shopping</p>

        <div className="mt-6 space-y-3">
          <input className="input" type="email" placeholder="Email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="relative">
            <input className="input pr-10" type={show ? 'text' : 'password'} placeholder="Password" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <button disabled={loading} className="btn-primary w-full mt-6">
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-center mt-5">
          New to Mayank Fashion? <Link to="/signup" className="text-brand-600 font-medium">Create account</Link>
        </p>
        <div className="mt-5 text-xs text-gray-500 bg-brand-50 dark:bg-ink-800 p-3 rounded-lg">
          <b>Demo:</b> demo@mayankfashion.com / demo123<br />
          <b>Admin:</b> admin@mayankfashion.com / admin123
        </div>
      </form>
    </div>
  );
}
