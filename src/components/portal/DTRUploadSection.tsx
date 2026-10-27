import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  Trash2,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  Printer,
  Calendar,
} from 'lucide-react';
import { DTRUpload, Employee, User } from '../../types';

interface DTRUploadSectionProps {
  dtrUploads: DTRUpload[];
  onOpenUploadModal: () => void;
  onViewDTR: (dtr: DTRUpload) => void;
  onUpdateStatus: (id: string, status: 'Verified' | 'Rejected') => void;
  onDeleteDTR: (id: string) => void;
  currentUser: User;
}

export const DTRUploadSection: React.FC<DTRUploadSectionProps> = ({
  dtrUploads,
  onOpenUploadModal,
  onViewDTR,
  onUpdateStatus,
  onDeleteDTR,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Pending Review' | 'Rejected'>('All');
  const [periodFilter, setPeriodFilter] = useState<string>('All');

  const isAdmin = currentUser.role.includes('HR');

  // Filter list
  const filteredDTRs = dtrUploads.filter((dtr) => {
    const matchesSearch =
      dtr.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dtr.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dtr.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || dtr.status === statusFilter;
    const matchesPeriod = periodFilter === 'All' || dtr.period === periodFilter;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const periods = ['All', ...Array.from(new Set(dtrUploads.map((d) => d.period)))];

  const verifiedCount = dtrUploads.filter((d) => d.status === 'Verified').length;
  const pendingCount = dtrUploads.filter((d) => d.status === 'Pending Review').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Daily Time Record (DTR) PDF Submissions
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Civil Service Form 48 / Biometrics PDF uploads for payroll computation and compliance auditing
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-6 py-2.5 rounded-full text-xs font-semibold hrmis-btn-gradient text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/40 shrink-0 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload DTR (PDF)</span>
        </button>
      </div>

      {/* KPI Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#11192c] border border-blue-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Submitted DTRs</span>
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">{dtrUploads.length}</div>
          <p className="text-[11px] text-blue-300 mt-1">Official PDF submissions</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#11192c] border border-blue-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Verified for Payroll</span>
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">{verifiedCount}</div>
          <p className="text-[11px] text-emerald-300 mt-1">Approved & endorsed</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#11192c] border border-blue-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2 font-mono">{pendingCount}</div>
          <p className="text-[11px] text-amber-300 mt-1">Awaiting HR audit</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#11192c] border border-blue-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Audit Standard</span>
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-white mt-2">CSC Form 48</div>
          <p className="text-[11px] text-slate-400 mt-1">Dual e-signature verified</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#11192c] p-3 rounded-2xl border border-blue-900/30">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, department, file..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#162035] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 px-3 rounded-xl bg-[#162035] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#162035] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'All Periods' : p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DTR Records Table */}
      <div className="overflow-x-auto rounded-2xl border border-blue-900/40 bg-[#11192c]">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#15213b] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-900/40">
            <tr>
              <th className="py-3 px-4">PDF Document</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Period</th>
              <th className="py-3 px-4">Hours Computed</th>
              <th className="py-3 px-4">Signatures</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-900/30">
            {filteredDTRs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                  <p>No Daily Time Record PDF documents found matching your criteria.</p>
                  <button
                    onClick={onOpenUploadModal}
                    className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-semibold underline"
                  >
                    Upload a DTR PDF now
                  </button>
                </td>
              </tr>
            ) : (
              filteredDTRs.map((dtr) => (
                <tr key={dtr.id} className="hover:bg-blue-950/30 transition-colors">
                  {/* PDF Document Name */}
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-[200px]" title={dtr.fileName}>
                          {dtr.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400">{dtr.fileSize} • {dtr.uploadedAt}</p>
                      </div>
                    </div>
                  </td>

                  {/* Employee & Dept */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{dtr.employeeName}</p>
                    <p className="text-[11px] text-slate-400">{dtr.department}</p>
                  </td>

                  {/* Period */}
                  <td className="py-3.5 px-4 font-mono text-blue-300 text-[11px]">
                    {dtr.period}
                  </td>

                  {/* Hours */}
                  <td className="py-3.5 px-4">
                    <p className="font-mono text-white font-medium">
                      {dtr.totalRegularHours} hrs Reg
                    </p>
                    {dtr.totalOvertimeHours > 0 && (
                      <p className="font-mono text-[10px] text-sky-400 font-semibold">
                        +{dtr.totalOvertimeHours} hrs OT
                      </p>
                    )}
                  </td>

                  {/* Signatures */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 text-[10px]">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Employee Signed
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Supervisor Endorsed
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                      dtr.status === 'Verified'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : dtr.status === 'Rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {dtr.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDTR(dtr)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="View DTR Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      {isAdmin && dtr.status === 'Pending Review' && (
                        <button
                          onClick={() => onUpdateStatus(dtr.id, 'Verified')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
                          title="Approve DTR"
                        >
                          Verify
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteDTR(dtr.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete DTR Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Guidelines & Compliance Notice */}
      <div className="p-4 rounded-2xl bg-[#0e1628] border border-blue-900/40 text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Daily Time Record (DTR) PDF Submission Guidelines</p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            All personnel must upload their consolidated CSC Form 48 or electronic biometrics PDF by the 17th of the month (for 1st-15th period) and by the 2nd of the succeeding month (for 16th-end period). Uploaded PDF documents must be authenticated with dual e-signatures prior to payroll processing.
          </p>
        </div>
      </div>
    </div>
  );
};
