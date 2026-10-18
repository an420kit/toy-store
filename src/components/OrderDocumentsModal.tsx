import React, { useState } from 'react';
import { formatINR } from '../data/products.ts';

interface OrderDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    orderId: string;
    date: string;
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    items: {
      name: string;
      sku: string;
      price: number;
      quantity: number;
      selectedColorway?: string;
    }[];
    total: number;
    subtotal: number;
    monogramText?: string;
    paymentMethod: string;
  } | null;
}

export const OrderDocumentsModal: React.FC<OrderDocumentsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [docType, setDocType] = useState<'invoice' | 'certificate'>('certificate');

  if (!isOpen || !order) return null;

  const gstRate = 0.18;
  const taxableVal = Math.round(order.total / (1 + gstRate));
  const cgst = Math.round((order.total - taxableVal) / 2);
  const sgst = cgst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#171411]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#fbf9f6] rounded-2xl max-w-3xl w-full p-4 sm:p-7 shadow-2xl relative border border-[#cfc4bd] max-h-[92vh] flex flex-col overflow-hidden text-[#171411]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Document Switcher Toolbar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e4e2df] shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDocType('certificate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                docType === 'certificate'
                  ? 'bg-[#171411] text-white shadow-sm'
                  : 'bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#4d4540]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              <span>Heirloom Certificate</span>
            </button>
            <button
              onClick={() => setDocType('invoice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                docType === 'invoice'
                  ? 'bg-[#171411] text-white shadow-sm'
                  : 'bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#4d4540]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Official Tax Invoice (GST)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-[#7d562d] hover:bg-[#171411] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Print Document"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Document Content View */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          {/* CERTIFICATE VIEW */}
          {docType === 'certificate' && (
            <div className="bg-[#fffefb] p-6 sm:p-10 rounded-2xl border-2 border-[#7d562d]/40 shadow-inner space-y-6 relative overflow-hidden">
              {/* Watermark Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none font-serif text-[280px] font-bold text-[#171411]">
                L
              </div>

              {/* Certificate Border Frame */}
              <div className="border border-[#7d562d]/30 p-6 sm:p-8 rounded-xl space-y-6 relative">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-[#7d562d] text-xs uppercase tracking-[0.25em] font-bold">
                    <span>Atelier Handcrafted Reserve</span>
                    <span>•</span>
                    <span>FSC® C140228</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide text-[#171411]">
                    Certificate of Heirloom Authenticity
                  </h2>
                  <p className="text-xs text-[#7e756f] font-serif italic max-w-md mx-auto">
                    This document attests that the registered wooden sculpture is an authentic
                    handcrafted edition by LUMEN Atelier, milled from sustainable German beechwood.
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#7d562d]/40 to-transparent"></div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[#fbf9f6] rounded-xl border border-[#e4e2df] space-y-1">
                    <span className="text-[10px] text-[#7e756f] uppercase tracking-wider block font-bold">
                      Designated Patron / Child
                    </span>
                    <span className="font-serif text-lg font-bold text-[#171411] block">
                      {order.monogramText ? order.monogramText : order.fullName}
                    </span>
                    <span className="text-[11px] text-[#7d562d]">
                      Nursery Residence: {order.city}, {order.state}
                    </span>
                  </div>

                  <div className="p-3 bg-[#fbf9f6] rounded-xl border border-[#e4e2df] space-y-1">
                    <span className="text-[10px] text-[#7e756f] uppercase tracking-wider block font-bold">
                      Provenance Registry No.
                    </span>
                    <span className="font-mono text-base font-bold text-[#171411] block">
                      #LMN-2025-{order.orderId}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      ✓ EN71 Saliva-Safe Immersion Pass
                    </span>
                  </div>
                </div>

                {/* Registered Items */}
                <div className="space-y-2">
                  <span className="text-[10px] text-[#7e756f] uppercase tracking-wider block font-bold">
                    Registered Works In This Provenance:
                  </span>
                  <div className="divide-y divide-[#e4e2df] border border-[#e4e2df] rounded-xl overflow-hidden bg-white text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-serif font-bold text-[#171411]">{item.name}</span>
                          <span className="text-[11px] text-[#7e756f] block">
                            {item.sku} • {item.selectedColorway || 'Natural Beechwood'}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#7d562d]">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#e4e2df]">
                  <div className="text-center sm:text-left space-y-1">
                    <div className="font-serif italic text-base text-[#171411]">
                      Mikael Lindström
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[#7e756f] block font-bold">
                      Master Woodturner &amp; Joinery Lead
                    </span>
                  </div>

                  {/* Wax Seal Emulation */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c46927] to-[#7d562d] text-white flex flex-col items-center justify-center shadow-lg border-2 border-[#ffca98] select-none">
                    <span className="font-serif text-lg font-bold">L</span>
                    <span className="text-[8px] tracking-widest uppercase font-bold">SEAL</span>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <span className="font-mono text-xs font-semibold text-[#171411] block">
                      {order.date}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#7e756f] block font-bold">
                      Atelier Registration Date
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVOICE VIEW */}
          {docType === 'invoice' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#cfc4bd] shadow-sm space-y-6 text-xs text-[#171411]">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#e4e2df]">
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-[#171411]">
                    LUMEN HEIRLOOM TOYS PVT LTD
                  </h3>
                  <p className="text-[11px] text-[#7e756f] mt-1">
                    Atelier 4B, Peninsula Business Park, Lower Parel, Mumbai 400013
                  </p>
                  <p className="text-[11px] text-[#7e756f]">
                    GSTIN: 27AABCL9820M1Z5 • State Code: 27 (Maharashtra)
                  </p>
                  <p className="text-[11px] text-[#7e756f]">Email: atelier@lumentoystore.com</p>
                </div>
                <div className="sm:text-right space-y-1 bg-[#fbf9f6] p-3 rounded-xl border border-[#e4e2df]">
                  <span className="text-[10px] uppercase tracking-wider text-[#7d562d] font-bold block">
                    TAX INVOICE
                  </span>
                  <span className="font-mono text-sm font-bold block">INV-2025-{order.orderId}</span>
                  <span className="text-[11px] text-[#7e756f] block">Date: {order.date}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block">
                    PAID ({order.paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#e4e2df]">
                <div>
                  <span className="text-[10px] text-[#7e756f] uppercase tracking-wider block font-bold mb-1">
                    Billed &amp; Consigned To:
                  </span>
                  <span className="font-bold text-sm block">{order.fullName}</span>
                  <p className="text-[#4d4540] text-xs leading-relaxed mt-1">
                    {order.address}
                    <br />
                    {order.city}, {order.state} - {order.pinCode}
                    <br />
                    Phone: {order.phone} • Email: {order.email}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[#7e756f] uppercase tracking-wider block font-bold mb-1">
                    Dispatch Logistics:
                  </span>
                  <p className="text-[#4d4540] text-xs leading-relaxed">
                    Mode: White-Glove Air Express
                    <br />
                    Courier: Bluedart Apex Heirloom Logistics
                    <br />
                    Bespoke Monogram: {order.monogramText ? `"${order.monogramText}"` : 'None'}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#e4e2df] rounded-xl overflow-hidden">
                  <thead className="bg-[#f5f3f0] text-[#7d562d] uppercase text-[10px] tracking-wider border-b border-[#e4e2df]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Item Description</th>
                      <th className="p-3">HSN / SAC</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Rate</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e2df]">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-3">
                          <span className="font-bold block">{item.name}</span>
                          <span className="text-[11px] text-[#7e756f]">
                            {item.sku} • {item.selectedColorway || 'Standard Finish'}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px]">95030010</td>
                        <td className="p-3 text-center font-bold">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">{formatINR(item.price)}</td>
                        <td className="p-3 text-right font-mono font-bold">
                          {formatINR(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax & Total Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-72 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7e756f]">Taxable Value:</span>
                    <span className="font-mono">{formatINR(taxableVal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e756f]">CGST (9%):</span>
                    <span className="font-mono">{formatINR(cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e756f]">SGST (9%):</span>
                    <span className="font-mono">{formatINR(sgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e756f]">Insured Shipping:</span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>
                  <div className="h-px bg-[#e4e2df] pt-1"></div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-bold text-sm">Total Paid:</span>
                    <span className="font-serif text-xl font-bold text-[#171411]">
                      {formatINR(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Declaration Note */}
              <div className="pt-4 border-t border-[#e4e2df] text-[10px] text-[#7e756f] space-y-1">
                <p>
                  <strong>Statutory Declaration:</strong> This is a computer generated invoice issued
                  under Section 31 of CGST Act, 2017. All wooden toys comply with BIS IS 9873 (Parts
                  1, 2, 3) and European Standard EN 71 safety certifications.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
