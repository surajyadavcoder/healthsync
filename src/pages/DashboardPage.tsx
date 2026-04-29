import { useAppStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle, Activity, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { admissionsData } from '../utils/mockData';

const statusColors: Record<string, string> = {
  Stable: 'var(--accent-green)',
  Critical: 'var(--accent-red)',
  Recovering: 'var(--accent-amber)',
  Discharged: 'var(--text-muted)',
};

export default function DashboardPage() {
  const { patients, user, addNotification } = useAppStore();
  const navigate = useNavigate();

  const stats = {
    total: patients.length,
    critical: patients.filter(p => p.status === 'Critical').length,
    stable: patients.filter(p => p.status === 'Stable').length,
    recovering: patients.filter(p => p.status === 'Recovering').length,
  };

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
    .slice(0, 5);

  const handleTestNotification = () => {
    addNotification({
      title: 'Vital Sign Alert',
      message: 'Patient in Room ICU-3 shows elevated heart rate (115 bpm). Nurse call initiated.',
      type: 'alert'
    });
  };

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }} className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4 }}>
          Good morning, {user?.displayName?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Here's what's happening at your facility today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Patients', value: stats.total, icon: Users, color: 'var(--accent)', bg: 'var(--accent-soft)', sub: 'Currently admitted' },
          { label: 'Critical', value: stats.critical, icon: AlertCircle, color: 'var(--accent-red)', bg: 'var(--accent-red-soft)', sub: 'Needs attention' },
          { label: 'Stable', value: stats.stable, icon: Activity, color: 'var(--accent-green)', bg: 'var(--accent-green-soft)', sub: 'Good condition' },
          { label: 'Recovering', value: stats.recovering, icon: TrendingUp, color: 'var(--accent-amber)', bg: 'var(--accent-amber-soft)', sub: 'In progress' },
        ].map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px', transition: 'var(--transition)',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 9, background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-1px', color, lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 6 }}>{label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        {/* Admissions chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Admission Trends</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Last 6 months overview</p>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
              {[['#4f8ef7', 'Admissions'], ['#22d3a5', 'Discharges']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={admissionsData}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3a5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3a5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#505878', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="admissions" stroke="#4f8ef7" fill="url(#ga)" strokeWidth={2} />
              <Area type="monotone" dataKey="discharges" stroke="#22d3a5" fill="url(#gd)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent patients */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Recent Patients</h3>
            <button onClick={() => navigate('/patients')} style={{
              fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 3
            }}>View all <ArrowRight size={12} /></button>
          </div>
          <div style={{ flex: 1 }}>
            {recentPatients.map(p => (
              <div key={p.id} onClick={() => { useAppStore.getState().setSelectedPatient(p); navigate(`/patients/${p.id}`); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
                  borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'var(--transition)',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${statusColors[p.status]}, rgba(0,0,0,0.3))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white',
                }}>{p.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.condition}</div>
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 20,
                  color: statusColors[p.status], background: `${statusColors[p.status]}20`,
                }}>{p.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '18px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
            🔔 Test Notification System
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Trigger a mock critical alert to test the notification service worker
          </div>
        </div>
        <button onClick={handleTestNotification} style={{
          padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: 'var(--accent-red-soft)', color: 'var(--accent-red)',
          border: '1px solid rgba(247,95,106,0.25)', transition: 'var(--transition)', cursor: 'pointer',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(247,95,106,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent-red-soft)')}
        >
          Trigger Alert
        </button>
      </div>
    </div>
  );
}
