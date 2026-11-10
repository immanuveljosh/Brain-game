import React from 'react';

interface BrainLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: string;
  animate?: boolean;
}

export const BrainLogo: React.FC<BrainLogoProps> = ({
  size = 'md',
  showText = true,
  tagline,
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', subtext: 'text-[10px]' },
    md: { icon: 44, text: 'text-2xl', subtext: 'text-xs' },
    lg: { icon: 68, text: 'text-3xl', subtext: 'text-sm' },
    xl: { icon: 88, text: 'text-4xl', subtext: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center">
        {/* Decorative Soft Emerald Aura */}
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-400/15 to-transparent blur-md pointer-events-none" />
        {/* Crisp White & Emerald Luxury Emblem */}
        <div
          className="relative rounded-2xl bg-gradient-to-b from-white to-emerald-50/40 border border-emerald-200/90 shadow-[0_6px_20px_-2px_rgba(5,150,105,0.16)] flex items-center justify-center p-1.5"
        >
          <svg
            width={currentSize.icon}
            height={currentSize.icon}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            <defs>
              <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064E3B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Left Hemisphere (Deep Forest Slate) */}
            <path
              d="M48 24C44 20 37 20 32 23C26 26 24 33 25 38C20 40 17 46 19 52C16 57 17 64 22 68C22 73 26 77 31 78C37 79 43 76 46 71C48 70 48 65 48 65"
              stroke="url(#forestGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32 37C34 42 39 44 42 43"
              stroke="url(#forestGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M26 53C31 54 36 52 40 48"
              stroke="url(#forestGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M30 67C35 66 39 61 41 57"
              stroke="url(#forestGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Right Hemisphere (Emerald & Teal Accent) */}
            <path
              d="M52 24C56 20 63 20 68 23C74 26 76 33 75 38C80 40 83 46 81 52C84 57 83 64 78 68C78 73 74 77 69 78C63 79 57 76 54 71C52 70 52 65 52 65"
              stroke="url(#emeraldGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M68 37C66 42 61 44 58 43"
              stroke="url(#emeraldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M74 53C69 54 64 52 60 48"
              stroke="url(#emeraldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M70 67C65 66 61 61 59 57"
              stroke="url(#emeraldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Central Synapse Axis */}
            <line
              x1="50"
              y1="28"
              x2="50"
              y2="72"
              stroke="#A7F3D0"
              strokeWidth="2.5"
              strokeDasharray="2 3"
            />
            <circle cx="50" cy="36" r="2.5" fill="#064E3B" />
            <circle cx="50" cy="50" r="3" fill="#059669" />
            <circle cx="50" cy="64" r="2.5" fill="#064E3B" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="mt-3 text-center">
          <h1 className={`font-extrabold tracking-tight text-slate-900 ${currentSize.text}`}>
            Mind<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Spark</span>
          </h1>
          {tagline && (
            <p className={`text-slate-500 font-medium tracking-wide mt-1 ${currentSize.subtext}`}>
              {tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
