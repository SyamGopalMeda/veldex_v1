'use client';

import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[80] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E6E2D9] space-y-4">
        <div className="flex items-start justify-between">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDestructive ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-[#FFF6DA] text-[#8F6400]'
            }`}
          >
            <AlertCircle size={20} />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-[#8C877D] hover:text-[#161513] cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div>
          <h3 id="confirm-dialog-title" className="text-base font-semibold text-[#161513]">
            {title}
          </h3>
          <p className="text-xs text-[#5B574F] mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E6E2D9] text-[#5B574F] hover:bg-[#F3F1EC] cursor-pointer transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors ${
              isDestructive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#121211] text-white hover:bg-[#2B2925]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
