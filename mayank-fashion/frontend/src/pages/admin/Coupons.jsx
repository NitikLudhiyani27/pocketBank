import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', type: 'percent', value: 10, minOrder: 0, maxDiscount: 0 });

  const load = () => api.get('/coupons').then(({ data }) => setCoupons(data.coupons));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', form);
      toast.success('Coupon created');
      setForm({ code: '', type: 'percent', value: 10, minOrder: 0, maxDiscount: 0 });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/coupons/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="heading-display text-xl font-bold">Coupons</h2>
      <form onSubmit={create} className="card p-5 grid sm:grid-cols-5 gap-3">
        <input className="input" placeholder="CODE" required value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="percent">Percent</option>
          <option value="flat">Flat</option>
        </select>
        <input className="input" type="number" placeholder="Value" value={form.value}
          onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
        <input className="input" type="number" placeholder="Min Order" value={form.minOrder}
          onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
        <button className="btn-primary"><Plus size={14} /> Add</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-ink-700/60 text-left">
            <tr><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Value</th><th className="p-3">Min Order</th><th className="p-3">Used</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-t border-gray-50 dark:border-ink-700">
                <td className="p-3 font-mono font-semibold">{c.code}</td>
                <td className="p-3">{c.type}</td>
                <td className="p-3">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="p-3">₹{c.minOrder}</td>
                <td className="p-3">{c.usedCount}</td>
                <td className="p-3">
                  <button onClick={() => remove(c._id)} className="text-red-500 p-1"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
