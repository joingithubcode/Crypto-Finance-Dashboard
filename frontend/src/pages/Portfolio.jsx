import { useEffect, useState } from 'react';
import { getPortfolio, createPortfolio, updatePortfolio, deletePortfolio, getAssets } from '../api/api';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = { asset: '', quantity: '', buy_price: '', buy_date: '', notes: '' };

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, aRes] = await Promise.all([getPortfolio(), getAssets()]);
      setPortfolio(pRes.data.results || pRes.data);
      setAssets(aRes.data.results || aRes.data);
    } catch (err) {
      toast.error('Data fetch karne mein error!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ asset: item.asset, quantity: item.quantity, buy_price: item.buy_price, buy_date: item.buy_date, notes: item.notes || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editItem) {
        await updatePortfolio(editItem.id, form);
        toast.success('Portfolio updated!');
      } else {
        await createPortfolio(form);
        toast.success('Portfolio mein add ho gaya!');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Error! Check karo sari fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yeh entry delete karna chahte ho?')) return;
    try {
      await deletePortfolio(id);
      toast.success('Delete ho gaya!');
      fetchData();
    } catch {
      toast.error('Delete nahi ho saka!');
    }
  };

  const totalValue = portfolio.reduce((sum, p) => sum + (p.total_value || 0), 0);
  const totalPL = portfolio.reduce((sum, p) => sum + (p.profit_loss || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and Manage Your Crypto Investments</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Holding
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
          <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total P&L</p>
          <p className={`text-2xl font-bold font-mono mt-1 ${totalPL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Holdings</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{portfolio.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  {['Asset', 'Quantity', 'Buy Price', 'Current Price', 'Total Value', 'P&L', 'P&L %', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {portfolio.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">Koi holding nahi mili. Add karo!</td></tr>
                ) : portfolio.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.asset_name}</p>
                        <p className="text-xs text-gray-400">{item.asset_symbol}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">{parseFloat(item.quantity).toFixed(6)}</td>
                    <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">${parseFloat(item.buy_price).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">${parseFloat(item.current_price || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-gray-900 dark:text-white">${(item.total_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className={`px-6 py-4 font-mono font-semibold ${item.profit_loss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {item.profit_loss >= 0 ? '+' : ''}${(item.profit_loss || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={item.profit_loss_percent >= 0 ? 'badge-green' : 'badge-red'}>
                        {item.profit_loss_percent >= 0 ? '+' : ''}{(item.profit_loss_percent || 0).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Holding' : 'Add New Holding'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Crypto Asset</label>
            <select
              className="input-field"
              value={form.asset}
              onChange={(e) => setForm({ ...form, asset: e.target.value })}
              required
            >
              <option value="">Select asset...</option>
              {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.symbol})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
              <input type="number" step="any" className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buy Price (USD)</label>
              <input type="number" step="any" className="input-field" value={form.buy_price} onChange={(e) => setForm({ ...form, buy_price: e.target.value })} required placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buy Date</label>
            <input type="date" className="input-field" value={form.buy_date} onChange={(e) => setForm({ ...form, buy_date: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
            <textarea className="input-field" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Koi note likhna ho to..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={submitting}>
              {submitting ? 'Saving...' : (editItem ? 'Update' : 'Add Holding')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}