import { useAppStore } from '../store/appStore';
import { Bell, X, CheckCheck, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Notification } from '../types';

const icons = {
  alert: <AlertCircle size={14} style={{ color: 'var(--accent-red)' }} />,
  info: <Info size={14} style={{ color: 'var(--accent)' }} />,
  success: <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} />,
  warning: <AlertTriangle size={14} style={{ color: 'var(--accent-amber)' }} />,
};

const bgColors = {
  alert: 'var(--accent-red-soft)',
  info: 'var(--accent-soft)',
  success: 'var(--accent-green-soft)',
  warning: 'var(--accent-amber-soft)',
};

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function NotificationPanel() {
  const { notifications, showNotificationPanel, toggleNotificationPanel, markNotificationRead, markAllRead, dismissNotification } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;

  if (!showNotificationPanel) return null;

  return (
    <>
      <div onClick={toggleNotificationPanel} style={{
        position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 360,
        background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)',
        zIndex: 100, display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.25s ease',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={17} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Notifications</span>
            {unread > 0 && (
              <div style={{
                background: 'var(--accent-red)', color: 'white', fontSize: 11,
                fontWeight: 700, padding: '1px 7px', borderRadius: 20,
              }}>{unread}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 8px', borderRadius: 6, background: 'var(--accent-soft)',
              }}>
                <CheckCheck size={12} /> Mark all read
              </button>
            )}
            <button onClick={toggleNotificationPanel} style={{ color: 'var(--text-muted)', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Bell size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
              <div style={{ fontSize: 14 }}>No notifications</div>
            </div>
          ) : notifications.map((n: Notification) => (
            <div key={n.id} onClick={() => markNotificationRead(n.id)} style={{
              padding: '12px 14px', borderRadius: 10, marginBottom: 4, cursor: 'pointer',
              background: n.read ? 'transparent' : bgColors[n.type],
              border: `1px solid ${n.read ? 'transparent' : 'rgba(255,255,255,0.05)'}`,
              transition: 'var(--transition)', position: 'relative',
            }}
              onMouseEnter={e => !n.read && (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ marginTop: 1, flexShrink: 0 }}>{icons[n.type]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: n.read ? 500 : 700,
                    color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                    marginBottom: 3,
                  }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>{timeAgo(n.timestamp)}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); dismissNotification(n.id); }} style={{
                  color: 'var(--text-muted)', flexShrink: 0, opacity: 0.6, display: 'flex',
                }}>
                  <X size={13} />
                </button>
              </div>
              {!n.read && (
                <div style={{
                  position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
                  width: 3, height: 20, background: n.type === 'alert' ? 'var(--accent-red)' : n.type === 'success' ? 'var(--accent-green)' : 'var(--accent)',
                  borderRadius: 99,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
