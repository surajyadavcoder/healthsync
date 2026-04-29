export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  status: 'Stable' | 'Critical' | 'Recovering' | 'Discharged';
  doctor: string;
  admissionDate: string;
  room: string;
  bloodType: string;
  phone: string;
  email: string;
  lastVisit: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
  };
  avatar: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'Admin' | 'Doctor' | 'Nurse';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  timestamp: Date;
  read: boolean;
}

export interface AnalyticsStat {
  label: string;
  value: number;
  change: number;
  unit?: string;
}
