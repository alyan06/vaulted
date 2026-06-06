import { useState } from 'react';
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

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const formModal = useVaultStore((s) => s.formModal);
  const detailId = useVaultStore((s) => s.detailId);

  return (
    <BrowserRouter>
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

        <main
          className="flex-1 min-w-0 overflow-x-hidden pt-0 md:pt-0"
          style={{ paddingTop: '0' }}
        >
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
