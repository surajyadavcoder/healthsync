import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Activity, LayoutDashboard, Users, BarChart2, Bell, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout, notifications, sidebarCollapsed, toggleSidebar, toggleNotificationPanel } = useAppStore();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const w = sidebarCollapsed ? 64 : 220;

  return (
    <div style={{
      width: w, minWidth: w, height: '100vh', background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)',
      position: 'relative', zIndex: 10, overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center',
        padding: sidebarCollapsed ? '0 12px' : '0 18px',
        borderBottom: '1px solid var(--border)', gap: 10, flexShrink: 0,
        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-green))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Activity size={17} color="white" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
            HealthSync
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center',
            gap: 10, padding: sidebarCollapsed ? '10px 0' : '9px 10px',
            borderRadius: 8, marginBottom: 2, transition: 'var(--transition)',
            background: isActive ? 'var(--accent-soft)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: isActive ? 600 : 400, fontSize: 14,
            textDecoration: 'none',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          })}>
            <Icon size={18} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
          </NavLink>
        ))}

        {/* Notifications button */}
        <button onClick={toggleNotificationPanel} style={{
          display: 'flex', alignItems: 'center',
          gap: 10, padding: sidebarCollapsed ? '10px 0' : '9px 10px',
          borderRadius: 8, marginBottom: 2, transition: 'var(--transition)',
          color: 'var(--text-secondary)', fontWeight: 400, fontSize: 14,
          width: '100%', position: 'relative',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Bell size={18} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: -5, right: -5, width: 16, height: 16,
                background: 'var(--accent-red)', borderRadius: '50%', fontSize: 9,
                fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', animation: 'glow 2s ease infinite',
              }}>{unreadCount}</div>
            )}
          </div>
          {!sidebarCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Notifications</span>}
        </button>
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 8px', flexShrink: 0 }}>
        {user && !sidebarCollapsed && (
          <div style={{
            padding: '10px', background: 'var(--bg-elevated)', borderRadius: 8,
            marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white'
            }}>
              {user.displayName.split(' ').map(p => p[0]).slice(0, 2).join('')}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.displayName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center',
          gap: 10, padding: sidebarCollapsed ? '10px 0' : '9px 10px',
          borderRadius: 8, width: '100%', color: 'var(--text-muted)', fontSize: 13,
          transition: 'var(--transition)',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-red)'; e.currentTarget.style.background = 'var(--accent-red-soft)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!sidebarCollapsed && 'Sign out'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={toggleSidebar} style={{
        position: 'absolute', top: 18, right: -12, width: 24, height: 24,
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-secondary)', zIndex: 20, cursor: 'pointer',
        transition: 'var(--transition)',
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  );
}
