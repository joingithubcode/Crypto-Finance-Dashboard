import { useEffect, useState } from 'react';
import { getProfile, createProfile, updateProfile } from '../api/api';
import { User, Mail, Phone, Edit, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = { username: '', email: '', full_name: '', phone: '', bio: '', preferred_currency: 'USD' };

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then(res => {
      const data = res.data.results || res.data;
      if (data.length > 0) { setProfile(data[0]); setForm(data[0]); }
      else setEditing(true);
    }).catch(() => setEditing(true)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile) { await updateProfile(profile.id, form); toast.success('Profile updated!'); }
      else { const res = await createProfile(form); setProfile(res.data); toast.success('Profile created!'); }
      setEditing(false);
    } catch { toast.error('Error saving profile!'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage Your Account Information</p>
      </div>

      <div className="card p-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {form.full_name?.charAt(0) || form.username?.charAt(0) || 'U'}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{form.full_name || 'Your Name'}</h2>
            <p className="text-gray-500 dark:text-gray-400">{form.email || 'your@email.com'}</p>
            <span className="badge-green mt-2 inline-block">Active Account</span>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                <input className="input-field" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required placeholder="username" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input className="input-field" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+92 300 0000000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Currency</label>
                <select className="input-field" value={form.preferred_currency} onChange={e => setForm({ ...form, preferred_currency: e.target.value })}>
                  <option value="USD">USD - US Dollar</option>
                  <option value="PKR">PKR - Pakistani Rupee</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <textarea className="input-field" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Apne baare mein likhao..." />
            </div>
            <div className="flex gap-3">
              {profile && <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>}
              <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Profile</button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            {[
              { label: 'Username', value: profile?.username, icon: User },
              { label: 'Email', value: profile?.email, icon: Mail },
              { label: 'Phone', value: profile?.phone || 'Not set', icon: Phone },
              { label: 'Currency', value: profile?.preferred_currency },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
              </div>
            ))}
            {profile?.bio && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Bio</p>
                <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
              </div>
            )}
            <button onClick={() => setEditing(true)} className="btn-primary"><Edit className="w-4 h-4" /> Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}