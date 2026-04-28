import React, { useState, useEffect } from 'react';
import { getAdminUsers } from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers({ limit: 50 }).then(({ data }) => setUsers(data.users)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-primary mb-6">Users</h1>
      <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-light bg-surface text-text-muted text-xs uppercase tracking-wider"><th className="text-left p-4 font-medium">Name</th><th className="text-left p-4 font-medium">Email</th><th className="text-left p-4 font-medium">Phone</th><th className="text-left p-4 font-medium">Role</th><th className="text-left p-4 font-medium">Joined</th></tr></thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={5} className="p-4"><div className="skeleton h-10 rounded-lg" /></td></tr>) :
              users.map(u => (
                <tr key={u._id} className="border-b border-border-light last:border-0">
                  <td className="p-4 font-medium text-primary">{u.name}</td>
                  <td className="p-4 text-text-secondary">{u.email}</td>
                  <td className="p-4 text-text-muted">{u.phone || '-'}</td>
                  <td className="p-4"><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-surface text-text-muted'}`}>{u.role}</span></td>
                  <td className="p-4 text-text-muted text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
