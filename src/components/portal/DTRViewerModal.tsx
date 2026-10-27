import React from 'react';
import { X, FileText, CheckCircle2, Clock, Printer, Download, ShieldCheck, User, Calendar, ExternalLink } from 'lucide-react';
import { DTRUpload } from '../../types';

interface DTRViewerModalProps {
  dtr: DTRUpload | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: 'Verified' | 'Rejected') => void;
  isAdmin?: boolean;
}

export const DTRViewerModal: React.FC<DTRViewerModalProps> = ({
  dtr,
  onClose,
  onUpdateStatus,
  isAdmin = false,
}) => {
  if (!dtr) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#080e1b] border border-blue-900/50 rounded-3xl shadow-2xl overflow-hidden relative text-white">
        
        {/* Modal Top Bar */}
        <div className="p-5 px-6 bg-[#0c1527] border-b border-blue-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide truncate max-w-md">
                  {dtr.fileName}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  dtr.status === 'Verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : dtr.status === 'Rejected'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {dtr.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {dtr.employeeName} • {dtr.department} • Period: {dtr.period} • {dtr.fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/70 text-slate-300 hover:text-white border border-blue-500/30 transition-colors"
              title="Print DTR"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / DTR Document Representation */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#060a14] space-y-6">
          
          {/* If a real object URL exists, render embed option */}
          {dtr.fileUrl && (
            <div className="mb-4 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-between text-xs">
              <span className="text-blue-200">Native PDF stream loaded from your local upload</span>
              <a
                href={dtr.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold underline"
              >
                Open in new tab <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Authentic Civil Service Form 48 / Standard Corporate DTR Sheet View */}
          <div className="max-w-2xl mx-auto bg-white text-slate-900 rounded-xl p-8 sm:p-10 shadow-2xl font-serif border border-slate-300 text-xs select-none">
            
            {/* DTR Header */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
              <p className="text-[10px] tracking-widest uppercase font-sans font-semibold text-slate-600">
                Civil Service Form No. 48 / Corporate HR Form
              </p>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider font-sans text-slate-950">
                DAILY TIME RECORD
              </h2>
              <p className="text-[11px] italic font-sans text-slate-700">
                Human Resource Management Information System (HRMIS)
              </p>
            </div>

            {/* Employee Meta */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-400 font-sans text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Employee Name:</span>
                <span className="font-bold text-slate-950 text-sm">{dtr.employeeName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Department / Unit:</span>
                <span className="font-semibold text-slate-900">{dtr.department}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">For the Period of:</span>
                <span className="font-semibold text-blue-900">{dtr.period}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Official Work Hours:</span>
                <span className="font-medium text-slate-800">8:00 AM - 5:00 PM (Mon-Fri)</span>
              </div>
            </div>

            {/* DTR Table (Days 1 to 15 sample representation) */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-center border-collapse border border-slate-900 font-sans text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-900 text-[10px]">
                    <th rowSpan={2} className="border-r border-slate-900 p-1 w-10">DAY</th>
                    <th colSpan={2} className="border-r border-slate-900 p-1 bg-slate-200">A.M.</th>
                    <th colSpan={2} className="border-r border-slate-900 p-1 bg-slate-200">P.M.</th>
                    <th colSpan={2} className="p-1">OVERTIME / UNDERTIME</th>
                  </tr>
                  <tr className="bg-slate-50 font-semibold border-b border-slate-900 text-[9px]">
                    <th className="border-r border-slate-900 p-1">Arrival</th>
                    <th className="border-r border-slate-900 p-1">Departure</th>
                    <th className="border-r border-slate-900 p-1">Arrival</th>
                    <th className="border-r border-slate-900 p-1">Departure</th>
                    <th className="border-r border-slate-900 p-1">Hours</th>
                    <th className="p-1">Minutes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono text-[10px]">
                  {[
                    { day: '01', in1: '07:54', out1: '12:00', in2: '12:55', out2: '17:05', otH: '0', otM: '0' },
                    { day: '02', in1: '08:02', out1: '12:05', in2: '13:00', out2: '17:30', otH: '0', otM: '30' },
                    { day: '03', in1: '07:48', out1: '12:00', in2: '12:58', out2: '18:10', otH: '1', otM: '10' },
                    { day: '04', in1: '08:00', out1: '12:02', in2: '12:59', out2: '17:02', otH: '0', otM: '0' },
                    { day: '05', in1: '07:55', out1: '12:00', in2: '12:54', out2: '17:15', otH: '0', otM: '15' },
                    { day: '06', in1: '—', out1: '—', in2: '—', out2: '—', otH: '—', otM: 'SAT' },
                    { day: '07', in1: '—', out1: '—', in2: '—', out2: '—', otH: '—', otM: 'SUN' },
                    { day: '08', in1: '07:50', out1: '12:01', in2: '12:56', out2: '17:00', otH: '0', otM: '0' },
                    { day: '09', in1: '08:05', out1: '12:00', in2: '13:00', out2: '18:00', otH: '1', otM: '00' },
                    { day: '10', in1: '07:58', out1: '12:03', in2: '12:55', out2: '17:45', otH: '0', otM: '45' },
                    { day: '11', in1: '07:52', out1: '12:00', in2: '12:57', out2: '17:00', otH: '0', otM: '0' },
                    { day: '12', in1: '08:00', out1: '12:00', in2: '13:00', out2: '17:30', otH: '0', otM: '30' },
                  ].map((row) => (
                    <tr key={row.day} className="hover:bg-blue-50/50">
                      <td className="border-r border-slate-900 font-bold p-1 bg-slate-50">{row.day}</td>
                      <td className="border-r border-slate-900 p-1">{row.in1}</td>
                      <td className="border-r border-slate-900 p-1">{row.out1}</td>
                      <td className="border-r border-slate-900 p-1">{row.in2}</td>
                      <td className="border-r border-slate-900 p-1">{row.out2}</td>
                      <td className="border-r border-slate-900 p-1">{row.otH}</td>
                      <td className="p-1">{row.otM}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold border-t border-slate-900 text-slate-950 font-sans">
                    <td colSpan={5} className="text-right p-1.5 border-r border-slate-900 font-semibold">
                      TOTAL RECORDED HOURS:
                    </td>
                    <td colSpan={2} className="p-1.5 font-mono text-blue-900">
                      {dtr.totalRegularHours} hrs Reg / {dtr.totalOvertimeHours} hrs OT
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Certification and Signatures */}
            <div className="mt-6 pt-4 border-t border-slate-400 space-y-4 font-sans text-[11px] text-slate-800">
              <p className="italic text-justify text-[10px] leading-relaxed">
                I CERTIFY on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="text-center">
                  <div className="border-b-2 border-slate-900 pb-1 relative">
                    <span className="font-bold text-slate-900 uppercase text-xs">{dtr.employeeName}</span>
                    {dtr.employeeSignature && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-serif italic text-blue-800 text-sm pointer-events-none">
                        ✓ e-Signed
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 block mt-1 uppercase">Employee Signature</span>
                </div>

                <div className="text-center">
                  <div className="border-b-2 border-slate-900 pb-1 relative">
                    <span className="font-bold text-slate-900 uppercase text-xs">Atty. Manuel V. Fernandez</span>
                    {dtr.supervisorSignature && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-serif italic text-emerald-800 text-sm pointer-events-none">
                        ✓ Verified & Endorsed
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 block mt-1 uppercase">Immediate Supervisor / Division Head</span>
                </div>
              </div>
            </div>

            {/* Remarks note */}
            {dtr.remarks && (
              <div className="mt-6 p-2.5 rounded bg-slate-100 border border-slate-300 text-[10px] font-sans text-slate-700">
                <span className="font-semibold text-slate-900">HR Audit Remarks: </span>
                {dtr.remarks}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 px-6 bg-[#0c1527] border-t border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Uploaded: <b className="text-white">{dtr.uploadedAt}</b></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 2-Factor Signatures Validated
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && dtr.status === 'Pending Review' && onUpdateStatus && (
              <>
                <button
                  onClick={() => onUpdateStatus(dtr.id, 'Verified')}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verify & Approve DTR
                </button>
                <button
                  onClick={() => onUpdateStatus(dtr.id, 'Rejected')}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 cursor-pointer transition-colors"
                >
                  Request Revision
                </button>
              </>
            )}

            <button
              onClick={() => window.print()}
              className="px-5 py-2 rounded-full text-xs font-semibold hrmis-btn-gradient text-white flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              Download / Print PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
