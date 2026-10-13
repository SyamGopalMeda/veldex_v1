import { ReactNode } from 'react';
import { Metadata } from 'next';
import { AdminLayoutClient } from './AdminLayoutClient';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin Console | Veldex Fabrications',
  description: 'Veldex Fabrications Content & Lead Management System',
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
