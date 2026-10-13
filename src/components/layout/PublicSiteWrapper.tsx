'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFAB } from '@/components/layout/WhatsAppFAB';
import { FirebaseAnalytics } from '@/components/layout/FirebaseAnalytics';

export function PublicSiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="vx-site">{children}</main>
      <Footer />
      <WhatsAppFAB />
      <FirebaseAnalytics />
    </>
  );
}
