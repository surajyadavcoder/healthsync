import { useAppStore } from '../store/appStore'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadialBarChart, RadialBar,
} from 'recharts'
import { admissionsData, conditionData, weeklyVitals } from '../utils/mockData'
import { TrendingUp, TrendingDown, Users, Activity } from 'lucide-react'

const PIE_COLORS = ['#4f8ef7','#22d3a5','#f75f6a','#f5a623','#a78bfa','#505878']

function StatCard({ label, value, change, unit, icon: Icon, color }: {
  label: string; value: number; change: number; unit?: string;
  icon: React.ElementType; color: string
}) {
  const up = change >= 0
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
          color: up ? 'var(--accent-green)' : 'var(--accent-red)',
          background: up ? 'var(--accent-green-soft)' : 'var(--accent-red-soft)',
          padding: '3px 8px', borderRadius: 20,
        }}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div style={{ fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-1px', color }}>
        {value}{unit && <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { patients } = useAppStore()

  const avgHR = Math.round(patients.reduce((s, p) => s + p.vitals.heartRate, 0) / patients.length)
  const avgO2 = Math.round(patients.reduce((s, p) => s + p.vitals.oxygenSat, 0) / patients.length)

  const radialData = [
    { name: 'Stable', value: patients.filter(p => p.status === 'Stable').length, fill: '#22d3a5' },
    { name: 'Recovering', value: patients.filter(p => p.status === 'Recovering').length, fill: '#f5a623' },
    { name: 'Critical', value: patients.filter(p => p.status === 'Critical').length, fill: '#f75f6a' },
    { name: 'Discharged', value: patients.filter(p => p.status === 'Discharged').length, fill: '#505878' },
  ]

  return (
    <div style={{ padding: '24px 32px', overflowY: 'auto', height: '100%' }} className="fade-in">
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Patients" value={patients.length} change={12} icon={Users} color="var(--accent)" />
        <StatCard label="Avg Heart Rate" value={avgHR} unit="bpm" change={-3} icon={Activity} color="var(--accent-red)" />
        <StatCard label="Avg SpO₂" value={avgO2} unit="%" change={1} icon={TrendingUp} color="var(--accent-green)" />
        <StatCard label="This Month Admits" value={48} change={8} icon={Users} color="var(--accent-amber)" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Admissions bar */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Monthly Admissions vs Discharges</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>6-month comparison overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={admissionsData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#505878', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#505878', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="admissions" fill="#4f8ef7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="discharges" fill="#22d3a5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="critical" fill="#f75f6a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Condition pie */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Conditions Distribution</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Current patient conditions breakdown</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={conditionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {conditionData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {conditionData.map((d, i) => (
                <div key={d.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Weekly vitals line */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Weekly Average Vitals</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Avg Heart Rate and SpO₂ across all patients</p>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={weeklyVitals}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: '#505878', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#505878', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Line type="monotone" dataKey="avgHR" stroke="#f75f6a" strokeWidth={2} dot={{ r: 4 }} name="Avg HR" />
              <Line type="monotone" dataKey="avgO2" stroke="#22d3a5" strokeWidth={2} dot={{ r: 4 }} name="Avg SpO₂" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Patient status radial */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '22px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Status Overview</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Patient status distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={75} data={radialData}>
              <RadialBar dataKey="value" cornerRadius={4} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 8 }}>
            {radialData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.fill }} />
                <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
