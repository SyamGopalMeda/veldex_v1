import { Metadata } from 'next';
import { pageMetadata, PAGE_SEO } from '@/lib/seo';
import { PrivacyPolicyView } from '@/components/privacy/PrivacyPolicyView';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = pageMetadata({ ...PAGE_SEO.privacy, path: '/privacy-policy' });

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
