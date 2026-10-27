import React, { useState, useEffect } from 'react';
import {
  User,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  PortalTab,
  DTRUpload,
} from '../../types';
import { DTRUploadModal } from './DTRUploadModal';
import { DTRViewerModal } from './DTRViewerModal';
import { DTRUploadSection } from './DTRUploadSection';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  UserCheck,
  Search,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  Briefcase,
  Mail,
  Phone,
  Building,
  Shield,
  LogOut,
  ChevronRight,
  Printer,
  X,
  UploadCloud,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HRMISPortalProps {
  currentUser: User;
  employees: Employee[];
  attendance: AttendanceRecord[];
  dtrUploads: DTRUpload[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
  onAddEmployee: (emp: Employee) => void;
  onClockIn: () => void;
  onClockOut: () => void;
  onUploadDTR: (dtr: DTRUpload) => void;
  onUpdateDTRStatus: (id: string, status: 'Verified' | 'Rejected') => void;
  onDeleteDTR: (id: string) => void;
  onApplyLeave: (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => void;
  onUpdateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  onLogout: () => void;
  onClosePortal: () => void;
}

export const HRMISPortal: React.FC<HRMISPortalProps> = ({
  currentUser,
  employees,
  attendance,
  dtrUploads,
  leaves,
  payroll,
  onAddEmployee,
  onClockIn,
  onClockOut,
  onUploadDTR,
  onUpdateDTRStatus,
  onDeleteDTR,
  onApplyLeave,
  onUpdateLeaveStatus,
  onLogout,
  onClosePortal,
}) => {
  const [activeTab, setActiveTab] = useState<PortalTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Live Clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if current user is clocked in today
  const todayStr = currentTime.toISOString().split('T')[0];
  const userTodayAttendance = attendance.find(
    (a) => a.employeeName.toLowerCase().includes(currentUser.name.toLowerCase()) && a.date === todayStr
  );
  const isClockedIn = userTodayAttendance && !userTodayAttendance.clockOut;

  // Modals state
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [isDTRUploadModalOpen, setIsDTRUploadModalOpen] = useState(false);
  const [viewingDTR, setViewingDTR] = useState<DTRUpload | null>(null);

  // New employee form
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPosition, setNewEmpPosition] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Human Resources');
  const [newEmpSalary, setNewEmpSalary] = useState('85000');
  const [newEmpPhone, setNewEmpPhone] = useState('+63 917 ');

  // Apply leave form
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Vacation Leave');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim()) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newEmpName.trim(),
      email: newEmpEmail.trim(),
      phone: newEmpPhone.trim(),
      position: newEmpPosition.trim() || 'Personnel Specialist',
      department: newEmpDept,
      salary: parseFloat(newEmpSalary) || 75000,
      hireDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      leaveBalance: 15,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    };

    onAddEmployee(newEmp);
    setIsAddEmployeeOpen(false);
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpPosition('');
  };

  const handleFileLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate || !leaveReason.trim()) return;

    const start = new Date(leaveStartDate);
    const end = new Date(leaveEndDate);
    const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    onApplyLeave({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      leaveType: leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      days: diffDays,
      reason: leaveReason.trim(),
    });

    setIsApplyLeaveOpen(false);
    setLeaveReason('');
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesQuery =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchesQuery && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-7xl mx-auto px-4 pb-12"
    >
      {/* Main Portal Container */}
      <div className="rounded-[32px] bg-[#090f1d] border border-blue-900/30 shadow-[0_25px_60px_-15px_rgba(2,10,28,0.85),0_0_50px_-10px_rgba(26,92,206,0.25)] overflow-hidden">
        
        {/* Top Portal Banner with Live Clock & Quick Action */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0a1428] via-[#0f1f3d] to-[#0a1428] border-b border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-400 p-[2px] shadow-lg shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#070e1c] flex items-center justify-center overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-6 h-6 text-blue-300" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {currentUser.position} • {currentUser.department}
              </p>
            </div>
          </div>

          {/* Real-time Clock & Attendance Puncher */}
          <div className="flex flex-wrap items-center gap-4 bg-[#081020] p-3.5 rounded-2xl border border-blue-900/50">
            <div className="text-right pr-3 border-r border-blue-900/40">
              <div className="text-lg sm:text-xl font-bold font-mono text-white tracking-wider">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[11px] text-blue-300">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {isClockedIn ? (
              <button
                onClick={onClockOut}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 transition-all shadow-md shadow-rose-950/50 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                Clock Out (End Shift)
              </button>
            ) : (
              <button
                onClick={onClockIn}
                className="px-5 py-2.5 rounded-full text-xs font-semibold hrmis-btn-gradient text-white flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-950/50"
              >
                <Clock className="w-4 h-4" />
                Clock In (Start Shift)
              </button>
            )}
          </div>
        </div>

        {/* Portal Nav Tabs */}
        <div className="px-6 sm:px-8 border-b border-blue-900/30 bg-[#080d1a] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'employees', label: 'Employee Directory', icon: Users, badge: employees.length },
            { id: 'attendance', label: 'Time & Attendance', icon: Clock },
            { id: 'dtr-upload', label: 'DTR Upload (PDF)', icon: FileText, badge: dtrUploads.filter(d => d.status === 'Pending Review').length },
            { id: 'leaves', label: 'Leave Filing', icon: Calendar, badge: leaves.filter(l => l.status === 'Pending').length },
            { id: 'payroll', label: 'Payroll & Slips', icon: DollarSign },
            { id: 'profile', label: 'My Profile', icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PortalTab)}
                className={`flex items-center gap-2 py-4 px-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-500 text-blue-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-[#11192c] border border-blue-900/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Headcount</span>
                    <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mt-3 font-mono">{employees.length}</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+100% Active Deployment</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#11192c] border border-blue-900/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Clocked In Today</span>
                    <div className="p-2 rounded-xl bg-sky-600/20 text-sky-400">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mt-3 font-mono">
                    {attendance.filter((a) => a.date === todayStr).length}
                  </div>
                  <div className="text-xs text-blue-300 mt-2">
                    95.2% on-time attendance today
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#11192c] border border-blue-900/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Pending Leaves</span>
                    <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mt-3 font-mono">
                    {leaves.filter((l) => l.status === 'Pending').length}
                  </div>
                  <div className="text-xs text-amber-300 mt-2">
                    Awaiting admin endorsement
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#11192c] border border-blue-900/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Current Payroll Run</span>
                    <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mt-3 font-mono">₱267k</div>
                  <div className="text-xs text-emerald-400 mt-2">
                    Disbursed for October cycle
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Leaves */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Attendance Today */}
                <div className="lg:col-span-7 bg-[#11192c] p-6 rounded-2xl border border-blue-900/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Live Attendance Log ({todayStr})
                    </h3>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {attendance.slice(0, 4).map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-[#152037] border border-blue-900/40 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{att.employeeName}</p>
                          <p className="text-slate-400 text-[11px]">{att.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-blue-300 font-medium">{att.clockIn}</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${
                            att.status === 'Late'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {att.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Leave Requests */}
                <div className="lg:col-span-5 bg-[#11192c] p-6 rounded-2xl border border-blue-900/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Leave Approvals
                    </h3>
                    <button
                      onClick={() => setIsApplyLeaveOpen(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      File Leave
                    </button>
                  </div>

                  <div className="space-y-3">
                    {leaves.map((leave) => (
                      <div
                        key={leave.id}
                        className="p-3.5 rounded-xl bg-[#152037] border border-blue-900/40 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{leave.employeeName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            leave.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : leave.status === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{leave.leaveType} • {leave.days} day(s)</p>
                        <p className="text-[11px] text-slate-400 italic line-clamp-1">"{leave.reason}"</p>

                        {leave.status === 'Pending' && currentUser.role.includes('HR') && (
                          <div className="flex items-center gap-2 pt-1 border-t border-blue-900/40">
                            <button
                              onClick={() => onUpdateLeaveStatus(leave.id, 'Approved')}
                              className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => onUpdateLeaveStatus(leave.id, 'Rejected')}
                              className="px-2.5 py-1 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DTR PDF Quick Access Row in Overview */}
              <div className="p-6 rounded-2xl bg-[#11192c] border border-blue-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">Daily Time Record (DTR) PDF Status</h3>
                      <p className="text-xs text-slate-400">CSC Form 48 monthly submissions and supervisor sign-offs</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsDTRUploadModalOpen(true)}
                      className="px-4 py-2 rounded-full text-xs font-semibold hrmis-btn-gradient text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload DTR (PDF)
                    </button>
                    <button
                      onClick={() => setActiveTab('dtr-upload')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View All Submissions →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dtrUploads.slice(0, 3).map((dtr) => (
                    <div
                      key={dtr.id}
                      onClick={() => setViewingDTR(dtr)}
                      className="p-4 rounded-xl bg-[#152037] border border-blue-900/40 hover:border-blue-500/40 cursor-pointer transition-all text-xs space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white group-hover:text-blue-300 transition-colors truncate max-w-[160px]">
                          {dtr.employeeName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          dtr.status === 'Verified'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {dtr.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-300 font-mono truncate">{dtr.fileName}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-blue-900/30">
                        <span>Period: {dtr.period}</span>
                        <span className="text-blue-400 font-semibold group-hover:underline">Inspect PDF</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYEE DIRECTORY */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              {/* Search & Actions bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search employee by name, code, or position..."
                      className="w-full h-11 pl-11 pr-4 rounded-full bg-[#131b2e] text-white text-xs sm:text-sm border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="h-11 px-4 rounded-full bg-[#131b2e] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold hrmis-btn-gradient text-white flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Add New Personnel
                </button>
              </div>

              {/* Employee Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-5 rounded-2xl bg-[#11192c] border border-blue-900/30 hover:border-blue-500/40 transition-all text-xs"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-12 h-12 rounded-xl object-cover border border-blue-500/30"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-blue-400 font-semibold">{emp.employeeCode}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            emp.status === 'Active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {emp.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate mt-0.5">{emp.name}</h4>
                        <p className="text-slate-300 text-[11px] truncate">{emp.position}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-blue-900/40 space-y-2 text-slate-300 text-[11px]">
                      <div className="flex items-center gap-2 truncate">
                        <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{emp.department}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{emp.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-blue-900/30 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Leave Credits: <b className="text-white font-mono">{emp.leaveBalance}d</b></span>
                      <span className="text-blue-300 font-mono font-medium">₱{emp.salary.toLocaleString()}/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Daily Time Records (DTR)</h3>
                  <p className="text-xs text-slate-400">Real-time attendance logs, clock-in timestamps, and hours worked</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsDTRUploadModalOpen(true)}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                    <span>Upload DTR (PDF)</span>
                  </button>

                  {isClockedIn ? (
                    <button
                      onClick={onClockOut}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                      Clock Out
                    </button>
                  ) : (
                    <button
                      onClick={onClockIn}
                      className="px-4 py-2 rounded-full text-xs font-semibold hrmis-btn-gradient text-white transition-all cursor-pointer"
                    >
                      Clock In Now
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-blue-900/40 bg-[#11192c]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#15213b] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-900/40">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Time In</th>
                      <th className="py-3 px-4">Time Out</th>
                      <th className="py-3 px-4">Total Hours</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/30">
                    {attendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-blue-950/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">{rec.date}</td>
                        <td className="py-3.5 px-4 font-medium text-white">{rec.employeeName}</td>
                        <td className="py-3.5 px-4 text-slate-300">{rec.department}</td>
                        <td className="py-3.5 px-4 font-mono text-blue-300 font-semibold">{rec.clockIn}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{rec.clockOut || '—'}</td>
                        <td className="py-3.5 px-4 font-mono text-white">
                          {rec.totalHours ? `${rec.totalHours.toFixed(2)} hrs` : 'Active'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            rec.status === 'On Time' || rec.status === 'Clocked In'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : rec.status === 'Late'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-sky-500/20 text-sky-300'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3.5: DTR UPLOAD (PDF) SECTION */}
          {activeTab === 'dtr-upload' && (
            <DTRUploadSection
              dtrUploads={dtrUploads}
              onOpenUploadModal={() => setIsDTRUploadModalOpen(true)}
              onViewDTR={(dtr) => setViewingDTR(dtr)}
              onUpdateStatus={onUpdateDTRStatus}
              onDeleteDTR={onDeleteDTR}
              currentUser={currentUser}
            />
          )}

          {/* TAB 4: LEAVE MANAGEMENT */}
          {activeTab === 'leaves' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Leave Filing & Approval Central</h3>
                  <p className="text-xs text-slate-400">File leave requests and manage workforce attendance coverage</p>
                </div>
                <button
                  onClick={() => setIsApplyLeaveOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold hrmis-btn-gradient text-white flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  File Leave Application
                </button>
              </div>

              {/* Leave Requests Table */}
              <div className="overflow-x-auto rounded-2xl border border-blue-900/40 bg-[#11192c]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#15213b] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-900/40">
                    <tr>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Schedule</th>
                      <th className="py-3 px-4">Days</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/30">
                    {leaves.map((l) => (
                      <tr key={l.id} className="hover:bg-blue-950/30 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">{l.employeeName}</td>
                        <td className="py-3.5 px-4 text-blue-300 font-medium">{l.leaveType}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                          {l.startDate} to {l.endDate}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">{l.days}</td>
                        <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{l.reason}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            l.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : l.status === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {l.status === 'Pending' && currentUser.role.includes('HR') ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onUpdateLeaveStatus(l.id, 'Approved')}
                                className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/60 text-emerald-300 text-[11px] font-semibold transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => onUpdateLeaveStatus(l.id, 'Rejected')}
                                className="px-2.5 py-1 rounded bg-rose-600/30 hover:bg-rose-600/60 text-rose-300 text-[11px] font-semibold transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PAYROLL */}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Payroll & Payslip Records</h3>
                  <p className="text-xs text-slate-400">Monthly compensation, statutory contributions, and net payouts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {payroll.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-5 rounded-2xl bg-[#11192c] border border-blue-900/30 hover:border-blue-500/40 transition-all text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                          Period: {pay.period}
                        </span>
                        <h4 className="text-base font-semibold text-white mt-1">{pay.employeeName}</h4>
                        <p className="text-slate-300 text-[11px]">{pay.position}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {pay.status}
                      </span>
                    </div>

                    <div className="mt-4 p-3.5 rounded-xl bg-[#091122] border border-blue-900/40 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-slate-400">Gross Pay</p>
                        <p className="font-mono font-bold text-white mt-0.5">₱{pay.grossPay.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Deductions</p>
                        <p className="font-mono font-bold text-rose-400 mt-0.5">-₱{pay.totalDeductions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Net Pay</p>
                        <p className="font-mono font-bold text-emerald-400 mt-0.5">₱{pay.netPay.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-blue-900/30 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Disbursed: {pay.paymentDate}</span>
                      <button
                        onClick={() => setSelectedPayslip(pay)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        View Payslip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#11192c] border border-blue-900/30 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
                  <p className="text-xs text-blue-300">{currentUser.role} • {currentUser.department}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Personnel ID: {currentUser.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#091122] border border-blue-900/40">
                  <span className="text-[11px] text-slate-400">Registered Work Email</span>
                  <p className="font-medium text-white mt-1">{currentUser.email}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#091122] border border-blue-900/40">
                  <span className="text-[11px] text-slate-400">Username</span>
                  <p className="font-medium text-white mt-1">@{currentUser.username}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#091122] border border-blue-900/40">
                  <span className="text-[11px] text-slate-400">Date Onboarded</span>
                  <p className="font-medium text-white mt-1">{currentUser.joinDate}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#091122] border border-blue-900/40">
                  <span className="text-[11px] text-slate-400">Account Status</span>
                  <p className="font-medium text-emerald-400 mt-1">Active & Verified</p>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-900/40 flex items-center justify-between">
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of HRMIS
                </button>
                <button
                  onClick={onClosePortal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  Return to Main Site
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL 1: ADD EMPLOYEE */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#090f1d] border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAddEmployeeOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-1">Add New Personnel</h3>
            <p className="text-xs text-slate-400 mb-6">Create employee record in digital HR directory</p>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 pl-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 pl-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    placeholder="john@hrmis.ph"
                    className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 pl-1">Position Title</label>
                  <input
                    type="text"
                    required
                    value={newEmpPosition}
                    onChange={(e) => setNewEmpPosition(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 pl-1">Department</label>
                  <select
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                    className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Human Resources">Human Resources</option>
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance & Treasury">Finance & Treasury</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Product & UX">Product & UX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 pl-1">Monthly Salary (PHP)</label>
                  <input
                    type="number"
                    value={newEmpSalary}
                    onChange={(e) => setNewEmpSalary(e.target.value)}
                    className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 pl-1">Phone Number</label>
                  <input
                    type="text"
                    value={newEmpPhone}
                    onChange={(e) => setNewEmpPhone(e.target.value)}
                    className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-full text-white font-medium text-xs sm:text-sm hrmis-btn-gradient cursor-pointer mt-4"
              >
                Save Employee Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLY FOR LEAVE */}
      {isApplyLeaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#090f1d] border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsApplyLeaveOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-1">File Leave Application</h3>
            <p className="text-xs text-slate-400 mb-6">Submit for administrative supervisor approval</p>

            <form onSubmit={handleFileLeave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 pl-1">Leave Classification</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Vacation Leave">Vacation Leave (VL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Emergency Leave">Emergency Leave (EL)</option>
                  <option value="Personal Leave">Personal Leave (PL)</option>
                  <option value="Maternity/Paternity">Maternity / Paternity Leave</option>
                  <option value="Bereavement">Bereavement Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 pl-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 pl-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full h-10 px-4 rounded-full bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 pl-1">Reason / Handover Notes</label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Detail the reason for requested leave..."
                  className="w-full p-3.5 rounded-2xl bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-full text-white font-medium text-xs sm:text-sm hrmis-btn-gradient cursor-pointer mt-4"
              >
                Submit Leave Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PAYSLIP VIEWER */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#080d19] border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-xs">
            <button
              onClick={() => setSelectedPayslip(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-blue-900/40">
              <span className="text-xl font-bold tracking-widest text-white">HRMIS</span>
              <p className="text-[11px] text-blue-300">Official Electronic Pay Slip</p>
              <p className="text-[10px] text-slate-400">Payroll Cycle: {selectedPayslip.period}</p>
            </div>

            <div className="my-4 space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Employee Name:</span>
                <span className="font-semibold text-white">{selectedPayslip.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <span>{selectedPayslip.department}</span>
              </div>
              <div className="flex justify-between">
                <span>Designation:</span>
                <span>{selectedPayslip.position}</span>
              </div>
            </div>

            {/* Earnings */}
            <div className="pt-3 border-t border-blue-900/30">
              <p className="font-semibold text-blue-400 mb-2 uppercase text-[10px]">Earnings</p>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Basic Semi-Monthly Pay:</span>
                  <span className="font-mono">₱{selectedPayslip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Allowances:</span>
                  <span className="font-mono">₱{selectedPayslip.allowances.toLocaleString()}</span>
                </div>
                {selectedPayslip.overtimePay > 0 && (
                  <div className="flex justify-between">
                    <span>Overtime Differential:</span>
                    <span className="font-mono">₱{selectedPayslip.overtimePay.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                  <span>Total Gross Earnings:</span>
                  <span className="font-mono text-blue-300">₱{selectedPayslip.grossPay.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="pt-3 mt-3 border-t border-blue-900/30">
              <p className="font-semibold text-rose-400 mb-2 uppercase text-[10px]">Statutory & Tax Deductions</p>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Withholding Income Tax:</span>
                  <span className="font-mono">₱{selectedPayslip.taxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Social Security System (SSS):</span>
                  <span className="font-mono">₱{selectedPayslip.socialSecurity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Insurance (PhilHealth):</span>
                  <span className="font-mono">₱{selectedPayslip.healthInsurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-300 pt-1 border-t border-slate-800">
                  <span>Total Deductions:</span>
                  <span className="font-mono">₱{selectedPayslip.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="mt-4 p-3.5 rounded-xl bg-blue-950/40 border border-blue-600/40 flex items-center justify-between">
              <span className="font-bold text-white text-sm">Net Take Home Pay:</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                ₱{selectedPayslip.netPay.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: UPLOAD DTR (PDF) */}
      <DTRUploadModal
        isOpen={isDTRUploadModalOpen}
        onClose={() => setIsDTRUploadModalOpen(false)}
        onUploadSuccess={onUploadDTR}
        currentUser={currentUser}
        employees={employees}
      />

      {/* MODAL 5: VIEW / INSPECT DTR (PDF) */}
      <DTRViewerModal
        dtr={viewingDTR}
        onClose={() => setViewingDTR(null)}
        onUpdateStatus={onUpdateDTRStatus}
        isAdmin={currentUser.role.includes('HR')}
      />

    </motion.div>
  );
};
