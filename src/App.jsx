import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import EntryForm from './components/EntryForm';
import EntryDetail from './components/EntryDetail';
import Dashboard from './pages/Dashboard';
import AllEntries from './pages/AllEntries';
import ByCategory from './pages/ByCategory';
import ByLocation from './pages/ByLocation';
import TopRated from './pages/TopRated';
import SearchPage from './pages/Search';
import useVaultStore from './store/useVaultStore';
import { VaultIcon, XIcon } from './components/icons';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-cream-100 z-50">
      <div className="text-center">
        <VaultIcon size={40} className="text-terra-500 mx-auto mb-3 animate-pulse" />
        <p className="font-display text-ink-700 text-lg">Opening your vault…</p>
      </div>
    </div>
  );
}

function ErrorBanner({ message, onDismiss, onRetry }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800 font-ui">Connection error</p>
          <p className="text-xs text-red-600 font-ui mt-0.5 truncate">{message}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRetry}
            className="text-xs font-semibold text-red-700 hover:text-red-900 font-ui cursor-pointer underline"
          >
            Retry
          </button>
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-700 cursor-pointer"
            title="Dismiss"
          >
            <XIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { fetchEntries, loading, error, clearError, formModal, detailId } = useVaultStore((s) => ({
    fetchEntries: s.fetchEntries,
    loading: s.loading,
    error: s.error,
    clearError: s.clearError,
    formModal: s.formModal,
    detailId: s.detailId,
  }));

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <BrowserRouter>
      {loading && <LoadingScreen />}
      {error && (
        <ErrorBanner
          message={error}
          onDismiss={clearError}
          onRetry={() => { clearError(); fetchEntries(); }}
        />
      )}

      <div className="flex min-h-screen bg-cream-100">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => {
            if (window.innerWidth < 768) {
              setMobileMenuOpen((v) => !v);
            } else {
              setSidebarCollapsed((v) => !v);
            }
          }}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 overflow-x-hidden">
          {/* Mobile top bar spacer */}
          <div className="md:hidden h-14" aria-hidden="true" />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/entries" element={<AllEntries />} />
            <Route path="/categories" element={<ByCategory />} />
            <Route path="/locations" element={<ByLocation />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>

        {formModal.open && <EntryForm />}
        {detailId && <EntryDetail />}
      </div>
    </BrowserRouter>
  );
}

export default App;
