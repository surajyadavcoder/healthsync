import { useTheme } from '../context/ThemeContext'
import { useAppStore } from '../store/appStore'
import { Palette, Zap, Layout, User, Shield, Bell } from 'lucide-react'

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Icon size={16} style={{ color: 'var(--accent)' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label, sub }: { checked: boolean; onChange: () => void; label: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div onClick={onChange} style={{
        width: 44, height: 24, borderRadius: 99, cursor: 'pointer',
        background: checked ? 'var(--accent)' : 'var(--border-bright)',
        position: 'relative', transition: 'var(--transition)', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%', background: 'white',
          transition: 'var(--transition)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { density, accentColor, animationsEnabled, setDensity, setAccentColor, toggleAnimations } = useTheme()
  const { user, notifications } = useAppStore()
  const unread = notifications.filter(n => !n.read).length

  const ACCENTS: Array<{ key: 'blue' | 'green' | 'purple'; color: string; label: string }> = [
    { key: 'blue',   color: '#4f8ef7', label: 'Ocean Blue'   },
    { key: 'green',  color: '#22d3a5', label: 'Mint Green'   },
    { key: 'purple', color: '#a78bfa', label: 'Lavender'     },
  ]

  return (
    <div style={{ padding: '24px 32px', overflowY: 'auto', height: '100%', maxWidth: 720 }} className="fade-in">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4 }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
        Manage your preferences — powered by React Context API + Zustand
      </p>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'white',
          }}>
            {user?.displayName?.split(' ').map(p => p[0]).slice(0, 2).join('') ?? 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.displayName}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{user?.email}</div>
            <div style={{
              display: 'inline-block', marginTop: 6, padding: '3px 10px', borderRadius: 20,
              fontSize: 11, fontWeight: 700, background: 'var(--accent-soft)', color: 'var(--accent)',
            }}>{user?.role}</div>
          </div>
        </div>
      </Section>

      {/* Theme — uses Context API */}
      <Section title="Appearance (Context API)" icon={Palette}>
        <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginBottom: 14, letterSpacing: '0.5px' }}>
          ⚡ State managed via React Context API · ThemeContext.tsx
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Accent Color</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {ACCENTS.map(a => (
              <div key={a.key} onClick={() => setAccentColor(a.key)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: a.color,
                  border: `3px solid ${accentColor === a.key ? 'white' : 'transparent'}`,
                  boxShadow: accentColor === a.key ? `0 0 0 2px ${a.color}` : 'none',
                  transition: 'var(--transition)',
                }} />
                <span style={{ fontSize: 11, color: accentColor === a.key ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {a.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Layout Density</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['comfortable', 'compact'] as const).map(d => (
              <button key={d} onClick={() => setDensity(d)} style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${density === d ? 'var(--accent)' : 'var(--border)'}`,
                background: density === d ? 'var(--accent-soft)' : 'transparent',
                color: density === d ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'var(--transition)', textTransform: 'capitalize',
              }}>{d}</button>
            ))}
          </div>
        </div>

        <Toggle
          checked={animationsEnabled}
          onChange={toggleAnimations}
          label="UI Animations"
          sub="Fade-ins, transitions, and micro-interactions"
        />
      </Section>

      {/* Notifications — uses Zustand */}
      <Section title="Notifications (Zustand Store)" icon={Bell}>
        <div style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 700, marginBottom: 14, letterSpacing: '0.5px' }}>
          ⚡ State managed via Zustand · appStore.ts
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px', background: 'var(--bg-elevated)', borderRadius: 10, marginBottom: 10,
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Unread Alerts</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {unread} unread of {notifications.length} total notifications
            </div>
          </div>
          <div style={{
            fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 800,
            color: unread > 0 ? 'var(--accent-red)' : 'var(--accent-green)',
          }}>{unread}</div>
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Authentication Provider</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8,
            background: 'var(--accent-soft)', border: '1px solid rgba(79,142,247,0.2)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>🔥 Firebase Authentication</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
            Real Firebase Auth active when VITE_FIREBASE_* env vars are configured · falls back to mock auth for demo
          </div>
        </div>
        <div style={{ padding: '12px 0' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Service Worker</div>
          <div style={{ fontSize: 13, color: 'var(--accent-green)', fontWeight: 600 }}>✓ Registered · Push notifications enabled</div>
        </div>
      </Section>
    </div>
  )
}
