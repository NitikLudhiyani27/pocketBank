import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, email, password });
      toast.success('Password updated. Please login.');
      nav('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  if (!token || !email) {
    return (
      <div className="container-x py-16 max-w-md mx-auto text-center">
        <p className="text-gray-500">Invalid reset link.</p>
        <Link to="/forgot-password" className="btn-primary mt-4 inline-flex">Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-16 max-w-md mx-auto animate-fade-in">
      <form onSubmit={submit} className="card p-8">
        <div className="inline-flex bg-brand-50 dark:bg-ink-700 text-brand-600 p-3 rounded-2xl mb-4">
          <Lock size={22} />
        </div>
        <h1 className="heading-display text-3xl font-bold">Set a new password</h1>
        <p className="text-sm text-gray-500 mt-1">For <b>{email}</b></p>
        <input className="input mt-5" type="password" placeholder="New password" required minLength={6}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="input mt-3" type="password" placeholder="Confirm password" required minLength={6}
          value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button disabled={loading} className="btn-primary w-full mt-5">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
