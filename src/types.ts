export type Role = 'HR Administrator' | 'HR Officer' | 'Department Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  department: string;
  position: string;
  avatar?: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Probationary' | 'Terminated';
  leaveBalance: number;
  avatar: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number | null;
  status: 'On Time' | 'Late' | 'Overtime' | 'Clocked In' | 'Absent';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'Vacation Leave' | 'Sick Leave' | 'Emergency Leave' | 'Personal Leave' | 'Maternity/Paternity' | 'Bereavement';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  period: string;
  basicSalary: number;
  allowances: number;
  overtimePay: number;
  grossPay: number;
  taxDeduction: number;
  socialSecurity: number;
  healthInsurance: number;
  totalDeductions: number;
  netPay: number;
  status: 'Disbursed' | 'Pending Approval';
  paymentDate: string;
}

export interface DTRUpload {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  period: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
  totalDaysWorked: number;
  totalRegularHours: number;
  totalOvertimeHours: number;
  supervisorSignature: boolean;
  employeeSignature: boolean;
  remarks?: string;
}

export type NavTab = 'HOME' | 'ABOUT US' | 'CONTACT' | 'LOG IN' | 'SIGN UP';
export type PortalTab = 'overview' | 'employees' | 'attendance' | 'dtr-upload' | 'leaves' | 'payroll' | 'profile';
