import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useEffect } from 'react'
import {
  ArrowLeft, Heart, Thermometer, Droplets, Wind,
  Phone, Mail, User, Calendar, MapPin, Syringe, ChevronRight
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  Stable:     { text: 'var(--accent-green)', bg: 'var(--accent-green-soft)' },
  Critical:   { text: 'var(--accent-red)',   bg: 'var(--accent-red-soft)' },
  Recovering: { text: 'var(--accent-amber)', bg: 'var(--accent-amber-soft)' },
  Discharged: { text: 'var(--text-muted)',   bg: 'rgba(80,88,120,0.12)' },
}

// Simulated 7-day vitals history
function generateHistory(base: number, variance: number) {
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => ({
    day,
    value: Math.round(base + (Math.random() - 0.5) * variance * 2),
  }))
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#4f8ef7,#6366f1)',
  'linear-gradient(135deg,#22d3a5,#4f8ef7)',
  'linear-gradient(135deg,#a78bfa,#ec4899)',
  'linear-gradient(135deg,#f5a623,#f75f6a)',
  'linear-gradient(135deg,#22d3a5,#a78bfa)',
  'linear-gradient(135deg,#6366f1,#22d3a5)',
]

export default function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { patients, selectedPatient, setSelectedPatient, addNotification } = useAppStore()

  useEffect(() => {
    if (!selectedPatient || selectedPatient.id !== id) {
      const p = patients.find(p => p.id === id)
      if (p) setSelectedPatient(p)
      else navigate('/patients')
    }
  }, [id])

  const patient = selectedPatient || patients.find(p => p.id === id)
  if (!patient) return null

  const sc = STATUS_COLORS[patient.status]
  const avatarIndex = patients.findIndex(p => p.id === id) % AVATAR_GRADIENTS.length

  const hrHistory  = generateHistory(patient.vitals.heartRate, 8)
  const o2History  = generateHistory(patient.vitals.oxygenSat, 3)
  const tmpHistory = generateHistory(patient.vitals.temperature, 1)

  const handleSendAlert = () => {
    addNotification({
      title: `Alert: ${patient.name}`,
      message: `Nurse call triggered for ${patient.name} in Room ${patient.room}. On-call staff notified.`,
      type: 'alert',
    })
  }

  return (
    <div style={{ padding: '24px 32px', overflowY: 'auto', height: '100%' }} className="fade-in">
      {/* Back */}
      <button onClick={() => navigate('/patients')} style={{
        display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)',
        fontSize: 13, marginBottom: 20, transition: 'var(--transition)', cursor: 'pointer',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <ArrowLeft size={15} /> Back to Patients
      </button>

      {/* Hero card */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18, flexShrink: 0,
          background: AVATAR_GRADIENTS[avatarIndex],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 800, color: 'white',
        }}>{patient.avatar}</div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
              {patient.name}
            </h1>
            <span style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800,
              color: sc.text, background: sc.bg, letterSpacing: '0.5px',
            }}>{patient.status.toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>
            <span><strong style={{ color: 'var(--text-muted)', fontSize: 11 }}>ID</strong> {patient.id}</span>
            <span><strong style={{ color: 'var(--text-muted)', fontSize: 11 }}>AGE</strong> {patient.age} yrs</span>
            <span><strong style={{ color: 'var(--text-muted)', fontSize: 11 }}>GENDER</strong> {patient.gender}</span>
            <span><strong style={{ color: 'var(--text-muted)', fontSize: 11 }}>BLOOD</strong> {patient.bloodType}</span>
            <span><strong style={{ color: 'var(--text-muted)', fontSize: 11 }}>ROOM</strong> {patient.room}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Condition: </span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{patient.condition}</span>
            <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>·</span>
            <span style={{ color: 'var(--text-muted)' }}>Attending: </span>
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{patient.doctor}</span>
          </div>
        </div>

        <button onClick={handleSendAlert} style={{
          padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: 'var(--accent-red-soft)', color: 'var(--accent-red)',
          border: '1px solid rgba(247,95,106,0.3)', cursor: 'pointer', transition: 'var(--transition)',
          flexShrink: 0,
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(247,95,106,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent-red-soft)')}
        >🚨 Nurse Call</button>
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Contact info */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '20px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}>
            CONTACT & ADMISSION
          </h3>
          {[
            { icon: Phone, label: 'Phone', value: patient.phone },
            { icon: Mail, label: 'Email', value: patient.email },
            { icon: Calendar, label: 'Admitted', value: patient.admissionDate },
            { icon: Calendar, label: 'Last Visit', value: patient.lastVisit },
            { icon: MapPin, label: 'Room', value: patient.room },
            { icon: Syringe, label: 'Blood Type', value: patient.bloodType },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', borderBottom: '1px solid var(--border)',
            }}>
              <Icon size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 70, flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Current vitals */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '20px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}>
            CURRENT VITALS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: Heart, label: 'Heart Rate', value: `${patient.vitals.heartRate}`, unit: 'bpm', color: 'var(--accent-red)', alert: patient.vitals.heartRate > 100 },
              { icon: Droplets, label: 'Blood Pressure', value: patient.vitals.bloodPressure, unit: 'mmHg', color: 'var(--accent)', alert: false },
              { icon: Thermometer, label: 'Temperature', value: `${patient.vitals.temperature}`, unit: '°F', color: 'var(--accent-amber)', alert: patient.vitals.temperature > 100 },
              { icon: Wind, label: 'SpO₂', value: `${patient.vitals.oxygenSat}`, unit: '%', color: 'var(--accent-green)', alert: patient.vitals.oxygenSat < 95 },
            ].map(({ icon: Icon, label, value, unit, color, alert }) => (
              <div key={label} style={{
                background: alert ? `${color}15` : 'var(--bg-elevated)',
                border: `1px solid ${alert ? color : 'var(--border)'}`,
                borderRadius: 10, padding: '14px',
                animation: alert ? 'glow 2s ease infinite' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Icon size={13} style={{ color }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                  {alert && <span style={{ fontSize: 9, color, fontWeight: 800, marginLeft: 'auto' }}>⚠ HIGH</span>}
                </div>
                <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 800, color, lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {[
          { title: 'Heart Rate (7d)', data: hrHistory, color: 'var(--accent-red)', domain: [50, 130] },
          { title: 'SpO₂ (7d)', data: o2History, color: 'var(--accent-green)', domain: [88, 100] },
          { title: 'Temperature (7d)', data: tmpHistory, color: 'var(--accent-amber)', domain: [96, 103] },
        ].map(({ title, data, color, domain }) => (
          <div key={title} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '18px',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14 }}>{title}</div>
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: '#505878', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={domain as [number,number]} hide />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
