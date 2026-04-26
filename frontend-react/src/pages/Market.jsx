import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMarketPrices, fetchTrending, fetchNews } from '../features/market/marketSlice';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

function Market() {
  const dispatch = useDispatch();
  const { prices, trending, news, loading } = useSelector((state) => state.market);

  useEffect(() => {
    dispatch(fetchMarketPrices());
    dispatch(fetchTrending());
    dispatch(fetchNews());
  }, [dispatch]);

  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  }, []);

  if (loading && prices.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <span className="loading-text">Fetching live market feeds...</span>
      </div>
    );
  }

  const stocks = prices.filter((p) => p.type === 'STOCK');
  const crypto = prices.filter((p) => p.type === 'CRYPTO');

  // Helper to generate a fake sparkline array for visuals
  const generateSparkline = (currentPrice, change) => {
    const base = currentPrice - change;
    return Array.from({ length: 10 }).map((_, i) => ({
      val: base + (change / 10) * i + (Math.random() * change * 0.2)
    }));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>Market & News</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Real-time trends and financial headlines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Markets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Market Trend Cards */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '1rem' }}>Market Trends</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {stocks.slice(0, 3).map(stock => {
                const isPositive = stock.changePercent >= 0;
                const color = isPositive ? '#137333' : '#C5221F';
                const bg = isPositive ? '#E6F4EA' : '#FCE8E6';
                return (
                  <div key={stock.symbol} className="card" style={{ padding: '1rem', background: bg, border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 500 }}>{stock.symbol}</span>
                      <span style={{ color, fontWeight: 500 }}>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem' }}>{formatCurrency(stock.price)}</div>
                    <div style={{ height: '40px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateSparkline(stock.price, stock.change)}>
                          <YAxis domain={['auto', 'auto']} hide />
                          <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Crypto Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="card-header" style={{ padding: '16px 16px 0 16px', marginBottom: '8px' }}>
              <span className="card-title">Cryptocurrency</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>24h Change</th>
                </tr>
              </thead>
              <tbody>
                {crypto.map((item) => (
                  <tr key={item.symbol}>
                    <td><span className="asset-symbol">{item.symbol}</span></td>
                    <td>{item.name}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{formatCurrency(item.price)}</td>
                    <td>
                      <span className={`change-badge ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
                        {item.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: News & Top Active */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* News Feed */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Financial Headlines</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {news?.map((article, idx) => (
                <li key={idx} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {article.source} • {article.time}
                  </div>
                  <a href={article.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}>
                    {article.title}
                  </a>
                </li>
              ))}
              {(!news || news.length === 0) && (
                <li style={{ padding: '12px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent news.</li>
              )}
            </ul>
          </div>

          {/* Top Active */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top active</span>
            </div>
            <ul className="market-ticker">
              {trending.map((item) => {
                const intensity = Math.min(Math.abs(item.change) / 10, 1);
                const bgColor = item.change >= 0 ? `rgba(19, 115, 51, ${intensity * 0.2})` : `rgba(197, 34, 31, ${intensity * 0.2})`;
                return (
                  <li key={item.symbol} className="ticker-item" style={{ backgroundColor: bgColor, borderRadius: '4px', padding: '8px', margin: '4px 0' }}>
                    <div>
                      <div className="ticker-symbol">{item.symbol}</div>
                      <div className="ticker-name">{item.name}</div>
                    </div>
                    <div className="ticker-price">
                      <div style={{ fontWeight: 500, color: item.change >= 0 ? '#137333' : '#C5221F' }}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </div>
                      <div className="ticker-name" style={{ marginTop: '2px' }}>Vol: {item.volume}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Market;
