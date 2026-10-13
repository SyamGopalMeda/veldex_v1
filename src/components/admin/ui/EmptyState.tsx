import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-xl bg-[#FFF6DA] text-[#8F6400] flex items-center justify-center mb-3.5 border border-[#E6E2D9] shadow-xs">
        <Icon size={22} />
      </div>
      <h3 className="text-base font-semibold text-[#161513] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#7A756B] leading-relaxed mb-4">
        {description}
      </p>
      {actionLabel && (
        actionHref ? (
          <a
            href={actionHref}
            className="px-4 py-2 rounded-lg bg-[#121211] text-white text-xs font-semibold hover:bg-[#2B2925] transition-all shadow-xs"
          >
            {actionLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 rounded-lg bg-[#121211] text-white text-xs font-semibold hover:bg-[#2B2925] transition-all shadow-xs cursor-pointer"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
