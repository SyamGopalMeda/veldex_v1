'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, toPublicSettings, type PublicSettings } from '@/lib/settingsShared';

const Ctx = createContext<PublicSettings>(toPublicSettings(DEFAULT_SETTINGS));
const ServicesCtx = createContext<string[] | null>(null);

/** Live website settings + visible services (Admin → Website settings / Services). */
export function SiteSettingsProvider({ value, visibleServices, children }: { value: PublicSettings; visibleServices?: string[]; children: ReactNode }) {
  return (
    <Ctx.Provider value={value}>
      <ServicesCtx.Provider value={visibleServices ?? null}>{children}</ServicesCtx.Provider>
    </Ctx.Provider>
  );
}

export const useSiteSettings = () => useContext(Ctx);

/** Filters service links (href /services/<slug>) to the services visible on the site. */
export function useVisibleServiceLinks<T extends { href: string }>(links: T[]): T[] {
  const visible = useContext(ServicesCtx);
  if (!visible) return links;
  return links.filter((l) => {
    const m = l.href.match(/^\/services\/([^/?#]+)/);
    return !m || visible.includes(m[1]);
  });
}
