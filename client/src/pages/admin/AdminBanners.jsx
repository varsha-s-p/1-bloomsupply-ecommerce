import React, { useState, useEffect } from 'react';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../../utils/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '/shop', discountPercent: 0, isActive: true, order: 0 });
  const [saving, setSaving] = useState(false);

  const fetch = () => { getAllBanners().then(({ data }) => setBanners(data)).catch(console.error); };
  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditId(null); setForm({ title: '', subtitle: '', image: '', link: '/shop', discountPercent: 0, isActive: true, order: 0 }); setModalOpen(true); };
  const openEdit = (b) => { setEditId(b._id); setForm({ title: b.title, subtitle: b.subtitle, image: b.image, link: b.link, discountPercent: b.discountPercent, isActive: b.isActive, order: b.order || 0 }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) await updateBanner(editId, form); else await createBanner(form);
      setModalOpen(false); fetch();
    } catch (err) { alert('Error saving banner'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await deleteBanner(id); fetch(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-primary">Banners</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-light"><Plus size={16} /> Add</button>
      </div>
      <div className="space-y-4">
        {banners.map(b => (
          <div key={b._id} className="bg-white rounded-2xl border border-border-light overflow-hidden flex">
            <img src={b.image} alt="" className="w-48 h-28 object-cover shrink-0" />
            <div className="p-4 flex-1 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-primary">{b.title}</h3>
                <p className="text-xs text-text-muted mt-1">{b.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  {b.discountPercent > 0 && <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">{b.discountPercent}% OFF</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="text-text-muted hover:text-accent"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(b._id)} className="text-text-muted hover:text-error"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6"><h2 className="text-xl font-serif font-bold">{editId ? 'Edit' : 'Add'} Banner</h2><button onClick={() => setModalOpen(false)}><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-text-muted mb-1">Title</label><input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              <div><label className="block text-xs font-medium text-text-muted mb-1">Subtitle</label><input value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              <div><label className="block text-xs font-medium text-text-muted mb-1">Image URL</label><input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              <div><label className="block text-xs font-medium text-text-muted mb-1">Link</label><input value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-text-muted mb-1">Discount %</label><input type="number" value={form.discountPercent} onChange={(e) => setForm({...form, discountPercent: Number(e.target.value)})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
                <div><label className="block text-xs font-medium text-text-muted mb-1">Order</label><input type="number" value={form.order} onChange={(e) => setForm({...form, order: Number(e.target.value)})} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="rounded" /><span className="text-sm">Active</span></label>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-full font-semibold text-sm disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
