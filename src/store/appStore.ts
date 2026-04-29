import { create } from 'zustand'
import { Patient, User, Notification } from '../types'
import { mockPatients } from '../utils/mockData'
import { loginWithEmailPassword, logoutUser, friendlyAuthError } from '../firebase/authService'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  authLoading: boolean
  authError: string | null
  patients: Patient[]
  selectedPatient: Patient | null
  patientViewMode: 'grid' | 'list'
  searchQuery: string
  statusFilter: string
  notifications: Notification[]
  showNotificationPanel: boolean
  sidebarCollapsed: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setSelectedPatient: (patient: Patient | null) => void
  setPatientViewMode: (mode: 'grid' | 'list') => void
  setSearchQuery: (q: string) => void
  setStatusFilter: (f: string) => void
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllRead: () => void
  dismissNotification: (id: string) => void
  toggleNotificationPanel: () => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,
  patients: mockPatients,
  selectedPatient: null,
  patientViewMode: 'grid',
  searchQuery: '',
  statusFilter: 'All',
  notifications: [
    { id: 'n1', title: 'Critical Alert', read: false, message: 'Patient Ravi Kumar (ICU-3) vitals are deteriorating. Immediate attention required.', type: 'alert', timestamp: new Date(Date.now() - 5 * 60000) },
    { id: 'n2', title: 'Lab Results Ready', read: false, message: 'Lab results for Sunita Patel are now available for review.', type: 'info', timestamp: new Date(Date.now() - 15 * 60000) },
    { id: 'n3', title: 'Discharge Approved', read: true, message: 'Karan Singh has been successfully discharged from Ward B.', type: 'success', timestamp: new Date(Date.now() - 60 * 60000) },
  ],
  showNotificationPanel: false,
  sidebarCollapsed: false,

  login: async (email, password) => {
    set({ authLoading: true, authError: null })
    try {
      const user = await loginWithEmailPassword(email, password)
      set({ user, isAuthenticated: true, authLoading: false })
      setTimeout(() => {
        get().addNotification({ title: 'Welcome back!', message: `Logged in as ${user.displayName}. ${get().notifications.filter(n => !n.read).length} unread alerts.`, type: 'success' })
      }, 800)
    } catch (err: any) {
      set({ authError: friendlyAuthError(err?.code ?? 'unknown'), authLoading: false })
    }
  },

  logout: async () => { await logoutUser(); set({ user: null, isAuthenticated: false, authError: null }) },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setPatientViewMode: (mode) => set({ patientViewMode: mode }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setStatusFilter: (f) => set({ statusFilter: f }),

  addNotification: (n) => {
    const notification: Notification = { ...n, id: `n${Date.now()}`, timestamp: new Date(), read: false }
    set(s => ({ notifications: [notification, ...s.notifications] }))
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(notification.title, { body: notification.message, icon: '/favicon.svg', tag: 'healthsync' })
    }
  },
  markNotificationRead: (id) => set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
  markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
  dismissNotification: (id) => set(s => ({ notifications: s.notifications.filter(n => n.id !== id) })),
  toggleNotificationPanel: () => set(s => ({ showNotificationPanel: !s.showNotificationPanel })),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
