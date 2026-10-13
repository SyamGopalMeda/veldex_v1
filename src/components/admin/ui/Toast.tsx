import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastNotification {
  id?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  notification: ToastNotification | null;
  onClose?: () => void;
}

export function Toast({ notification, onClose }: ToastProps) {
  if (!notification) return null;

  const type = notification.type || 'success';

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold z-[90] animate-fade-in border ${
        type === 'success'
          ? 'bg-[#121211] text-white border-[#3A3631]'
          : type === 'error'
          ? 'bg-red-900 text-white border-red-700'
          : 'bg-[#161513] text-white border-[#3A3631]'
      }`}
      role="status"
      aria-live="polite"
    >
      {type === 'success' && <CheckCircle2 size={16} className="text-[#F3AF04] shrink-0" />}
      {type === 'error' && <AlertCircle size={16} className="text-red-400 shrink-0" />}
      {type === 'info' && <Info size={16} className="text-[#F3AF04] shrink-0" />}
      <span>{notification.message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-white/60 hover:text-white cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
