import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSent(true);
      // In dev (no SMTP) the API echoes a token so the flow can be tested without email infra.
      if (data.devToken) {
        setDevLink(`/reset-password?token=${data.devToken}&email=${encodeURIComponent(email)}`);
      }
      toast.success('If that account exists, a reset link has been sent.');
    } catch {
      toast.error('Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="container-x py-16 max-w-md mx-auto animate-fade-in">
      <form onSubmit={submit} className="card p-8">
        <div className="inline-flex bg-brand-50 dark:bg-ink-700 text-brand-600 p-3 rounded-2xl mb-4">
          <Mail size={22} />
        </div>
        <h1 className="heading-display text-3xl font-bold">Forgot password?</h1>
        <p className="text-sm text-gray-500 mt-1">No worries — enter your email and we'll send you a reset link.</p>
        <input
          className="input mt-5" type="email" placeholder="Your email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading} className="btn-primary w-full mt-4">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {sent && (
          <div className="mt-5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-lg">
            Check your inbox for the reset link.
            {devLink && (
              <>
                <br /><span className="text-xs opacity-70">[Dev only — SMTP not configured]:</span>{' '}
                <Link to={devLink} className="text-brand-600 underline">Click here to reset</Link>
              </>
            )}
          </div>
        )}
        <p className="text-sm text-center mt-5">
          Remembered? <Link to="/login" className="text-brand-600 font-medium">Back to login</Link>
        </p>
      </form>
    </div>
  );
}
