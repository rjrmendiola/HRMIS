import React, { useState, useEffect } from 'react';
import { NavTab, User, Employee, AttendanceRecord, LeaveRequest, PayrollRecord, DTRUpload } from './types';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { HomePage } from './components/pages/HomePage';
import { HRMISPortal } from './components/portal/HRMISPortal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import {
  INITIAL_USER,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_DTR_UPLOADS,
} from './data/mockData';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('LOG IN');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // HRMIS Persistent State
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('hrmis_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('hrmis_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('hrmis_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [payroll, setPayroll] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('hrmis_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [dtrUploads, setDtrUploads] = useState<DTRUpload[]>(() => {
    const saved = localStorage.getItem('hrmis_dtr_uploads');
    return saved ? JSON.parse(saved) : INITIAL_DTR_UPLOADS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hrmis_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hrmis_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('hrmis_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('hrmis_payroll', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('hrmis_dtr_uploads', JSON.stringify(dtrUploads));
  }, [dtrUploads]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Handlers
  const handleLoginSuccess = (username: string) => {
    // Check if user is the prototype user "rogelio"
    if (
      username.toLowerCase() === 'rogelio' ||
      username.toLowerCase() === 'admin' ||
      username.toLowerCase() === 'hello@reallygreatsite.com'
    ) {
      setCurrentUser(INITIAL_USER);
      addToast('success', 'Authentication Successful', `Welcome back, ${INITIAL_USER.name}!`);
    } else {
      // Custom user
      const storedUsersRaw = localStorage.getItem('hrmis_registered_users');
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const found = storedUsers.find(
        (u: any) =>
          u.username.toLowerCase() === username.toLowerCase() ||
          u.email.toLowerCase() === username.toLowerCase()
      );

      const userToSet: User = found || {
        id: `usr-${Date.now()}`,
        name: username,
        username: username,
        email: `${username}@hrmis.enterprise.ph`,
        role: 'Employee',
        department: 'Operations',
        position: 'Personnel Specialist',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      };

      setCurrentUser(userToSet);
      addToast('success', 'Logged In', `Signed in as ${userToSet.name}`);
    }

    setIsPortalOpen(true);
    setActiveTab('HOME');
  };

  const handleSignUpSuccess = (newUser: User) => {
    setCurrentUser(newUser);
    // Also add to employee directory
    const newEmpRecord: Employee = {
      id: `emp-${Date.now()}`,
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newUser.name,
      email: newUser.email,
      phone: '+63 917 000 0000',
      position: newUser.position,
      department: newUser.department,
      salary: 75000,
      hireDate: newUser.joinDate,
      status: 'Active',
      leaveBalance: 15,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    };
    setEmployees((prev) => [newEmpRecord, ...prev]);

    addToast('success', 'Account Created', `Welcome to HRMIS, ${newUser.name}! Your account is active.`);
    setIsPortalOpen(true);
    setActiveTab('HOME');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsPortalOpen(false);
    setActiveTab('LOG IN');
    addToast('info', 'Logged Out', 'You have been safely signed out of HRMIS.');
  };

  // Portal Actions
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
    addToast('success', 'Personnel Registered', `${newEmp.name} added to employee directory.`);
  };

  const handleClockIn = () => {
    if (!currentUser) return;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      date: todayStr,
      clockIn: timeStr,
      clockOut: null,
      totalHours: null,
      status: 'Clocked In',
    };

    setAttendance((prev) => [newRecord, ...prev]);
    addToast('success', 'Time Record Started', `Clock-in recorded at ${timeStr}`);
  };

  const handleClockOut = () => {
    if (!currentUser) return;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.employeeName.toLowerCase().includes(currentUser.name.toLowerCase()) && rec.date === todayStr && !rec.clockOut) {
          return {
            ...rec,
            clockOut: timeStr,
            totalHours: 8.5,
            status: 'On Time',
          };
        }
        return rec;
      })
    );

    addToast('info', 'Time Record Completed', `Clock-out recorded at ${timeStr}. Shift summary logged.`);
  };

  const handleApplyLeave = (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => {
    const newLeave: LeaveRequest = {
      ...req,
      id: `lev-${Date.now()}`,
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };
    setLeaves((prev) => [newLeave, ...prev]);
    addToast('success', 'Leave Filed', `Application for ${req.leaveType} (${req.days} days) submitted for approval.`);
  };

  const handleUpdateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    addToast(
      status === 'Approved' ? 'success' : 'error',
      `Leave Application ${status}`,
      `The request has been marked as ${status.toLowerCase()}.`
    );
  };

  const handleUploadDTR = (newDtr: DTRUpload) => {
    setDtrUploads((prev) => [newDtr, ...prev]);
    addToast('success', 'DTR PDF Uploaded', `${newDtr.fileName} has been submitted for verification.`);
  };

  const handleUpdateDTRStatus = (id: string, status: 'Verified' | 'Rejected') => {
    setDtrUploads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    addToast(
      status === 'Verified' ? 'success' : 'error',
      `DTR ${status}`,
      `Daily Time Record has been marked as ${status.toLowerCase()}.`
    );
  };

  const handleDeleteDTR = (id: string) => {
    setDtrUploads((prev) => prev.filter((d) => d.id !== id));
    addToast('info', 'Record Removed', 'The uploaded DTR file has been deleted.');
  };

  return (
    <div className="min-h-screen hrmis-bg text-white relative flex flex-col justify-between overflow-x-hidden">
      {/* Background Aesthetic Beams matching prototype images */}
      <div className="hrmis-bg-beams">
        <div className="hrmis-beam-1" />
        <div className="hrmis-beam-2" />
        <div className="hrmis-beam-3" />
      </div>

      {/* Global Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Password Reset Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onPasswordResetSuccess={() => {
          addToast('success', 'Credentials Updated', 'Please log in with your new password.');
          setActiveTab('LOG IN');
        }}
      />

      {/* Top Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsPortalOpen(false);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenPortal={() => {
          setIsPortalOpen(true);
          setActiveTab('HOME');
        }}
        isPortalOpen={isPortalOpen}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-10 sm:py-16">
        <AnimatePresence mode="wait">
          {/* Authenticated Full Portal View */}
          {isPortalOpen && currentUser ? (
            <HRMISPortal
              key="portal-view"
              currentUser={currentUser}
              employees={employees}
              attendance={attendance}
              dtrUploads={dtrUploads}
              leaves={leaves}
              payroll={payroll}
              onAddEmployee={handleAddEmployee}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              onUploadDTR={handleUploadDTR}
              onUpdateDTRStatus={handleUpdateDTRStatus}
              onDeleteDTR={handleDeleteDTR}
              onApplyLeave={handleApplyLeave}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
              onLogout={handleLogout}
              onClosePortal={() => setIsPortalOpen(false)}
            />
          ) : (
            /* Prototype Page Views */
            <>
              {activeTab === 'LOG IN' && (
                <LoginForm
                  key="login-form"
                  onSuccess={handleLoginSuccess}
                  onSwitchToSignUp={() => setActiveTab('SIGN UP')}
                  onForgotPassword={() => setIsForgotPasswordOpen(true)}
                />
              )}

              {activeTab === 'SIGN UP' && (
                <SignUpForm
                  key="signup-form"
                  onSuccess={handleSignUpSuccess}
                  onSwitchToLogin={() => setActiveTab('LOG IN')}
                />
              )}

              {activeTab === 'HOME' && (
                <HomePage
                  key="home-page"
                  onGoToAuth={(mode) => setActiveTab(mode)}
                  currentUser={currentUser}
                  onOpenPortal={() => setIsPortalOpen(true)}
                />
              )}

              {activeTab === 'ABOUT US' && (
                <AboutUsPage
                  key="about-page"
                  onGoToAuth={(mode) => setActiveTab(mode)}
                />
              )}

              {activeTab === 'CONTACT' && (
                <ContactUsPage
                  key="contact-page"
                  onSuccessToast={(title, msg) => addToast('success', title, msg)}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Footer Bar */}
      <footer className="relative z-20 py-4 px-6 text-center text-[11px] text-blue-200/60 border-t border-blue-900/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HRMIS © {new Date().getFullYear()} Human Resource Management Information System. All rights reserved.</span>
          <div className="flex items-center gap-4 text-blue-300/80">
            <button onClick={() => { setActiveTab('HOME'); setIsPortalOpen(false); }} className="hover:text-white transition-colors">Home</button>
            <span>•</span>
            <button onClick={() => { setActiveTab('ABOUT US'); setIsPortalOpen(false); }} className="hover:text-white transition-colors">About System</button>
            <span>•</span>
            <button onClick={() => { setActiveTab('CONTACT'); setIsPortalOpen(false); }} className="hover:text-white transition-colors">HR Desk</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
