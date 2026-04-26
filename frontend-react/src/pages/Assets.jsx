import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortfolioSummary, createAsset, deleteAsset } from '../features/portfolio/portfolioSlice';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function Assets() {
  const dispatch = useDispatch();
  const { summary, assets, loading } = useSelector((state) => state.portfolio);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '', name: '', type: 'STOCK', quantity: '', purchasePrice: '', currentPrice: '',
  });

  useEffect(() => {
    dispatch(fetchPortfolioSummary());
  }, [dispatch]);

  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    dispatch(createAsset({
      ...formData,
      quantity: parseFloat(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice),
      currentPrice: parseFloat(formData.currentPrice),
    }));
    setShowModal(false);
    setFormData({ symbol: '', name: '', type: 'STOCK', quantity: '', purchasePrice: '', currentPrice: '' });
    setTimeout(() => dispatch(fetchPortfolioSummary()), 500);
  }, [dispatch, formData]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Are you sure you want to remove this asset?')) {
      dispatch(deleteAsset(id));
      setTimeout(() => dispatch(fetchPortfolioSummary()), 500);
    }
  }, [dispatch]);

  if (loading && assets.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <span className="loading-text">Loading assets...</span>
      </div>
    );
  }

  const PIE_COLORS = ['#1A73E8', '#137333', '#E37400', '#9334E6', '#12B5CB'];
  const pieData = Object.entries(summary?.allocationByType || {}).map(([name, value]) => ({ name, value }));
  
  // Data for Bar Chart: Purchase Price vs Current Value
  const barData = assets.map(a => ({
    symbol: a.symbol,
    'Cost Basis': a.purchasePrice * a.quantity,
    'Current Value': a.currentPrice * a.quantity,
  }));

  return (
    <div className="animate-fade-in">
      <div className="card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>Your Assets</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Visual analytics and portfolio holdings.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Asset
        </button>
      </div>

      {/* ── Visual Analytics ────────────────────────────────── */}
      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Asset Allocation</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card full-width" style={{ gridColumn: '2 / -1' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Cost Basis vs. Current Value</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                <XAxis dataKey="symbol" tick={{ fill: '#70757A', fontSize: 12 }} axisLine={{ stroke: '#DADCE0' }} tickLine={false} />
                <YAxis tick={{ fill: '#70757A', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 8, border: '1px solid #DADCE0' }} />
                <Legend />
                <Bar dataKey="Cost Basis" fill="#DADCE0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Current Value" fill="#1A73E8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Asset Table ─────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Avg Cost</th>
              <th>Price</th>
              <th>Value</th>
              <th>P/L</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>
                  <div className="asset-symbol">{asset.symbol}</div>
                  <div className="asset-name">{asset.name}</div>
                </td>
                <td><span className="type-badge">{asset.type}</span></td>
                <td>{asset.quantity}</td>
                <td>{formatCurrency(asset.purchasePrice)}</td>
                <td>{formatCurrency(asset.currentPrice)}</td>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{formatCurrency(asset.totalValue)}</td>
                <td>
                  <span className={`change-badge ${asset.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                    {asset.profitLoss >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(asset.profitLoss))}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(asset.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal (Add Asset) ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add New Asset</h3>
            {/* Form rendering omitted for brevity but remains same structure */}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Symbol</label>
                  <input className="form-input" placeholder="e.g. AAPL" value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" placeholder="e.g. Apple Inc." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="STOCK">Stock</option>
                  <option value="CRYPTO">Crypto</option>
                  <option value="CASH">Cash</option>
                  <option value="ETF">ETF</option>
                  <option value="BOND">Bond</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input className="form-input" type="number" step="any" placeholder="10" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Purchase Price ($)</label>
                  <input className="form-input" type="number" step="any" placeholder="150.00" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Current Price ($)</label>
                <input className="form-input" type="number" step="any" placeholder="175.00" value={formData.currentPrice} onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assets;
