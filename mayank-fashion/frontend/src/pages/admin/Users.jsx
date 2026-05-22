import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const load = () => api.get('/admin/users').then(({ data }) => setUsers(data.users));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <h2 className="heading-display text-xl font-bold mb-4">Customers ({users.length})</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-ink-700/60 text-left">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Joined</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-50 dark:border-ink-700">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 dark:bg-ink-700'}`}>{u.role}</span>
                </td>
                <td className="p-3 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  {u.role !== 'admin' && (
                    <button onClick={() => remove(u._id)} className="text-red-500 p-1"><Trash2 size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
