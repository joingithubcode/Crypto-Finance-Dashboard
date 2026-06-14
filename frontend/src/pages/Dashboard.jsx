import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/api';
import {
  TrendingUp, TrendingDown, DollarSign, Briefcase,
  ArrowLeftRight, Star, RefreshCw, Eye
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const mockChartData = [
  { month: 'Jan', value: 18000 },
  { month: 'Feb', value: 22000 },
  { month: 'Mar', value: 19500 },
  { month: 'Apr', value: 25000 },
  { month: 'May', value: 28000 },
  { month: 'Jun', value: 24000 },
  { month: 'Jul', value: 31000 },
  { month: 'Aug', value: 35000 },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (err) {
      setError('Backend se data fetch nahi ho saka. Django server check karein.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="card p-8 text-center">
      <div className="text-red-500 text-lg font-semibold mb-2">⚠️ Connection Error</div>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
      <button onClick={fetchStats} className="btn-primary mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  const statCards = [
    {
      title: 'Total Portfolio Value',
      value: `$${(stats?.total_portfolio_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'indigo',
      change: stats?.total_pnl_percent || 0,
    },
    {
      title: 'Total Invested',
      value: `$${(stats?.total_invested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: Briefcase,
      color: 'blue',
      change: null,
    },
    {
      title: 'Profit / Loss',
      value: `${stats?.total_profit_loss >= 0 ? '+' : ''}$${(stats?.total_profit_loss || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: stats?.total_profit_loss >= 0 ? TrendingUp : TrendingDown,
      color: stats?.total_profit_loss >= 0 ? 'emerald' : 'red',
      change: stats?.total_pnl_percent || 0,
    },
    {
      title: 'Total Transactions',
      value: stats?.total_transactions || 0,
      icon: ArrowLeftRight,
      color: 'purple',
      change: null,
    },
  ];

  const pieData = stats?.top_assets?.map(a => ({
    name: a.symbol,
    value: parseFloat(a.market_cap) || 0,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's your crypto overview.</p>
        </div>
        <button onClick={fetchStats} className="btn-secondary">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ title, value, icon: Icon, color, change }) => (
          <div key={title} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
              </div>
              {change !== null && (
                <span className={change >= 0 ? 'badge-green' : 'badge-red'}>
                  {change >= 0 ? '+' : ''}{change?.toFixed(2)}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Performance</h2>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">8 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                formatter={(v) => [`$${v.toLocaleString()}`, 'Value']}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Market Cap Distribution</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`$${(v/1e9).toFixed(2)}B`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No data</div>
          )}
        </div>
      </div>

      {/* Top Assets + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Assets */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Assets</h2>
          <div className="space-y-3">
            {stats?.top_assets?.length > 0 ? stats.top_assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{asset.name}</p>
                    <p className="text-xs text-gray-400">{asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-sm text-gray-900 dark:text-white">
                    ${parseFloat(asset.current_price).toLocaleString()}
                  </p>
                  <span className={parseFloat(asset.change_24h) >= 0 ? 'badge-green' : 'badge-red'}>
                    {parseFloat(asset.change_24h) >= 0 ? '+' : ''}{parseFloat(asset.change_24h).toFixed(2)}%
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-4">No assets found</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {stats?.recent_transactions?.length > 0 ? stats.recent_transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold
                    ${tx.transaction_type === 'BUY' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                    {tx.transaction_type}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{tx.asset_name}</p>
                    <p className="text-xs text-gray-400">{tx.quantity} {tx.asset_symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-sm text-gray-900 dark:text-white">
                    ${parseFloat(tx.total_amount).toLocaleString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-4">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}