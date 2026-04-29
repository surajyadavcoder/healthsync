import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Activity, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login, authLoading, authError, isAuthenticated } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const fillDemo = (role: 'admin' | 'doctor') => {
    if (role === 'admin') { setEmail('admin@healthsync.com'); setPassword('Admin@123'); }
    else { setEmail('doctor@healthsync.com'); setPassword('Doctor@123'); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: 'var(--bg-base)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Ambient glows */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)',
        top: -200, left: -100, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,165,0.06) 0%, transparent 70%)',
        bottom: -150, right: -100, pointerEvents: 'none'
      }} />

      {/* Left panel */}
      <div style={{
        flex: 1, flexDirection: 'column', justifyContent: 'center',
        padding: '60px', background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }} className="left-panel">
        <style>{`.left-panel { display: flex; } @media(max-width:900px) { .left-panel { display: none !important; } }`}</style>
        <div style={{ maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-green))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Activity size={22} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>
              HealthSync
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800,
            lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 20,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            The Future of<br />Healthcare Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            A unified platform for hospitals, clinics and healthcare networks to manage patients, analytics and care workflows.
          </p>

          {[
            { icon: '🏥', label: 'Patient Management', sub: 'Grid & list views with real-time vitals' },
            { icon: '📊', label: 'Advanced Analytics', sub: 'Admissions, conditions, outcome trends' },
            { icon: '🔔', label: 'Smart Notifications', sub: 'Push alerts for critical events' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <div style={{
                fontSize: 20, width: 44, height: 44, background: 'var(--bg-elevated)',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, border: '1px solid var(--border)'
              }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Login form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px'
      }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'fadeIn 0.5s ease' }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }} className="mobile-logo">
            <style>{`.mobile-logo { } @media(min-width:900px) { .mobile-logo { display: none !important; } }`}</style>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-green))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Activity size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>HealthSync</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Sign in
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14 }}>
            Access your healthcare dashboard
          </p>

          {/* Demo credentials */}
          <div style={{
            background: 'var(--accent-soft)', border: '1px solid rgba(79,142,247,0.2)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 24,
          }}>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>DEMO ACCOUNTS</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['admin', 'doctor'].map((role) => (
                <button key={role} onClick={() => fillDemo(role as any)} style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  background: 'rgba(79,142,247,0.15)', color: 'var(--accent)',
                  border: '1px solid rgba(79,142,247,0.3)', transition: 'var(--transition)',
                  cursor: 'pointer', textTransform: 'capitalize',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(79,142,247,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(79,142,247,0.15)')}
                >{role}</button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@healthsync.com" required
                style={{
                  width: '100%', padding: '11px 14px', background: 'var(--bg-elevated)',
                  border: `1px solid ${authError ? 'var(--accent-red)' : 'var(--border)'}`,
                  borderRadius: 10, color: 'var(--text-primary)', fontSize: 14,
                  outline: 'none', transition: 'var(--transition)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = authError ? 'var(--accent-red)' : 'var(--border)')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '11px 40px 11px 14px', background: 'var(--bg-elevated)',
                    border: `1px solid ${authError ? 'var(--accent-red)' : 'var(--border)'}`,
                    borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                    transition: 'var(--transition)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = authError ? 'var(--accent-red)' : 'var(--border)')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px',
                background: 'var(--accent-red-soft)', border: '1px solid rgba(247,95,106,0.2)',
                borderRadius: 8, marginBottom: 16, color: 'var(--accent-red)', fontSize: 13
              }}>
                <AlertCircle size={15} style={{ marginTop: 1, flexShrink: 0 }} />
                {authError}
              </div>
            )}

            <button type="submit" disabled={authLoading} style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: authLoading ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg, var(--accent), #6366f1)',
              color: 'white', fontWeight: 600, fontSize: 15, letterSpacing: '-0.2px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'var(--transition)', border: 'none', cursor: authLoading ? 'not-allowed' : 'pointer',
              boxShadow: authLoading ? 'none' : '0 4px 20px rgba(79,142,247,0.3)',
            }}
              onMouseEnter={e => !authLoading && (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {authLoading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign in to HealthSync'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 32 }}>
            🔒 This is a demo application. No real patient data is used.
          </p>
        </div>
      </div>
    </div>
  );
}
