'use client';

import { useState } from 'react';
import { Enquiry, EnquiryStatus } from '@/types';
import { Mail, Phone, Calendar, Clock, Eye, CheckCircle2 } from 'lucide-react';

interface Props {
  initialEnquiries: Enquiry[];
}

const statusOptions: EnquiryStatus[] = [
  'NEW',
  'CONTACTED',
  'ESTIMATE_SENT',
  'WON',
  'CLOSED',
];

export function EnquiryPipelineClient({ initialEnquiries }: Props) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    // Optimistic UI update
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="card overflow-hidden bg-[#141414] border-[#262626]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262626] bg-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider text-[#888] font-[family-name:var(--font-barlow)]">
                <th className="p-4">Client</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Service</th>
                <th className="p-4">Received</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-xs font-[family-name:var(--font-inter)]">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#666]">
                    No customer inquiries logged yet.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                    <td className="p-4 font-bold text-white font-[family-name:var(--font-barlow)] uppercase text-sm">
                      {enq.clientName}
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="text-[#CCC]">{enq.phone}</div>
                      <div className="text-[11px] text-[#666]">{enq.email}</div>
                    </td>
                    <td className="p-4 text-[#AAA] capitalize">
                      {enq.serviceRequested.replace('-', ' ')}
                    </td>
                    <td className="p-4 text-[#888]">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4">
                      <select
                        value={enq.status}
                        onChange={(e) =>
                          handleStatusChange(enq.id, e.target.value as EnquiryStatus)
                        }
                        className="bg-[#222] border border-[#333] text-xs rounded px-2.5 py-1 text-[#CCC] focus:border-[#F5A623] outline-none cursor-pointer"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="px-3 py-1 rounded bg-[#222] hover:bg-[#333] text-[#F5A623] text-xs font-bold uppercase tracking-wider font-[family-name:var(--font-barlow)] inline-flex items-center gap-1"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="card max-w-lg w-full bg-[#161616] border-[#333] p-6 relative">
            <h2 className="text-2xl font-bold text-white uppercase font-[family-name:var(--font-barlow)] mb-4">
              Inquiry Specifications
            </h2>

            <div className="space-y-4 text-xs font-[family-name:var(--font-inter)] text-[#CCC]">
              <div className="grid grid-cols-2 gap-4 p-4 rounded bg-[#1F1F1F] border border-[#2A2A2A]">
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Client Name</span>
                  <span className="font-bold text-white">{selectedEnquiry.clientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Service Type</span>
                  <span className="font-bold text-[#F5A623] uppercase">{selectedEnquiry.serviceRequested}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Phone</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-white hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-white hover:underline break-all">
                    {selectedEnquiry.email}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#888] uppercase tracking-wider block mb-1">
                  Message / Dimensions Description
                </span>
                <div className="p-4 rounded bg-[#111] border border-[#222] text-[#AAA] whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#262626] flex justify-end gap-3">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="btn-outline text-xs py-2 px-4"
              >
                Close View
              </button>
              <a
                href={`https://wa.me/91${selectedEnquiry.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand text-xs py-2 px-4"
              >
                WhatsApp Client
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
