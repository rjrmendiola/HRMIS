import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DTRUpload, Employee, User } from '../../types';

interface DTRUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (dtr: DTRUpload) => void;
  currentUser: User;
  employees: Employee[];
}

export const DTRUploadModal: React.FC<DTRUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  currentUser,
  employees,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser.id);
  const [period, setPeriod] = useState('October 16 - 31, 2026');
  const [daysWorked, setDaysWorked] = useState('11');
  const [regularHours, setRegularHours] = useState('88.0');
  const [overtimeHours, setOvertimeHours] = useState('3.5');
  const [employeeSignature, setEmployeeSignature] = useState(true);
  const [supervisorSignature, setSupervisorSignature] = useState(true);
  const [remarks, setRemarks] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Selected employee object
  const assignedEmployee = employees.find((e) => e.id === selectedEmpId) || {
    name: currentUser.name,
    department: currentUser.department,
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage('');
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Invalid file format. Please upload an official Daily Time Record PDF (.pdf).');
      return false;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit.');
      return false;
    }

    setSelectedFile(file);
    try {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    } catch {
      // fallback
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Helper: Use a simulated PDF file for instant testing
  const handleUseSamplePDF = () => {
    const blob = new Blob(
      [
        `%PDF-1.4\n1 0 obj\n<< /Title (Civil Service Form 48 DTR) /Author (${assignedEmployee.name}) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`,
      ],
      { type: 'application/pdf' }
    );
    const mockFile = new File(
      [blob],
      `DTR_${assignedEmployee.name.replace(/\s+/g, '')}_Oct16-31_2026.pdf`,
      { type: 'application/pdf' }
    );
    validateAndSetFile(mockFile);
    setRemarks('Generated from biometric turnstile terminal log with verified e-signatures.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please choose or drag a signed PDF file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Create DTR record
      const newDtr: DTRUpload = {
        id: `dtr-${Date.now()}`,
        employeeId: selectedEmpId,
        employeeName: assignedEmployee.name,
        department: assignedEmployee.department,
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        fileUrl: fileUrl || undefined,
        period: period,
        uploadedAt: new Date().toLocaleString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: currentUser.role.includes('HR') ? 'Verified' : 'Pending Review',
        totalDaysWorked: parseInt(daysWorked) || 11,
        totalRegularHours: parseFloat(regularHours) || 88.0,
        totalOvertimeHours: parseFloat(overtimeHours) || 0.0,
        supervisorSignature: supervisorSignature,
        employeeSignature: employeeSignature,
        remarks: remarks.trim() || undefined,
      };

      setIsUploading(false);
      onUploadSuccess(newDtr);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#090f1d] border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Upload Daily Time Record (DTR)
            </h3>
            <p className="text-xs text-slate-400">
              Submit your signed Civil Service Form 48 / Biometrics PDF for HR verification
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Drag & Drop PDF Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-400 bg-blue-600/15 scale-[1.01]'
                : selectedFile
                ? 'border-emerald-500/50 bg-emerald-950/20'
                : 'border-blue-900/60 hover:border-blue-500/50 bg-[#12192a]/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-sm">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-emerald-300">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Ready to Upload
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setFileUrl(null);
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 underline pt-1"
                >
                  Choose another file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-white">
                  Drop your signed DTR PDF here, or <span className="text-blue-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-400">
                  Accepts standard PDF documents (.pdf) up to 25MB
                </p>
              </div>
            )}
          </div>

          {/* Quick Demo Pre-fill Sample Button */}
          {!selectedFile && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/40 border border-blue-900/40 text-xs">
              <div className="flex items-center gap-1.5 text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Need a sample DTR file to test?</span>
              </div>
              <button
                type="button"
                onClick={handleUseSamplePDF}
                className="px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Use Sample DTR PDF
              </button>
            </div>
          )}

          {/* Form Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Employee Selection */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium pl-1">
                Personnel / Employee
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#172033] text-white border border-blue-900/40 focus:border-blue-500 focus:outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Pay / Attendance Period */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium pl-1">
                DTR Coverage Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#172033] text-white border border-blue-900/40 focus:border-blue-500 focus:outline-none"
              >
                <option value="October 16 - 31, 2026">October 16 - 31, 2026</option>
                <option value="October 1 - 15, 2026">October 1 - 15, 2026</option>
                <option value="September 16 - 30, 2026">September 16 - 30, 2026</option>
                <option value="September 1 - 15, 2026">September 1 - 15, 2026</option>
              </select>
            </div>
          </div>

          {/* Hours and Days Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-300 pl-1 font-medium">Days Worked</label>
              <input
                type="number"
                value={daysWorked}
                onChange={(e) => setDaysWorked(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#172033] text-white border border-blue-900/40 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-300 pl-1 font-medium">Regular Hours</label>
              <input
                type="number"
                step="0.5"
                value={regularHours}
                onChange={(e) => setRegularHours(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#172033] text-white border border-blue-900/40 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-300 pl-1 font-medium">Overtime Hours</label>
              <input
                type="number"
                step="0.5"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#172033] text-white border border-blue-900/40 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Signatures Verified Checkboxes */}
          <div className="p-3.5 rounded-xl bg-[#12192a] border border-blue-900/40 space-y-2 text-xs">
            <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
              Verification Compliance
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={employeeSignature}
                  onChange={(e) => setEmployeeSignature(e.target.checked)}
                  className="rounded border-blue-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Certified correct and digitally/physically signed by employee</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={supervisorSignature}
                  onChange={(e) => setSupervisorSignature(e.target.checked)}
                  className="rounded border-blue-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Reviewed and signed by immediate unit supervisor / department head</span>
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-300 pl-1 font-medium">
              Audit Remarks or Justification (Optional)
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Attached biometric machine raw logs, sprint OT approved..."
              className="w-full p-3 rounded-xl bg-[#172033] text-white text-xs border border-blue-900/40 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Upload Progress Bar if active */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-blue-300">
                <span>Uploading & verifying DTR signature checksum...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-full text-xs font-semibold hrmis-btn-gradient text-white flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-70"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing DTR PDF...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Submit DTR</span>
                </>
              )}
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
};
