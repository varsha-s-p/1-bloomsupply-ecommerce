import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../utils/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', image: '', description: '', order: 0 });
  const [saving, setSaving] = useState(false);

  const fetch = () => { setLoading(true); getAllCategories().then(({ data }) => setCategories(data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditId(null); setForm({ name: '', image: '', description: '', order: 0 }); setModalOpen(true); };
  const openEdit = (c) => { setEditId(c._id); setForm({ name: c.name, image: c.image, description: c.description || '', order: c.order || 0 }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) await updateCategory(editId, form); else await createCategory(form);
      setModalOpen(false); fetch();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await deleteCategory(id); fetch(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-primary">Categories</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-light"><Plus size={16} /> Add</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(c => (
          <div key={c._id} className="bg-white rounded-2xl border border-border-light overflow-hidden">
            <div className="aspect-square"><img src={c.image} alt={c.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <h3 className="font-semibold text-sm text-primary">{c.name}</h3>
              <p className="text-xs text-text-muted mt-1 truncate">{c.description}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(c)} className="text-xs text-accent flex items-center gap-1"><Pencil size={12} /> Edit</button>
                <button onClick={() => handleDelete(c._id)} className="text-xs text-error flex items-center gap-1"><Trash2 size={12} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8">
            <div className="flex justify-between mb-6"><h2 className="text-xl font-serif font-bold">{editId ? 'Edit' : 'Add'} Category</h2><button onClick={() => setModalOpen(false)}><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-text-muted mb-1">Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              <div><label className="block text-xs font-medium text-text-muted mb-1">Image URL</label><input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              <div><label className="block text-xs font-medium text-text-muted mb-1">Description</label><input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              <div><label className="block text-xs font-medium text-text-muted mb-1">Display Order</label><input type="number" value={form.order} onChange={(e) => setForm({...form, order: Number(e.target.value)})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-full font-semibold text-sm disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
