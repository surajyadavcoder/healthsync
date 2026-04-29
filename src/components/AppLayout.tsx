import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import NotificationPanel from './NotificationPanel'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
      <NotificationPanel />
    </div>
  )
}
