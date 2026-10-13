import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#7A756B] mb-3 font-medium" aria-label="Breadcrumb">
      <Link href="/admin" className="hover:text-[#8F6400] transition-colors flex items-center gap-1">
        <Home size={13} />
        <span>Admin</span>
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-[#B0B8B2]" />
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-[#8F6400] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={`truncate max-w-[200px] sm:max-w-none ${isLast ? 'text-[#161513] font-semibold' : ''}`}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
