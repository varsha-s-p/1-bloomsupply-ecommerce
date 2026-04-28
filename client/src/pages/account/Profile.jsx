import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../utils/api';
import { User, Save, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '', city: data.city || '', state: data.state || '', pincode: data.pincode || '' });
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const { data } = await updateProfile(form);
      updateUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-8">My Profile</h1>

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-light">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <User size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">{user?.name}</h3>
              <p className="text-sm text-text-muted">{user?.email}</p>
            </div>
          </div>

          {error && <div className="bg-error/10 text-error text-sm px-4 py-2.5 rounded-xl mb-5">{error}</div>}
          {saved && <div className="bg-success/10 text-success text-sm px-4 py-2.5 rounded-xl mb-5 flex items-center gap-2"><CheckCircle size={16} /> Profile updated</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'name', label: 'Full Name', span: 2 },
                { name: 'phone', label: 'Phone', type: 'tel' },
                { name: 'pincode', label: 'Pincode' },
                { name: 'address', label: 'Address', span: 2 },
                { name: 'city', label: 'City' },
                { name: 'state', label: 'State' }
              ].map(field => (
                <div key={field.name} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    value={form[field.name]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
