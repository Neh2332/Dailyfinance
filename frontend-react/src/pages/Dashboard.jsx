import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortfolioSummary } from '../features/portfolio/portfolioSlice';
import { fetchMarketPrices } from '../features/market/marketSlice';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

/**
 * Dashboard page — Google Finance style
 */
function Dashboard() {
  const dispatch = useDispatch();
  const { summary, loading: portfolioLoading } = useSelector((state) => state.portfolio);
  const { prices, loading: marketLoading } = useSelector((state) => state.market);

  useEffect(() => {
    dispatch(fetchPortfolioSummary());
    dispatch(fetchMarketPrices());
  }, [dispatch]);

  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }, []);

  if (portfolioLoading || !summary) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <span className="loading-text">Loading your portfolio...</span>
      </div>
    );
  }

  const allocationColors = {
    STOCK: '#1A73E8', // Google Blue
    CRYPTO: '#9334E6', // Purple
    CASH: '#137333', // Green
    ETF: '#E37400', // Orange
    BOND: '#12B5CB', // Cyan
  };

  const totalAllocation = Object.values(summary.allocationByType || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="animate-fade-in">
      {/* ── Stat Cards ────────────────────────────────────────── */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="card-title">Total Net Worth</div>
          <div className="card-value">{formatCurrency(summary.totalNetWorth)}</div>
          <div className="stat-label">Across all asset classes</div>
        </div>

        <div className="card stat-card">
          <div className="card-title">Total Return</div>
          <div className="card-value" style={{ color: summary.totalProfitLoss >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}}>
            {summary.totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(summary.totalProfitLoss)}
          </div>
          <span className={`change-badge ${summary.totalProfitLossPercentage >= 0 ? 'positive' : 'negative'}`} style={{marginTop: '4px'}}>
            {summary.totalProfitLossPercentage >= 0 ? '▲' : '▼'} {Math.abs(summary.totalProfitLossPercentage).toFixed(2)}%
          </span>
        </div>

        <div className="card stat-card">
          <div className="card-title">Total Assets</div>
          <div className="card-value">{summary.assets?.length || 0}</div>
          <div className="stat-label">Holdings tracked</div>
        </div>

        <div className="card stat-card">
          <div className="card-title">Asset Classes</div>
          <div className="card-value">{Object.keys(summary.allocationByType || {}).length}</div>
          <div className="stat-label">Diversification categories</div>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="dashboard-grid">
        {/* Portfolio Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Portfolio Performance (30 Days)</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.history || []}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1A73E8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E8EAED" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#70757A', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#DADCE0' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: '#70757A', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  domain={['auto', 'auto']}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #DADCE0',
                    borderRadius: 8,
                    color: '#202124',
                    fontSize: 13,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value) => [formatCurrency(value), 'Portfolio Value']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1A73E8"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Prices Sidebar */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Live Market</span>
          </div>
          {marketLoading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
            </div>
          ) : (
            <ul className="market-ticker">
              {prices.slice(0, 6).map((item) => (
                <li key={item.symbol} className="ticker-item">
                  <div>
                    <div className="ticker-symbol">{item.symbol}</div>
                    <div className="ticker-name">{item.name}</div>
                  </div>
                  <div className="ticker-price">
                    <div className="ticker-price-value">{formatCurrency(item.price)}</div>
                    <span className={`change-badge ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
                      {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Allocation Chart */}
        <div className="card full-width">
          <div className="card-header">
            <span className="card-title">Portfolio Allocation</span>
          </div>
          <div className="allocation-bar">
            {Object.entries(summary.allocationByType || {}).map(([type, value]) => (
              <div
                key={type}
                className="allocation-segment"
                style={{
                  flex: totalAllocation > 0 ? value / totalAllocation : 0,
                  background: allocationColors[type] || '#70757A',
                }}
              />
            ))}
          </div>
          <div className="allocation-legend">
            {Object.entries(summary.allocationByType || {}).map(([type, value]) => (
              <div key={type} className="legend-item">
                <div className="legend-dot" style={{ background: allocationColors[type] || '#70757A' }} />
                <span style={{fontWeight: 500}}>{type}</span>
                <span>{formatCurrency(value)} ({totalAllocation > 0 ? ((value / totalAllocation) * 100).toFixed(1) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
