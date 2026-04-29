import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Bell, Search } from 'lucide-react'
import { useState } from 'react'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patient Management',
  '/analytics': 'Analytics',
}

export default function TopBar() {
  const location = useLocation()
  const { notifications, toggleNotificationPanel, setSearchQuery, searchQuery } = useAppStore()
  const unread = notifications.filter(n => !n.read).length
  const [focused, setFocused] = useState(false)

  const title = Object.entries(titles).find(([k]) => location.pathname.startsWith(k))?.[1] ?? 'HealthSync'

  return (
    <header style={{
      height: 60, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0,
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
        letterSpacing: '-0.3px', flex: 1, color: 'var(--text-primary)'
      }}>{title}</h2>

      {/* Search — only show on patient page */}
      {location.pathname.startsWith('/patients') && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: focused ? 'var(--bg-elevated)' : 'var(--bg-elevated)',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 8, padding: '7px 12px', width: 240, transition: 'var(--transition)',
        }}>
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search patients…"
            style={{
              background: 'none', border: 'none', outline: 'none', width: '100%',
              color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)'
            }}
          />
        </div>
      )}

      {/* Notification bell */}
      <button onClick={toggleNotificationPanel} style={{
        width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        color: 'var(--text-secondary)', position: 'relative', transition: 'var(--transition)',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4, width: 16, height: 16,
            background: 'var(--accent-red)', borderRadius: '50%', fontSize: 9,
            fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: '2px solid var(--bg-base)',
            animation: 'glow 2s ease infinite',
          }}>{unread}</span>
        )}
      </button>
    </header>
  )
}
