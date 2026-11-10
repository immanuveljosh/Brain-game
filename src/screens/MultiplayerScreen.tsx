import React, { useState } from 'react';
import {
  Users,
  Swords,
  UserPlus,
  Zap,
  Search,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const MultiplayerScreen: React.FC = () => {
  const { friends, user, startPlayingGame, showToast } = useAppStore();
  const [matchmaking, setMatchmaking] = useState<boolean>(false);
  const [matchFound, setMatchFound] = useState<boolean>(false);

  const handleQuickMatch = () => {
    setMatchmaking(true);
    setMatchFound(false);

    setTimeout(() => {
      setMatchFound(true);
      setTimeout(() => {
        setMatchmaking(false);
        setMatchFound(false);
        startPlayingGame('math-sprint');
      }, 1400);
    }, 1800);
  };

  const handleInviteFriend = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('https://mindspark.app/duel/invite/usr_john_01').catch(() => {});
    }
    showToast('Friend duel invite link copied to clipboard!', 'success');
  };

  return (
    <div className="p-4 max-w-md md:max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-emerald-950/[0.08]">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Live Arena 1v1</span>
          <Swords className="w-5 h-5 text-emerald-600" />
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Real-time head-to-head cognitive speed &amp; accuracy matches
        </p>
      </div>

      {/* Main Arena Battle Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/55 border border-emerald-200/80 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.07)] relative overflow-hidden text-center">
        <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-emerald-400/15 blur-2xl" />

        <div className="flex items-center justify-around mb-5 tabular-nums relative z-10">
          {/* Player 1 (You) */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-emerald-600 text-white font-extrabold text-[9px] rounded-full">
                YOU
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-2">{user.name}</span>
            <span className="text-[11px] text-emerald-700 font-semibold">{user.brainScore} BSI</span>
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 font-black text-xs shadow-2xs">
              VS
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase mt-1.5 tracking-wider">
              Ranked 1v1
            </span>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-emerald-50/60 border-2 border-dashed border-emerald-300 flex items-center justify-center text-emerald-600 overflow-hidden">
                {matchFound ? (
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="Mike Chen"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-6 h-6" />
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-2">
              {matchFound ? 'Mike Chen' : 'Challenger'}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              {matchFound ? '1,180 BSI' : 'Matchmaking'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {matchmaking ? (
          <div className="py-3 px-4 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2 relative z-10">
            {matchFound ? (
              <>
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Opponent Connected! Launching Math Sprint Duel...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>Searching for a skill-matched challenger...</span>
              </>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleQuickMatch}
            className="relative z-10 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-[0_6px_18px_rgba(5,150,105,0.25)] flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <Swords className="w-4 h-4" />
            <span>Find Ranked 1v1 Match</span>
          </button>
        )}
      </div>

      {/* Friends List with Direct Challenge */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_20px_-4px_rgba(6,78,59,0.05)]">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 tracking-tight">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Friends Roster ({friends.length})</span>
          </h3>
          <button
            type="button"
            onClick={handleInviteFriend}
            className="px-3 py-1.5 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 text-xs font-semibold text-emerald-800 flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copy Invite Link</span>
          </button>
        </div>

        <div className="space-y-2.5 tabular-nums">
          {friends.map((f) => (
            <div
              key={f.id}
              className="p-3.5 rounded-xl bg-emerald-50/30 border border-emerald-950/[0.07] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      f.status === 'online'
                        ? 'bg-emerald-500'
                        : f.status === 'in-game'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-900">{f.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    BSI: <span className="text-emerald-700 font-semibold">{f.brainScore}</span> • {f.lastActive}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startPlayingGame('math-sprint')}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200/90 hover:border-emerald-600 font-semibold text-xs flex items-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Challenge</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
