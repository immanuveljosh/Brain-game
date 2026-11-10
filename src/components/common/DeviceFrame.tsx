import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DesktopSidebar } from './DesktopSidebar';
import { BottomNav } from './BottomNav';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { deviceMode, currentScreen, toast, hideToast } = useAppStore();

  const isNative = Capacitor.isNativePlatform();
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showBottomNav =
    currentScreen !== 'splash' &&
    currentScreen !== 'onboarding' &&
    currentScreen !== 'auth' &&
    currentScreen !== 'game-play';

  const ToastOverlay = toast ? (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-[100] flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-200 shadow-[0_12px_32px_rgba(6,78,59,0.14)] text-slate-900 transition-all"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
        {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-emerald-600 shrink-0" />}
        <span className="text-xs font-semibold leading-snug truncate">{toast.message}</span>
      </div>
      <button
        onClick={hideToast}
        aria-label="Dismiss notification"
        className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  ) : null;

  // 1. Native mobile (Capacitor Android / iOS) or mobile/tablet screen viewports:
  // Render 100% full-screen native mobile experience with ambient emerald aura.
  if (isNative || isSmallScreen) {
    return (
      <div className="min-h-screen w-full bg-[#F6FBF8] bg-[radial-gradient(120%_45%_at_50%_0%,rgba(16,185,129,0.10)_0%,rgba(13,148,136,0.03)_50%,transparent_100%)] text-slate-900 flex flex-col font-sans select-none overflow-x-hidden relative">
        {ToastOverlay}
        <main className="flex-1 w-full max-w-lg mx-auto flex flex-col pt-[max(env(safe-area-inset-top,0px),8px)] pb-24 overflow-y-auto overflow-x-hidden no-scrollbar">
          {children}
        </main>
        {showBottomNav && <BottomNav />}
      </div>
    );
  }

  // 2. Desktop Mode on wide screens
  if (deviceMode === 'desktop') {
    return (
      <div className="min-h-screen bg-[#F6FBF8] flex flex-col md:flex-row text-slate-900 font-sans">
        {ToastOverlay}
        {showBottomNav && <DesktopSidebar />}
        <main className="flex-1 min-h-screen overflow-y-auto bg-[#F6FBF8] bg-[radial-gradient(100%_40%_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_100%)] pb-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5">
          {children}
        </main>
      </div>
    );
  }

  // 3. Tablet Preview on wide desktop screens
  if (deviceMode === 'tablet') {
    return (
      <div className="min-h-screen bg-slate-200/70 flex items-center justify-center p-4 sm:p-6 select-none">
        {ToastOverlay}
        <div className="w-full max-w-[760px] h-[90vh] max-h-[1020px] bg-[#F6FBF8] border-[8px] border-slate-900 rounded-[36px] shadow-[0_20px_60px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-y-auto relative no-scrollbar pb-20">
            {children}
          </div>
          {showBottomNav && <BottomNav />}
        </div>
      </div>
    );
  }

  // 4. Mobile Preview on wide desktop screens
  return (
    <div className="min-h-screen bg-slate-200/70 flex items-center justify-center p-2 sm:p-6">
      {ToastOverlay}
      <div className="w-full max-w-[420px] h-[860px] bg-[#F6FBF8] border-[8px] border-slate-900 rounded-[44px] shadow-[0_25px_70px_rgba(15,23,42,0.2)] overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto relative no-scrollbar pb-20">
          {children}
        </div>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};
