import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  Layers,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useAppStore } from '../../store/useAppStore';
import { ScreenId } from '../../types';

export const Header: React.FC = () => {
  const {
    settings,
    updateSettings,
    deviceMode,
    setDeviceMode,
    currentScreen,
    setScreen,
  } = useAppStore();

  const [showScreenDropdown, setShowScreenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowScreenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (Capacitor.isNativePlatform()) {
    return null;
  }

  const screensList: { id: ScreenId; label: string; group: string }[] = [
    { id: 'splash', label: '1. Splash Screen', group: 'Intro & Auth' },
    { id: 'onboarding', label: '2. Onboarding', group: 'Intro & Auth' },
    { id: 'auth', label: '3. Sign In / Sign Up', group: 'Intro & Auth' },
    { id: 'home', label: '4. Home Dashboard', group: 'Core Experience' },
    { id: 'categories', label: '5. Game Categories', group: 'Games' },
    { id: 'game-library', label: '6. Game Selection (All 26)', group: 'Games' },
    { id: 'game-play', label: '7. Game Screen (Playable)', group: 'Games' },
    { id: 'game-results', label: '8. Game Results Modal', group: 'Games' },
    { id: 'daily-challenge', label: '9. Daily Challenge', group: 'Core Experience' },
    { id: 'brain-score', label: '10. Brain Score Breakdown', group: 'Analytics' },
    { id: 'analytics', label: '11. Progress Analytics', group: 'Analytics' },
    { id: 'leaderboard', label: '12. Leaderboard', group: 'Social & Rewards' },
    { id: 'achievements', label: '13. Achievements Badges', group: 'Social & Rewards' },
    { id: 'daily-missions', label: '14. Daily Missions', group: 'Social & Rewards' },
    { id: 'training-plan', label: '15. Training Plan', group: 'Core Experience' },
    { id: 'multiplayer', label: '16. Multiplayer Duels', group: 'Social & Rewards' },
    { id: 'settings', label: '17. Settings', group: 'Account' },
    { id: 'premium', label: '18. Premium MindSpark Pro', group: 'Account' },
    { id: 'profile', label: '19. User Profile', group: 'Account' },
  ];

  const currentScreenObj = screensList.find((s) => s.id === currentScreen);
  const currentLabel = currentScreenObj?.label.split('. ')[1] || currentScreen;
  const currentGroup = currentScreenObj?.group || 'Workspace';

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  return (
    <header className="hidden lg:flex bg-white/90 backdrop-blur-xl border-b border-emerald-950/[0.08] px-5 py-2 items-center justify-between text-xs text-slate-600 sticky top-0 z-40 shadow-[0_1px_12px_rgba(6,78,59,0.04)]">
      {/* Left: Brand & Breadcrumb */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-1.5 font-extrabold text-slate-900 hover:text-emerald-600 transition-colors"
        >
          <span className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xs">
            <Sparkles className="w-3 h-3 text-white" />
          </span>
          <span className="tracking-tight">
            Mind<span className="text-emerald-600">Spark</span>
          </span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-500 font-medium">{currentGroup}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-emerald-800 font-semibold bg-emerald-50/80 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
          {currentLabel}
        </span>
      </div>

      {/* Right: Screen Switcher, Viewport Mode, Sound */}
      <div className="flex items-center gap-2.5">
        {/* Quick Screen Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowScreenDropdown(!showScreenDropdown)}
            aria-expanded={showScreenDropdown}
            aria-haspopup="listbox"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 text-slate-700 transition-colors shadow-2xs"
            title="Jump to any of the 19 application screens"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500 font-medium">Screen:</span>
            <span className="text-slate-900 font-semibold truncate max-w-[140px]">
              {currentLabel}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showScreenDropdown && (
            <div
              role="listbox"
              className="absolute right-0 mt-1.5 w-72 max-h-96 overflow-y-auto bg-white border border-emerald-100 rounded-xl shadow-[0_16px_40px_rgba(6,78,59,0.14)] p-1.5 z-50"
            >
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider border-b border-emerald-100/80 mb-1">
                All 19 Application Screens
              </div>
              {screensList.map((s) => {
                const active = currentScreen === s.id;
                return (
                  <button
                    key={s.id}
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setScreen(s.id);
                      setShowScreenDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Viewport Layout Switcher */}
        <div
          role="group"
          aria-label="Viewport layout mode"
          className="flex items-center bg-slate-100 border border-slate-200/80 rounded-lg p-0.5"
        >
          <button
            onClick={() => setDeviceMode('desktop')}
            aria-label="Desktop full workspace"
            className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
              deviceMode === 'desktop'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Full SaaS Desktop Workspace"
          >
            <Monitor className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            aria-label="Tablet preview frame"
            className={`p-1 rounded-md transition-all ${
              deviceMode === 'tablet'
                ? 'bg-white text-emerald-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Tablet Frame Preview"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            aria-label="Mobile preview frame"
            className={`p-1 rounded-md transition-all ${
              deviceMode === 'mobile'
                ? 'bg-white text-emerald-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Mobile Frame Preview"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          aria-label={settings.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className={`p-1.5 rounded-lg border transition-colors ${
            settings.soundEnabled
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-700 hover:bg-emerald-50'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
          }`}
          title={settings.soundEnabled ? 'Mute sound FX' : 'Enable sound FX'}
        >
          {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
