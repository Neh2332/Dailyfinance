import { Routes, Route, NavLink } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Assets = lazy(() => import('./pages/Assets'));
const Market = lazy(() => import('./pages/Market'));

/**
 * Root App component with Google Finance style header and search.
 */
function App() {
  return (
    <div className="app-container">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-logo">
          {/* Simple flat logo */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#1A73E8"/>
            <path d="M7 17V13L11 15L17 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1>Daily Finance</h1>
        </div>

        {/* Google Style Search */}
        <div className="header-search">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for stocks, ETFs, crypto & more..."
          />
        </div>

        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/assets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Assets
          </NavLink>
          <NavLink to="/market" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Market
          </NavLink>
        </nav>
      </header>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="main-content">
        <Suspense
          fallback={
            <div className="loading-container">
              <div className="loading-spinner" />
              <span className="loading-text">Loading...</span>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/market" element={<Market />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
