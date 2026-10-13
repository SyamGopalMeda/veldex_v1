export type BadgeVariant =
  | 'published'
  | 'draft'
  | 'new'
  | 'contacted'
  | 'in-progress'
  | 'completed'
  | 'closed'
  | 'active'
  | 'inactive'
  | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'default', children, size = 'md' }: BadgeProps) {
  const getStyles = () => {
    switch (variant.toLowerCase()) {
      case 'published':
      case 'completed':
      case 'active':
        return 'bg-[#E7F5EC] text-[#157A4A] border-[#BFE3CD]';
      case 'draft':
        return 'bg-[#F0EEE9] text-[#6E6A60] border-[#E6E2D9]';
      case 'contacted':
        return 'bg-[#E8F0FC] text-[#1F5FBF] border-[#C7D9F5]';
      case 'new':
        return 'bg-[#FFF6DA] text-[#8F6400] border-[#F3D98A]';
      case 'in-progress':
      case 'inprogress':
        return 'bg-[#FFF3DC] text-[#A35F00] border-[#F5D9A6]';
      case 'closed':
      case 'inactive':
        return 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';
      default:
        return 'bg-[#F3F1EC] text-[#374151] border-[#E6E2D9]';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border transition-colors ${getStyles()} ${sizeStyles}`}
    >
      {children}
    </span>
  );
}
