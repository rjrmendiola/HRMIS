import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactUsPageProps {
  onSuccessToast: (title: string, message: string) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onSuccessToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('General HR Support');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSuccessToast('Message Received', 'Your HRMIS inquiry ticket has been logged. Our HR team will reach out shortly.');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Dark rounded container matching prototype Screen 3 */}
      <div className="rounded-[32px] bg-[#090f1d] border border-blue-900/30 p-8 sm:p-12 shadow-[0_25px_60px_-15px_rgba(2,10,28,0.85),0_0_50px_-10px_rgba(26,92,206,0.25)] text-white">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-wide font-display-serif">
            Contact Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            Need assistance with your employee account, leave filing, payroll discrepancies, or system access? Reach out directly to the HRMIS Support Office.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-5 bg-[#12192a] p-6 sm:p-7 rounded-2xl border border-blue-900/40">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              HR Administration Desk
            </h3>

            <div className="space-y-4 pt-2 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Direct Support Email</p>
                  <p className="font-medium text-white select-all">support@hrmis.enterprise.ph</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">HR Helpdesk Hotline</p>
                  <p className="font-medium text-white">+63 (02) 8888-4764 (HRMIS)</p>
                  <p className="text-[11px] text-slate-400">Loc. 101 / 102</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Human Capital Headquarters</p>
                  <p className="font-medium text-white leading-snug">
                    Tower 1, Ayala Avenue, Makati Central Business District, Philippines
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-900/50">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Operating Hours: <span className="text-white font-medium">Monday to Friday, 8:00 AM – 5:00 PM PST</span>. Inquiries received on weekends will be addressed on the next business day.
              </p>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-[#101726] rounded-2xl border border-emerald-500/30 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <h4 className="text-lg font-semibold text-white">Inquiry Successfully Sent</h4>
                <p className="text-xs text-slate-300 max-w-sm">
                  Ticket reference #HR-{Math.floor(100000 + Math.random() * 900000)} has been generated. You will receive an email status confirmation.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs text-slate-300 pl-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rogelio Mendiola Jr."
                      className="w-full h-11 px-4 rounded-full bg-[#172033] text-white text-xs sm:text-sm border border-blue-900/40 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs text-slate-300 pl-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. employee@company.com"
                      className="w-full h-11 px-4 rounded-full bg-[#172033] text-white text-xs sm:text-sm border border-blue-900/40 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-slate-300 pl-1">Topic / Concern</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-11 px-4 rounded-full bg-[#172033] text-white text-xs sm:text-sm border border-blue-900/40 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="General HR Support">General HR Support & Guidance</option>
                    <option value="Time & Attendance Dispute">Time & Attendance / Clock-in Dispute</option>
                    <option value="Leave Credit Inquiry">Leave Credit & Leave Filing Assistance</option>
                    <option value="Payroll & Tax Calculation">Payroll, Allowances & Tax Deductions</option>
                    <option value="Credentials & Access Request">Account Access & Security Reset</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-slate-300 pl-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details of your inquiry or issue..."
                    className="w-full p-4 rounded-2xl bg-[#172033] text-white text-xs sm:text-sm border border-blue-900/40 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-full text-white font-medium text-sm hrmis-btn-gradient flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
