import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  Shield,
  Star,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const PremiumScreen: React.FC = () => {
  const { user, upgradeToPremium, setScreen } = useAppStore();
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');

  const features = [
    'Unlimited access to all 26 Cognitive Training Games',
    'Full access to all 6 Neural Skill Categories',
    'Clinical-grade Brain Spark Index & Neural Age Diagnostics',
    'Personalized daily adaptive workout regimens',
    'Real-time 1v1 Live Arena multiplayer matchmaking',
    'Zero advertisements & full offline training mode',
    'Longitudinal domain improvement telemetry & percentiles',
  ];

  const handleUpgrade = () => {
    upgradeToPremium();
    setScreen('home');
  };

  return (
    <div className="p-4 max-w-md md:max-w-2xl mx-auto space-y-5">
      {/* Header with 3D Emerald Brain Emblem */}
      <div className="text-center pt-2">
        <div className="relative inline-block mb-3">
          <div className="w-20 h-20 rounded-3xl overflow-hidden bg-white border-2 border-emerald-200/90 shadow-[0_8px_24px_rgba(16,185,129,0.16)] mx-auto">
            <img
              src="/images/hero-brain.jpg"
              alt="MindSpark Pro 3D Brain"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -top-2 -right-2 p-1.5 rounded-xl bg-amber-400 text-slate-950 shadow-sm border border-white">
            <Crown className="w-4 h-4 fill-slate-950" />
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Mind<span className="text-emerald-600">Spark</span> Pro
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed font-medium">
          Unlock your cognitive peak with unlimited neural training and full clinical diagnostics
        </p>
      </div>

      {/* Billing Selector */}
      <div className="flex bg-emerald-50/70 p-1 rounded-xl border border-emerald-200/80 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setBillingCycle('yearly')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            billingCycle === 'yearly'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-800'
          }`}
        >
          <span>Annual</span>
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
              billingCycle === 'yearly'
                ? 'bg-white text-emerald-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            -50%
          </span>
        </button>

        <button
          type="button"
          onClick={() => setBillingCycle('monthly')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            billingCycle === 'monthly'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-800'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Pricing Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/60 border border-emerald-200/90 shadow-[0_10px_32px_-6px_rgba(6,78,59,0.08)] relative overflow-hidden">
        <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-400/15 blur-2xl" />

        <div className="flex items-baseline justify-between mb-5 tabular-nums relative z-10">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              {billingCycle === 'yearly' ? 'Pro Annual Pass' : 'Pro Monthly Pass'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">
                {billingCycle === 'yearly' ? '$4.99' : '$9.99'}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ month</span>
            </div>
          </div>

          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
            {billingCycle === 'yearly' ? 'Billed $59.88 / yr' : 'Flexible monthly'}
          </span>
        </div>

        {/* Feature List */}
        <div className="space-y-3 pt-4 border-t border-emerald-100 relative z-10">
          {features.map((feat) => (
            <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleUpgrade}
          className="relative z-10 w-full mt-6 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_6px_18px_rgba(5,150,105,0.26)] flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          {user.isPremium ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>MindSpark Pro Active</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Start 7-Day Free Trial</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500 text-center mt-3 relative z-10">
          No charge during your 7-day trial. Cancel anytime with one click in Settings.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-around text-center text-[11px] text-slate-500 font-medium pt-1">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit TLS Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5 tabular-nums">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>4.9 / 5 Rating (12k+ Reviews)</span>
        </div>
      </div>
    </div>
  );
};
