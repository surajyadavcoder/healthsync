import { Patient } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'P001', name: 'Arjun Mehta', age: 45, gender: 'Male',
    condition: 'Hypertension', status: 'Stable', doctor: 'Dr. Priya Sharma',
    admissionDate: '2024-03-10', room: 'A-204', bloodType: 'O+',
    phone: '+91 98765 43210', email: 'arjun.mehta@email.com', lastVisit: '2024-04-20',
    vitals: { heartRate: 78, bloodPressure: '130/85', temperature: 98.6, oxygenSat: 97 },
    avatar: 'AM'
  },
  {
    id: 'P002', name: 'Sunita Patel', age: 62, gender: 'Female',
    condition: 'Diabetes Type 2', status: 'Recovering', doctor: 'Dr. Rahul Gupta',
    admissionDate: '2024-03-15', room: 'B-108', bloodType: 'A+',
    phone: '+91 87654 32109', email: 'sunita.patel@email.com', lastVisit: '2024-04-22',
    vitals: { heartRate: 82, bloodPressure: '125/80', temperature: 99.1, oxygenSat: 96 },
    avatar: 'SP'
  },
  {
    id: 'P003', name: 'Ravi Kumar', age: 38, gender: 'Male',
    condition: 'Cardiac Arrest', status: 'Critical', doctor: 'Dr. Anjali Singh',
    admissionDate: '2024-04-18', room: 'ICU-3', bloodType: 'B-',
    phone: '+91 76543 21098', email: 'ravi.kumar@email.com', lastVisit: '2024-04-29',
    vitals: { heartRate: 102, bloodPressure: '145/95', temperature: 100.4, oxygenSat: 92 },
    avatar: 'RK'
  },
  {
    id: 'P004', name: 'Meena Joshi', age: 55, gender: 'Female',
    condition: 'Pneumonia', status: 'Recovering', doctor: 'Dr. Priya Sharma',
    admissionDate: '2024-04-05', room: 'C-312', bloodType: 'AB+',
    phone: '+91 65432 10987', email: 'meena.joshi@email.com', lastVisit: '2024-04-28',
    vitals: { heartRate: 88, bloodPressure: '118/76', temperature: 101.2, oxygenSat: 94 },
    avatar: 'MJ'
  },
  {
    id: 'P005', name: 'Deepak Verma', age: 29, gender: 'Male',
    condition: 'Appendicitis (Post-op)', status: 'Stable', doctor: 'Dr. Vikram Nair',
    admissionDate: '2024-04-22', room: 'A-115', bloodType: 'O-',
    phone: '+91 54321 09876', email: 'deepak.verma@email.com', lastVisit: '2024-04-27',
    vitals: { heartRate: 72, bloodPressure: '115/75', temperature: 98.2, oxygenSat: 99 },
    avatar: 'DV'
  },
  {
    id: 'P006', name: 'Lakshmi Rao', age: 71, gender: 'Female',
    condition: 'Osteoarthritis', status: 'Stable', doctor: 'Dr. Rahul Gupta',
    admissionDate: '2024-04-01', room: 'D-220', bloodType: 'A-',
    phone: '+91 43210 98765', email: 'lakshmi.rao@email.com', lastVisit: '2024-04-25',
    vitals: { heartRate: 68, bloodPressure: '122/78', temperature: 97.8, oxygenSat: 98 },
    avatar: 'LR'
  },
  {
    id: 'P007', name: 'Karan Singh', age: 42, gender: 'Male',
    condition: 'Kidney Stone', status: 'Discharged', doctor: 'Dr. Anjali Singh',
    admissionDate: '2024-03-28', room: '—', bloodType: 'B+',
    phone: '+91 32109 87654', email: 'karan.singh@email.com', lastVisit: '2024-04-15',
    vitals: { heartRate: 74, bloodPressure: '120/80', temperature: 98.6, oxygenSat: 98 },
    avatar: 'KS'
  },
  {
    id: 'P008', name: 'Pooja Nair', age: 34, gender: 'Female',
    condition: 'Migraine', status: 'Stable', doctor: 'Dr. Vikram Nair',
    admissionDate: '2024-04-25', room: 'B-207', bloodType: 'O+',
    phone: '+91 21098 76543', email: 'pooja.nair@email.com', lastVisit: '2024-04-29',
    vitals: { heartRate: 76, bloodPressure: '110/70', temperature: 98.4, oxygenSat: 99 },
    avatar: 'PN'
  },
];

export const admissionsData = [
  { month: 'Nov', admissions: 38, discharges: 32, critical: 5 },
  { month: 'Dec', admissions: 45, discharges: 40, critical: 8 },
  { month: 'Jan', admissions: 52, discharges: 48, critical: 6 },
  { month: 'Feb', admissions: 41, discharges: 37, critical: 4 },
  { month: 'Mar', admissions: 60, discharges: 55, critical: 9 },
  { month: 'Apr', admissions: 48, discharges: 42, critical: 7 },
];

export const conditionData = [
  { name: 'Hypertension', value: 28 },
  { name: 'Diabetes', value: 22 },
  { name: 'Cardiac', value: 18 },
  { name: 'Respiratory', value: 15 },
  { name: 'Orthopedic', value: 10 },
  { name: 'Other', value: 7 },
];

export const weeklyVitals = [
  { day: 'Mon', avgHR: 76, avgBP: 122, avgO2: 97 },
  { day: 'Tue', avgHR: 79, avgBP: 125, avgO2: 96 },
  { day: 'Wed', avgHR: 74, avgBP: 119, avgO2: 98 },
  { day: 'Thu', avgHR: 82, avgBP: 128, avgO2: 96 },
  { day: 'Fri', avgHR: 77, avgBP: 121, avgO2: 97 },
  { day: 'Sat', avgHR: 73, avgBP: 118, avgO2: 98 },
  { day: 'Sun', avgHR: 75, avgBP: 120, avgO2: 97 },
];
