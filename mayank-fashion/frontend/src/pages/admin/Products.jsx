import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const empty = {
  name: '', category: '', price: 0, mrp: 0, stock: 0, description: '',
  images: [''], sizes: '', colors: '', tags: '', featured: false, trending: false,
};

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => api.get('/products?limit=100').then(({ data }) => setItems(data.items));

  useEffect(() => {
    load();
    api.get('/products/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  const startEdit = (p) => {
    setEditing(p ? {
      ...p,
      sizes: (p.sizes || []).join(', '),
      colors: (p.colors || []).join(', '),
      tags: (p.tags || []).join(', '),
      images: p.images?.length ? p.images : [''],
    } : { ...empty });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...editing,
      sizes: editing.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: editing.colors.split(',').map((s) => s.trim()).filter(Boolean),
      tags: editing.tags.split(',').map((s) => s.trim()).filter(Boolean),
      images: editing.images.filter(Boolean),
      price: Number(editing.price),
      mrp: Number(editing.mrp),
      stock: Number(editing.stock),
    };
    try {
      if (editing._id) await api.put(`/products/${editing._id}`, payload);
      else await api.post('/products', payload);
      toast.success('Saved');
      setOpen(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-display text-xl font-bold">Products ({items.length})</h2>
        <button onClick={() => startEdit(null)} className="btn-primary"><Plus size={16} /> New Product</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-ink-700/60 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Flags</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-t border-gray-50 dark:border-ink-700">
                <td className="p-3 flex items-center gap-2">
                  <img src={p.images?.[0]} className="w-10 h-12 object-cover rounded" alt="" />
                  <div className="line-clamp-1 max-w-[200px]">{p.name}</div>
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  <span className={p.stock <= 5 ? 'text-red-600 font-medium' : ''}>{p.stock}</span>
                </td>
                <td className="p-3 text-xs">
                  {p.featured && <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded mr-1">Featured</span>}
                  {p.trending && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Trending</span>}
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => startEdit(p)} className="text-brand-600 hover:bg-brand-50 dark:hover:bg-ink-700 p-1.5 rounded"><Edit2 size={14} /></button>
                  <button onClick={() => remove(p._id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-ink-700 p-1.5 rounded"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="card p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{editing._id ? 'Edit Product' : 'New Product'}</h3>
              <button type="button" onClick={() => setOpen(false)}><X size={18} /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input sm:col-span-2" placeholder="Name *" required
                value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <select className="input" required value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                <option value="">Category *</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="input" type="number" placeholder="Stock" value={editing.stock}
                onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
              <input className="input" type="number" placeholder="Price *" required value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
              <input className="input" type="number" placeholder="MRP *" required value={editing.mrp}
                onChange={(e) => setEditing({ ...editing, mrp: e.target.value })} />
              <input className="input sm:col-span-2" placeholder="Sizes (comma-separated, e.g. S, M, L)"
                value={editing.sizes} onChange={(e) => setEditing({ ...editing, sizes: e.target.value })} />
              <input className="input sm:col-span-2" placeholder="Colors (comma-separated)"
                value={editing.colors} onChange={(e) => setEditing({ ...editing, colors: e.target.value })} />
              <input className="input sm:col-span-2" placeholder="Tags (comma-separated)"
                value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} />
              <textarea className="input sm:col-span-2" rows="3" placeholder="Description"
                value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Image URLs</label>
                {editing.images.map((url, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="input" placeholder={`Image ${i + 1}`} value={url}
                      onChange={(e) => {
                        const imgs = [...editing.images]; imgs[i] = e.target.value;
                        setEditing({ ...editing, images: imgs });
                      }} />
                    <button type="button" onClick={() => {
                      const imgs = editing.images.filter((_, idx) => idx !== i);
                      setEditing({ ...editing, images: imgs.length ? imgs : [''] });
                    }} className="btn-ghost !p-2"><X size={14} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setEditing({ ...editing, images: [...editing.images, ''] })}
                  className="text-brand-600 text-sm">+ Add image</button>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.trending}
                  onChange={(e) => setEditing({ ...editing, trending: e.target.checked })} /> Trending
              </label>
            </div>
            <button className="btn-primary w-full mt-5">Save Product</button>
          </form>
        </div>
      )}
    </div>
  );
}
