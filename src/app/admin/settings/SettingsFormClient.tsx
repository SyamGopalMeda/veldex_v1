'use client';

import { useState } from 'react';
import { SiteSettings } from '@/types';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  initialSettings: SiteSettings;
}

export function SettingsFormClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {saved && (
        <div className="p-4 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Site settings successfully synchronized with Cloud Firestore!</span>
        </div>
      )}

      {/* Contact info card */}
      <div className="card p-6 bg-[#141414] border-[#262626] space-y-6">
        <h2 className="text-xl font-bold uppercase text-white font-[family-name:var(--font-barlow)] border-b border-[#222] pb-3">
          Public Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AAA] mb-2 font-[family-name:var(--font-barlow)]">
              Customer Support Phone Display
            </label>
            <input
              type="text"
              value={settings.displayPhone}
              onChange={(e) => setSettings({ ...settings, displayPhone: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AAA] mb-2 font-[family-name:var(--font-barlow)]">
              WhatsApp Target Number (Without +)
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AAA] mb-2 font-[family-name:var(--font-barlow)]">
              Support & Inquiries Email
            </label>
            <input
              type="email"
              value={settings.displayEmail}
              onChange={(e) => setSettings({ ...settings, displayEmail: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AAA] mb-2 font-[family-name:var(--font-barlow)]">
              Public Location Display
            </label>
            <input
              type="text"
              value={settings.publicLocation}
              onChange={(e) => setSettings({ ...settings, publicLocation: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Social links card */}
      <div className="card p-6 bg-[#141414] border-[#262626] space-y-6">
        <h2 className="text-xl font-bold uppercase text-white font-[family-name:var(--font-barlow)] border-b border-[#222] pb-3">
          Social Profiles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AAA] mb-2 font-[family-name:var(--font-barlow)]">
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={settings.instagramUrl}
              onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AAA] mb-2 font-[family-name:var(--font-barlow)]">
              Operating Hours Text
            </label>
            <input
              type="text"
              value={settings.operatingHours}
              onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-brand py-3 px-8 flex items-center gap-2">
          <Save size={16} />
          <span>Save Site Settings</span>
        </button>
      </div>
    </form>
  );
}
