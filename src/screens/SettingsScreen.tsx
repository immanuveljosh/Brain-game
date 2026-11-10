import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Volume2,
  Sun,
  Globe,
  WifiOff,
  Info,
  Shield,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, user, resetDemoData, goBack, setScreen, showToast } = useAppStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="p-4 max-w-md md:max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-emerald-950/[0.08]">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="p-2 rounded-xl bg-white border border-emerald-950/[0.08] text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/40 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Settings</h2>
          <span className="text-[11px] text-slate-500 font-medium">Workspace preferences &amp; configuration</span>
        </div>
      </div>

      {/* Account Info Card */}
      <div
        onClick={() => setScreen('profile')}
        className="p-4 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/45 border border-emerald-200/80 shadow-[0_4px_16px_-4px_rgba(6,78,59,0.06)] flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover border border-emerald-300"
          />
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{user.name}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 tabular-nums">
                Lv.{user.level}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      {/* Preferences List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] space-y-4">
        <h3 className="text-[11px] font-bold text-emerald-800/70 uppercase tracking-wider">
          Application Preferences
        </h3>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Notifications</div>
              <div className="text-[11px] text-slate-500">Daily workout reminders &amp; streak alerts</div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.notifications}
            aria-label="Toggle notifications"
            onClick={() => handleToggle('notifications')}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.notifications ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                settings.notifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sound & Vibration Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Sound &amp; Haptics</div>
              <div className="text-[11px] text-slate-500">Synthesized Web Audio feedback</div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.soundEnabled}
            aria-label="Toggle sound and haptics"
            onClick={() => handleToggle('soundEnabled')}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Appearance Theme</div>
              <div className="text-[11px] text-slate-500">Botanical White &amp; Emerald Pro (Active)</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <span>Emerald Light</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Language</div>
              <div className="text-[11px] text-slate-500">Interface localization</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
            <span>English (US)</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Offline Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Offline Mode</div>
              <div className="text-[11px] text-slate-500">Play all interactive games without network</div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.offlineMode}
            aria-label="Toggle offline mode"
            onClick={() => handleToggle('offlineMode')}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.offlineMode ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                settings.offlineMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* About & Legal */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] space-y-3">
        <h3 className="text-[11px] font-bold text-emerald-800/70 uppercase tracking-wider">
          System &amp; Compliance
        </h3>

        <button
          type="button"
          onClick={() =>
            showToast('MindSpark v2.4.0 — Cognitive Training Platform', 'info')
          }
          className="w-full flex items-center justify-between cursor-pointer py-1.5 text-xs hover:text-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-slate-700 font-medium">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>About MindSpark</span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">v2.4.0</span>
        </button>

        <button
          type="button"
          onClick={() =>
            showToast('Privacy Policy: Zero third-party trackers; encrypted local & cloud sync.', 'info')
          }
          className="w-full flex items-center justify-between cursor-pointer py-1.5 text-xs hover:text-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-slate-700 font-medium">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Terms &amp; Privacy Architecture</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Reset Demo Data Button */}
      <div className="pt-1">
        {confirmReset ? (
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-rose-800 font-medium">
              Reset all progress, coins, and history back to default demo state?
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="w-full py-3 rounded-xl bg-white hover:bg-emerald-50/50 border border-emerald-950/[0.08] hover:border-emerald-200 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Workspace Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
