import { useEffect, useState } from 'react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getAssets } from '../api/api';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = { asset: '', transaction_type: 'BUY', quantity: '', price_per_unit: '', total_amount: '', fee: '0', transaction_date: '', notes: '' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, aRes] = await Promise.all([getTransactions(), getAssets()]);
      setTransactions(tRes.data.results || tRes.data);
      setAssets(aRes.data.results || aRes.data);
    } catch { toast.error('Data fetch error!'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleQtyPrice = (field, value) => {
    const updated = { ...form, [field]: value };
    if (updated.quantity && updated.price_per_unit) {
      updated.total_amount = (parseFloat(updated.quantity) * parseFloat(updated.price_per_unit)).toFixed(2);
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) { await updateTransaction(editItem.id, form); toast.success('Transaction updated!'); }
      else { await createTransaction(form); toast.success('Transaction add ho gaya!'); }
      setModalOpen(false);
      fetchData();
    } catch { toast.error('Error! Sari fields check karo.'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete karna chahte ho?')) return;
    try { await deleteTransaction(id); toast.success('Deleted!'); fetchData(); }
    catch { toast.error('Delete error!'); }
  };

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item, transaction_date: item.transaction_date?.slice(0, 16) });
    setModalOpen(true);
  };

  const filtered = filter === 'ALL' ? transactions : transactions.filter(t => t.transaction_type === filter);

  const typeColors = {
    BUY: 'badge-green',
    SELL: 'badge-red',
    TRANSFER_IN: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg text-xs font-semibold',
    TRANSFER_OUT: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-semibold',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and Manage Complete Buy/Sell History</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Transaction</button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'BUY', 'SELL', 'TRANSFER_IN', 'TRANSFER_OUT'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {f.replace('_', ' ')}
          </button>
        ))}
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
                  {['Type', 'Asset', 'Quantity', 'Price/Unit', 'Total', 'Fee', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">Koi transaction nahi mili</td></tr>
                ) : filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4"><span className={typeColors[tx.transaction_type]}>{tx.transaction_type}</span></td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{tx.asset_name}</p>
                      <p className="text-xs text-gray-400">{tx.asset_symbol}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">{parseFloat(tx.quantity).toFixed(6)}</td>
                    <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">${parseFloat(tx.price_per_unit).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-gray-900 dark:text-white">${parseFloat(tx.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-gray-500">${parseFloat(tx.fee || 0).toFixed(4)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(tx)} className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(tx.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Transaction' : 'Add Transaction'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Asset</label>
              <select className="input-field" value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })} required>
                <option value="">Select...</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.symbol})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <select className="input-field" value={form.transaction_type} onChange={e => setForm({ ...form, transaction_type: e.target.value })}>
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
                <option value="TRANSFER_IN">Transfer In</option>
                <option value="TRANSFER_OUT">Transfer Out</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
              <input type="number" step="any" className="input-field" value={form.quantity} onChange={e => handleQtyPrice('quantity', e.target.value)} required placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price per Unit (USD)</label>
              <input type="number" step="any" className="input-field" value={form.price_per_unit} onChange={e => handleQtyPrice('price_per_unit', e.target.value)} required placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Amount</label>
              <input type="number" step="any" className="input-field" value={form.total_amount} onChange={e => setForm({ ...form, total_amount: e.target.value })} required placeholder="Auto-calculated" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fee</label>
              <input type="number" step="any" className="input-field" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction Date</label>
            <input type="datetime-local" className="input-field" value={form.transaction_date} onChange={e => setForm({ ...form, transaction_date: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
            <textarea className="input-field" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Save Transaction</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}