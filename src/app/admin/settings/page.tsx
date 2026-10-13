'use client';

import { useState } from 'react';
import { PageHead } from '@/components/admin/ui/adm';
import Image from 'next/image';
import {
  Globe,
  Phone,
  Share2,
  Search,
  Clock,
  Save
} from 'lucide-react';
import type { WebsiteSettingsData } from '@/lib/adminStore';
import { DEFAULT_SETTINGS } from '@/lib/settingsShared';
import { ImageField } from '@/components/admin/ui/MediaPicker';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';

import { useEffect } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettingsData>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'contact' | 'social' | 'seo' | 'hours'>('general');
  const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
        setLoaded(true);
      } catch (err) {
        console.warn('Failed to load settings:', err);
      }
    }
    loadSettings();
  }, []);

  const sections = [
    { id: 'general', label: 'General brand', icon: Globe },
    { id: 'contact', label: 'Contact info', icon: Phone },
    { id: 'social', label: 'Social links', icon: Share2 },
    { id: 'seo', label: 'SEO settings', icon: Search },
    { id: 'hours', label: 'Business hours', icon: Clock },
  ];

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!loaded) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not save settings.');
      setSettings(data.settings);
      setToastNotification({ message: 'Saved — the website now shows these details.', type: 'success' });
    } catch (err) {
      setToastNotification({ message: (err as Error).message, type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastNotification(null), 3500);
    }
  };

  const handleHourToggle = (idx: number) => {
    const updated = settings.businessHours.map((h, i) => (i === idx ? { ...h, open: !h.open } : h));
    setSettings({ ...settings, businessHours: updated });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast notification={toastNotification} onClose={() => setToastNotification(null)} />

      <PageHead
        eyebrow="Account"
        title="Website settings"
        description="Business identity, contact details, social links and SEO defaults used across the website."
        actions={<button type="button" onClick={handleSave} className="adm-btn adm-btn-signal"><Save size={15} /> Save changes</button>}
      />

      {/* ─── SETTINGS LAYOUT (Sidebar + Main Form) ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Settings Navigation Sidebar (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl p-3 border border-[#E6E2D9] shadow-xs space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-[#FFF6DA] text-[#8F6400] font-semibold border border-[#F3D98A]'
                    : 'text-[#5B574F] hover:bg-[#FBFAF7] hover:text-[#161513]'
                }`}
              >
                <Icon size={16} className={active ? 'text-[#8F6400]' : 'text-[#8C877D]'} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Area (9 Cols) */}
        <div className="lg:col-span-9 bg-white rounded-xl p-6 border border-[#E6E2D9] shadow-xs">
          {/* 1. GENERAL SETTINGS */}
          {activeSection === 'general' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-[#161513] pb-3 border-b border-[#EFECE6]">
                General brand settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Side: Inputs */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#161513] mb-1.5">
                      Website name
                    </label>
                    <input
                      type="text"
                      value={settings.websiteName}
                      onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161513] mb-1.5">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161513] mb-1.5">
                      Footer description
                    </label>
                    <textarea
                      rows={3}
                      value={settings.footerDescription}
                      onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none resize-y"
                    />
                  </div>
                </div>

                {/* Right Side: Logo, Favicon & Default OG Image previews */}
                <div className="space-y-4 text-xs">
                  {/* Logo Card */}
                  <div className="p-4 rounded-xl bg-[#FBFAF7] border border-[#E6E2D9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#161513]">
                        Logo
                      </span>
                      <span className="text-xs text-[#8C877D]">Part of the site design</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#E6E2D9] flex items-center justify-center">
                      <img
                        src="/images/logo-128.png"
                        alt="Veldex Master Logo"
                        className="h-14 w-auto rounded-lg object-contain shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Favicon Card */}
                  <div className="p-4 rounded-xl bg-[#FBFAF7] border border-[#E6E2D9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#161513]">
                        Favicon
                      </span>
                      <span className="text-xs text-[#8C877D]">Part of the site design</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#E6E2D9] flex items-center gap-3">
                      <img
                        src="/images/favicon.png"
                        alt="Veldex Favicon"
                        className="w-8 h-8 rounded-lg object-contain"
                      />
                      <span className="text-xs text-[#8C877D]">favicon.png (High Resolution)</span>
                    </div>
                  </div>

                  {/* Default share image — used on the home page and when links are shared */}
                  <div className="p-4 rounded-xl bg-[#FBFAF7] border border-[#E6E2D9]">
                    <ImageField label="Default share image" folder="seo" value={settings.defaultOgImage} onChange={(url) => setSettings({ ...settings, defaultOgImage: url })} help="1200×630 works best. Shown when the site is shared on WhatsApp, Facebook or LinkedIn." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CONTACT INFO SETTINGS */}
          {activeSection === 'contact' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-[#161513] pb-3 border-b border-[#EFECE6]">
                Contact information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#161513] mb-1">
                    Phone number
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161513] mb-1">
                    WhatsApp number
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161513] mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161513] mb-1">
                    Office address / City
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-[#161513] mb-1">
                    Google Maps embed or location URL
                  </label>
                  <input
                    type="text"
                    value={settings.googleMapsUrl}
                    onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. SOCIAL LINKS */}
          {activeSection === 'social' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-[#161513] pb-3 border-b border-[#EFECE6]">
                Social media links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#161513] mb-1">
                    Instagram profile URL
                  </label>
                  <input
                    type="url"
                    value={settings.instagram}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161513] mb-1">
                    Facebook page URL
                  </label>
                  <input
                    type="url"
                    value={settings.facebook}
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161513] mb-1">
                    YouTube channel URL
                  </label>
                  <input
                    type="url"
                    value={settings.youtube}
                    onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161513] mb-1">
                    LinkedIn company URL
                  </label>
                  <input
                    type="url"
                    value={settings.linkedin}
                    onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. SEO SETTINGS */}
          {activeSection === 'seo' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-[#161513] pb-3 border-b border-[#EFECE6]">
                Default SEO fallback metadata
              </h3>

              <div>
                <label className="block font-semibold text-[#161513] mb-1">
                  Default SEO title
                </label>
                <input
                  type="text"
                  value={settings.defaultSeoTitle}
                  onChange={(e) => setSettings({ ...settings, defaultSeoTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161513] mb-1">
                  Default meta description
                </label>
                <textarea
                  rows={3}
                  value={settings.defaultMetaDescription}
                  onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none resize-y"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161513] mb-1">
                  Default keywords
                </label>
                <input
                  type="text"
                  value={settings.defaultKeywords}
                  onChange={(e) => setSettings({ ...settings, defaultKeywords: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] focus:border-[#F3AF04] outline-none"
                />
              </div>
            </div>
          )}

          {/* 5. BUSINESS HOURS */}
          {activeSection === 'hours' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-[#161513] pb-3 border-b border-[#EFECE6]">
                Operating business hours
              </h3>

              <div className="divide-y divide-[#EFECE6]">
                {settings.businessHours.map((bh, idx) => (
                  <div key={bh.day} className="py-2.5 flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#161513] w-28">
                      {bh.day}
                    </span>

                    <input
                      type="text"
                      value={bh.hours}
                      onChange={(e) => {
                        const updated = [...settings.businessHours];
                        updated[idx].hours = e.target.value;
                        setSettings({ ...settings, businessHours: updated });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#FBFAF7] border border-[#E6E2D9] text-xs focus:border-[#F3AF04] outline-none flex-1 max-w-xs"
                    />

                    <button
                      type="button"
                      onClick={() => handleHourToggle(idx)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border ${
                        bh.open
                          ? 'bg-[#FFF6DA] text-[#8F6400] border-[#F3D98A]'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}
                    >
                      {bh.open ? 'Open' : 'Closed'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
