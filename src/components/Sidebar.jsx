import { NavLink } from 'react-router-dom';
import useVaultStore from '../store/useVaultStore';
import {
  HomeIcon, ListIcon, GridIcon, MapPinIcon, StarIcon,
  SearchIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon,
  MenuIcon, VaultIcon, XIcon,
} from './icons';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: HomeIcon, exact: true },
  { to: '/entries', label: 'All Entries', icon: ListIcon },
  { to: '/categories', label: 'By Category', icon: GridIcon },
  { to: '/locations', label: 'By Location', icon: MapPinIcon },
  { to: '/top-rated', label: 'Top Rated', icon: StarIcon },
  { to: '/search', label: 'Search', icon: SearchIcon },
];

function NavContent({ collapsed, onNavClick, onAdd }) {
  const entries = useVaultStore((s) => s.entries);

  const linkClass = ({ isActive }) =>
    [
      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer font-ui text-sm font-medium border',
      isActive
        ? 'bg-gold-500/20 text-gold-400 border-gold-500/30'
        : 'text-cream-300 hover:bg-vault-700 hover:text-cream-50 border-transparent',
    ].join(' ');

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Add Entry Button */}
      <div className={`px-3 pt-4 pb-2 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={onAdd}
          className={`flex items-center gap-2 bg-terra-500 hover:bg-terra-600 text-white rounded-lg transition-colors duration-150 cursor-pointer font-ui font-semibold text-sm ${collapsed ? 'p-2.5' : 'px-3 py-2.5 w-full'}`}
          title="Add new entry"
        >
          <PlusIcon size={18} className="shrink-0" />
          {!collapsed && <span>Add Entry</span>}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={linkClass}
            onClick={onNavClick}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Stats */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-vault-700 mt-auto">
          <p className="text-ink-500 text-xs font-ui">
            <span className="text-cream-300 font-semibold text-sm">{entries.length}</span>
            {' '}memories vaulted
          </p>
        </div>
      )}
    </div>
  );
}

function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const openForm = useVaultStore((s) => s.openForm);

  const handleAdd = () => {
    openForm(null);
    onMobileClose?.();
  };

  const handleNavClick = () => {
    onMobileClose?.();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-vault-900 border-r border-vault-700 transition-all duration-300 ease-in-out shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}
        style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {/* Brand */}
        <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-vault-700 ${collapsed ? 'justify-center' : ''}`}>
          <VaultIcon size={26} className="text-gold-500 shrink-0" />
          {!collapsed && (
            <div>
              <h1 className="font-display text-cream-50 text-xl font-semibold leading-none tracking-wide">
                Vaulted
              </h1>
              <p className="text-ink-300 text-[10px] mt-0.5 font-ui tracking-widest uppercase opacity-70">
                Life Log
              </p>
            </div>
          )}
        </div>

        <NavContent collapsed={collapsed} onNavClick={handleNavClick} onAdd={handleAdd} />

        {/* Collapse Toggle */}
        <div className="border-t border-vault-700 px-3 py-2">
          <button
            onClick={onToggle}
            className={`flex items-center gap-2 text-ink-500 hover:text-cream-300 text-xs font-ui transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-vault-700 w-full ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRightIcon size={16} /> : (
              <>
                <ChevronLeftIcon size={16} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-vault-900 border-b border-vault-700 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <VaultIcon size={22} className="text-gold-500" />
          <span className="font-display text-cream-50 font-semibold text-lg">Vaulted</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="p-2 bg-terra-500 hover:bg-terra-600 text-white rounded-lg transition-colors cursor-pointer"
            title="Add entry"
          >
            <PlusIcon size={18} />
          </button>
          <button
            onClick={onToggle}
            className="p-2 text-cream-300 hover:text-cream-50 hover:bg-vault-700 rounded-lg transition-colors cursor-pointer"
            title="Open menu"
          >
            <MenuIcon size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="absolute inset-0 bg-vault-900/70 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative z-10 w-64 bg-vault-900 h-full flex flex-col border-r border-vault-700 shadow-2xl">
            {/* Mobile sidebar brand */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-vault-700 shrink-0">
              <div className="flex items-center gap-2">
                <VaultIcon size={22} className="text-gold-500" />
                <span className="font-display text-cream-50 font-semibold text-lg">Vaulted</span>
              </div>
              <button
                onClick={onMobileClose}
                className="p-1.5 text-ink-300 hover:text-cream-50 cursor-pointer rounded-lg hover:bg-vault-700 transition-colors"
                title="Close menu"
              >
                <XIcon size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col">
              <NavContent collapsed={false} onNavClick={handleNavClick} onAdd={handleAdd} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
