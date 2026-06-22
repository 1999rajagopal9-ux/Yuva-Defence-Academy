import React, { useState } from 'react';
import {
  CreditCard, Smartphone, CheckCircle, SmartphoneIcon, FileText, Printer, Shield, Copy, Check, Download
} from 'lucide-react';
import { Course, Transaction } from '../types';

interface PaymentFormProps {
  courses: Course[];
  onAddTransaction: (txn: Transaction) => void;
  studentEmail?: string;
}

export default function PaymentForm({ courses, onAddTransaction, studentEmail = 'cadet.ram@gmail.com' }: PaymentFormProps) {
  
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [method, setMethod] = useState<'card' | 'upi'>('upi');

  // Input States
  const [applicantName, setApplicantName] = useState('Cadet Ram Kumar');
  const [applicantEmail, setApplicantEmail] = useState(studentEmail);
  const [medicalVerified, setMedicalVerified] = useState(true);
  const [fitnessVerified, setFitnessVerified] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Card stats
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI stats
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Progress transaction
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Transaction | null>(null);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('yuva.defense@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!medicalVerified || !fitnessVerified) {
      setValidationError("Please ensure both Medical and Physical checklists are verified before admission clearance.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}-S`,
        studentName: applicantName,
        email: applicantEmail,
        courseName: selectedCourse.title,
        amount: selectedCourse.price,
        status: 'COMPLETED',
        paymentMethod: method === 'card' ? 'Visa / Card' : 'UPI (yuva.defense@upi)',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      onAddTransaction(newTxn);
      setInvoice(newTxn);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-black rounded-xl border border-zinc-800 text-white p-4 sm:p-6 font-sans relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.03)_0%,rgba(0,0,0,1)_85%)] pointer-events-none" />

      {/* If Invoice Generated successfully show clean tactical receipt */}
      {invoice ? (
        <div className="max-w-2xl mx-auto p-5 bg-zinc-950 border-2 border-yellow-500/30 rounded-lg space-y-6 relative">
          <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 border border-green-500/40 text-[9px] font-mono py-0.5 px-2 rounded uppercase font-bold animate-pulse">
            TRANSACTION VERIFIED
          </div>

          <div className="text-center border-b border-zinc-900 pb-4">
            <h3 className="text-lg font-black tracking-widest text-yellow-500 uppercase font-mono">YUVA DEFENSE ACADEMY</h3>
            <p className="text-[10px] text-zinc-500 font-mono">ACCREDITED OFFICER TRAINING BOARD • RECEIPT PROTOCOL</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="block text-[10px] text-zinc-600">APPLICANT CADET:</span>
              <strong className="text-zinc-200">{invoice.studentName}</strong>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-600">DATE RECORDED:</span>
              <span className="text-zinc-300">{invoice.date}</span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-600">RECEIPT NO:</span>
              <span className="text-yellow-600 font-bold">{invoice.id}</span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-600">CLEARANCE GATEWAY:</span>
              <span className="text-zinc-300">{invoice.paymentMethod}</span>
            </div>
          </div>

          <div className="p-4 bg-zinc-900 rounded border border-zinc-800 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-zinc-100">{invoice.courseName}</h4>
              <span className="text-[10px] font-mono text-zinc-400">12 Months Residential Lodging & Drill Allocation</span>
            </div>
            <strong className="text-lg font-black font-mono text-yellow-500">₹{invoice.amount}</strong>
          </div>

          {/* Quick PDF printable downloader actions */}
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 rounded cursor-pointer transition uppercase"
            >
              <Printer className="h-4 w-4" />
              <span>PRINT RECEIPT LOG</span>
            </button>
            
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(invoice, null, 2));
                link.download = `${invoice.id}_receipt.json`;
                link.click();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-mono font-bold rounded cursor-pointer transition uppercase"
            >
              <Download className="h-4 w-4" />
              <span>DOWNLOAD DIGITAL PDF RECEIPT</span>
            </button>
          </div>

          <button
            onClick={() => setInvoice(null)}
            className="w-full text-center text-xs tracking-widest font-mono text-zinc-500 hover:text-white uppercase font-bold mt-4 block"
          >
            ← SECURE ANOTHER TRANSACTION / ADMISSION
          </button>
        </div>
      ) : (
        // Standard Checkout View
        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="text-xl font-bold uppercase text-white">ADMISSION AND FEES PAYMENT SHEETS</h3>
            <p className="text-xs text-zinc-400 font-mono">Fill out physical and medical clearance to trigger payment options</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant detail blocks */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-yellow-500 uppercase tracking-widest border-b border-zinc-900 pb-2">Applicant Credentials</h4>
              
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500">FULL CANDIDATE NAME:</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-100 rounded focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500">COMMUNICATION EMAIL:</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-100 rounded focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500">SELECT ACADEMY COURSE INTAKE:</label>
                  <select
                    value={selectedCourse.id}
                    onChange={(e) => {
                      const found = courses.find(c => c.id === e.target.value);
                      if (found) setSelectedCourse(found);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-yellow-500 rounded focus:border-yellow-500 focus:outline-none font-bold"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} — ₹{c.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkboxes verifying physical standards */}
              <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="med"
                    checked={medicalVerified}
                    onChange={(e) => setMedicalVerified(e.target.checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="med" className="text-[11px]">
                    I verify that I hold sufficient chest expands and eyesight matching visual standard charts.
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="fit"
                    checked={fitnessVerified}
                    onChange={(e) => setFitnessVerified(e.target.checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="fit" className="text-[11px]">
                    I verify that I have cleared initial trials and accept military residential guidelines of Yuva Academy.
                  </label>
                </div>
              </div>
            </div>

            {/* Payment checkout options */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2">Secure Payment Gateway</h4>
              
              {/* Payment Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`py-2 text-xs font-mono tracking-wider text-center border rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    method === 'upi'
                      ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500 font-bold'
                      : 'bg-zinc-900/30 text-zinc-400 border-zinc-800/80 hover:text-white'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>UPI PAY SECURE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`py-2 text-xs font-mono tracking-wider text-center border rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    method === 'card'
                      ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500 font-bold'
                      : 'bg-zinc-900/30 text-zinc-400 border-zinc-800/80 hover:text-white'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>DEBIT / CREDIT CARD</span>
                </button>
              </div>

              {method === 'upi' ? (
                // UPI Checkout Layout with customizable QR
                <div className="p-4 bg-zinc-950 rounded border border-zinc-900 space-y-4 text-center">
                  <p className="text-xs text-zinc-300">Scan this official Academy dynamic QR using GPay, PhonePe, or BHIM UPI.</p>
                  
                  {/* Styled Dynamic QR block */}
                  <div className="mx-auto w-36 h-36 bg-zinc-900 hover:scale-105 transition-transform border-4 border-yellow-500/20 p-2 flex flex-col justify-between items-center rounded relative">
                    <div className="text-[9px] font-mono tracking-wide bg-yellow-500 text-black py-0.5 px-2 rounded-full uppercase font-bold mb-1">
                      UPI DIRECT
                    </div>
                    {/* Generates a stylized visual QR layout */}
                    <div className="w-20 h-20 bg-white p-1 rounded">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=yuva.defense@upi%26pn=Yuva%20Defense%20Academy%26am=45000"
                        alt="UPI QR Code"
                        className="w-full h-full"
                      />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase mt-1">₹{selectedCourse.price} AMOUNT</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-zinc-900 rounded text-xs">
                    <span className="text-zinc-500 font-mono">UPI ID: yuva.defense@upi</span>
                    
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1 font-mono hover:scale-105 transition"
                    >
                      {copiedUpi ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedUpi ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Card checkout layout with full visual input blocks
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase">CARD NUMBER:</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-905 border border-zinc-800 p-2 text-xs text-yellow-500 rounded focus:border-yellow-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500">EXP DATE:</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-905 border border-zinc-800 p-2 text-xs text-yellow-500 rounded focus:border-yellow-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500">CVV:</label>
                      <input
                        type="password"
                        placeholder="***"
                        required
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-zinc-905 border border-zinc-800 p-2 text-xs text-yellow-500 rounded focus:border-yellow-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {validationError && (
                <div className="p-3 bg-red-500/10 border border-red-500/35 text-red-500 text-xs rounded font-mono text-center">
                  ⚠️ {validationError}
                </div>
              )}

              {/* Secure banner */}
              <div className="text-[10px] font-mono text-zinc-500 tracking-wider flex items-center gap-1.5 justify-center py-2 border-t border-zinc-900">
                <Shield className="h-4 w-4 text-green-500 animate-pulse shrink-0" />
                <span>SECURED GATEWAY • 256-BIT SECURE ENCRYPTION PROTOCOLS</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-sm tracking-widest uppercase rounded cursor-pointer transition border border-yellow-400 disabled:opacity-50 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              >
                {loading ? "PROXING THE TRANSACTION CLEARANCE..." : `PROCEED SECURE PAY: ₹${selectedCourse.price}`}
              </button>
            </div>
          </div>
        </form>
      )}

    </div>
  );
}
