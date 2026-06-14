import { useEffect, useState } from 'react';
import { getWatchlist, createWatchlistItem, updateWatchlistItem, deleteWatchlistItem, getAssets } from '../api/api';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Trash2, Star, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = { asset: '', alert_price_high: '', alert_price_low: '', notes: '' };

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [wRes, aRes] = await Promise.all([getWatchlist(), getAssets()]);
      setWatchlist(wRes.data.results || wRes.data);
      setAssets(aRes.data.results || aRes.data);
    } catch { toast.error('Error!'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) { await updateWatchlistItem(editItem.id, form); toast.success('Updated!'); }
      else { await createWatchlistItem(form); toast.success('Watchlist mein add!'); }
      setModalOpen(false); fetchData();
    } catch { toast.error('Error!'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove karna chahte ho?')) return;
    try { await deleteWatchlistItem(id); toast.success('Removed!'); fetchData(); }
    catch { toast.error('Error!'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watchlist</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track Your Favorite Cryptocurrencies</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm(emptyForm); setModalOpen(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Add to Watchlist
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {watchlist.length === 0 ? (
            <div className="col-span-3 card p-12 text-center">
              <Star className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400">Watchlist khali hai. Crypto add karo!</p>
            </div>
          ) : watchlist.map(item => (
            <div key={item.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                    {item.asset_symbol?.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.asset_name}</h3>
                    <p className="text-sm text-gray-400">{item.asset_symbol}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditItem(item); setForm({ asset: item.asset, alert_price_high: item.alert_price_high || '', alert_price_low: item.alert_price_low || '', notes: item.notes || '' }); setModalOpen(true); }}
                    className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Current Price</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">${parseFloat(item.current_price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">24h Change</span>
                  <span className={parseFloat(item.change_24h || 0) >= 0 ? 'badge-green' : 'badge-red'}>
                    {parseFloat(item.change_24h || 0) >= 0 ? '+' : ''}{parseFloat(item.change_24h || 0).toFixed(2)}%
                  </span>
                </div>
                {item.alert_price_high && (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
                    <Bell className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-emerald-700 dark:text-emerald-400">High Alert: ${parseFloat(item.alert_price_high).toLocaleString()}</span>
                  </div>
                )}
                {item.alert_price_low && (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <Bell className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-700 dark:text-red-400">Low Alert: ${parseFloat(item.alert_price_low).toLocaleString()}</span>
                  </div>
                )}
                {item.notes && <p className="text-xs text-gray-400 italic">"{item.notes}"</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Watchlist Item' : 'Add to Watchlist'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Asset</label>
            <select className="input-field" value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })} required>
              <option value="">Select...</option>
              {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.symbol})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">High Alert Price</label>
              <input type="number" step="any" className="input-field" value={form.alert_price_high} onChange={e => setForm({ ...form, alert_price_high: e.target.value })} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Low Alert Price</label>
              <input type="number" step="any" className="input-field" value={form.alert_price_low} onChange={e => setForm({ ...form, alert_price_low: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
            <textarea className="input-field" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}