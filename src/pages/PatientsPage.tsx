import { useAppStore } from '../store/appStore'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, List, Filter, Heart, Thermometer, Droplets, Wind } from 'lucide-react'

const STATUS_OPTIONS = ['All', 'Stable', 'Critical', 'Recovering', 'Discharged']

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  Stable:     { text: 'var(--accent-green)', bg: 'var(--accent-green-soft)' },
  Critical:   { text: 'var(--accent-red)',   bg: 'var(--accent-red-soft)' },
  Recovering: { text: 'var(--accent-amber)', bg: 'var(--accent-amber-soft)' },
  Discharged: { text: 'var(--text-muted)',   bg: 'rgba(80,88,120,0.12)' },
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#4f8ef7,#6366f1)',
  'linear-gradient(135deg,#22d3a5,#4f8ef7)',
  'linear-gradient(135deg,#a78bfa,#ec4899)',
  'linear-gradient(135deg,#f5a623,#f75f6a)',
  'linear-gradient(135deg,#22d3a5,#a78bfa)',
  'linear-gradient(135deg,#6366f1,#22d3a5)',
]

export default function PatientsPage() {
  const { patients, patientViewMode, setPatientViewMode, searchQuery, statusFilter, setStatusFilter, setSelectedPatient } = useAppStore()
  const navigate = useNavigate()

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const openDetail = (p: typeof patients[0]) => {
    setSelectedPatient(p)
    navigate(`/patients/${p.id}`)
  }

  return (
    <div style={{ padding: '24px 32px', height: '100%', display: 'flex', flexDirection: 'column' }} className="fade-in">
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Status filters */}
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: `1px solid ${statusFilter === s ? (STATUS_COLORS[s]?.text ?? 'var(--accent)') : 'var(--border)'}`,
              background: statusFilter === s ? (STATUS_COLORS[s]?.bg ?? 'var(--accent-soft)') : 'transparent',
              color: statusFilter === s ? (STATUS_COLORS[s]?.text ?? 'var(--accent)') : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'var(--transition)',
            }}>{s}</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
          <Filter size={13} /> {filtered.length} patient{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* View toggle */}
        <div style={{
          display: 'flex', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 8, padding: 3, gap: 2,
        }}>
          {([['grid', LayoutGrid], ['list', List]] as const).map(([mode, Icon]) => (
            <button key={mode} onClick={() => setPatientViewMode(mode)} style={{
              padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 5,
              background: patientViewMode === mode ? 'var(--accent-soft)' : 'transparent',
              color: patientViewMode === mode ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 600, transition: 'var(--transition)', cursor: 'pointer',
            }}>
              <Icon size={14} /> {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 40 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No patients found</div>
          <div style={{ fontSize: 13 }}>Try adjusting your search or filters</div>
        </div>
      ) : patientViewMode === 'grid' ? (
        /* GRID VIEW */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16, overflowY: 'auto', flex: 1, alignContent: 'start',
        }}>
          {filtered.map((p, i) => {
            const sc = STATUS_COLORS[p.status]
            return (
              <div key={p.id} onClick={() => openDetail(p)} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '20px', cursor: 'pointer',
                transition: 'var(--transition)', animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,142,247,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: 'white', letterSpacing: '-0.5px',
                  }}>{p.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.id} · {p.age}y · {p.gender}</div>
                  </div>
                  <div style={{
                    padding: '4px 9px', borderRadius: 20, fontSize: 10, fontWeight: 800,
                    color: sc.text, background: sc.bg, letterSpacing: '0.3px', flexShrink: 0,
                  }}>{p.status.toUpperCase()}</div>
                </div>

                {/* Condition + Doctor */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{p.condition}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.doctor} · Room {p.room}</div>
                </div>

                {/* Vitals */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                  background: 'var(--bg-elevated)', borderRadius: 10, padding: 12,
                }}>
                  {[
                    { icon: Heart, label: 'HR', value: `${p.vitals.heartRate} bpm`, color: 'var(--accent-red)' },
                    { icon: Droplets, label: 'BP', value: p.vitals.bloodPressure, color: 'var(--accent)' },
                    { icon: Thermometer, label: 'Temp', value: `${p.vitals.temperature}°F`, color: 'var(--accent-amber)' },
                    { icon: Wind, label: 'SpO₂', value: `${p.vitals.oxygenSat}%`, color: 'var(--accent-green)' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon size={12} style={{ color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div style={{ overflowY: 'auto', flex: 1, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
            padding: '12px 20px', background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700,
            color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase',
            position: 'sticky', top: 0, zIndex: 2,
          }}>
            <span>Patient</span><span>Condition</span><span>Status</span>
            <span>Heart Rate</span><span>SpO₂</span><span>Room</span>
          </div>

          {filtered.map((p, i) => {
            const sc = STATUS_COLORS[p.status]
            return (
              <div key={p.id} onClick={() => openDetail(p)} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
                padding: '14px 20px', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', transition: 'var(--transition)',
                animation: `fadeIn 0.25s ease ${i * 0.03}s both`,
                background: 'var(--bg-card)',
                alignItems: 'center',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-card)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: 'white',
                  }}>{p.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.id} · {p.age}y · {p.gender}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{p.condition}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.doctor}</div>
                </div>
                <div>
                  <span style={{
                    padding: '4px 9px', borderRadius: 20, fontSize: 10, fontWeight: 800,
                    color: sc.text, background: sc.bg,
                  }}>{p.status}</span>
                </div>
                <div style={{ fontSize: 13, color: p.vitals.heartRate > 100 ? 'var(--accent-red)' : 'var(--text-primary)', fontWeight: 600 }}>
                  {p.vitals.heartRate} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>bpm</span>
                </div>
                <div style={{ fontSize: 13, color: p.vitals.oxygenSat < 95 ? 'var(--accent-amber)' : 'var(--accent-green)', fontWeight: 600 }}>
                  {p.vitals.oxygenSat}%
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.room}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
