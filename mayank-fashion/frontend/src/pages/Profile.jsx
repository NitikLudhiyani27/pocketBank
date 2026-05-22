import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      setUser(data.user);
      toast.success('Profile updated');
    } catch { toast.error('Could not update'); }
    finally { setSaving(false); }
  };

  return (
    <div className="container-x py-10 max-w-2xl animate-fade-in">
      <h1 className="heading-display text-3xl font-bold mb-6">My Profile</h1>
      <form onSubmit={save} className="card p-6 space-y-3">
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input className="input" value={user.email} disabled />
        <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
        <button disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
