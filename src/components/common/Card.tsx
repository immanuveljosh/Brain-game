import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  glow?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  glow = false,
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white border-emerald-950/[0.08] shadow-[0_4px_20px_-4px_rgba(6,78,59,0.05),0_1px_3px_rgba(15,23,42,0.03)]',
    elevated:
      'bg-gradient-to-b from-white to-emerald-50/25 border-emerald-200/80 shadow-[0_10px_28px_-6px_rgba(5,150,105,0.10)]',
    glass:
      'bg-white/90 backdrop-blur-xl border-emerald-100 shadow-[0_6px_20px_-4px_rgba(6,78,59,0.06)]',
    gradient:
      'bg-gradient-to-br from-white via-white to-emerald-50/50 border-emerald-200/80 shadow-[0_6px_22px_-4px_rgba(5,150,105,0.08)]',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:border-emerald-400/80 hover:shadow-[0_12px_28px_-6px_rgba(5,150,105,0.14)] active:scale-[0.99] transition-all duration-200'
    : '';

  const glowStyles = glow
    ? 'shadow-[0_6px_24px_rgba(16,185,129,0.14)] border-emerald-300/80'
    : '';

  return (
    <div
      className={`rounded-2xl border p-4 text-slate-900 transition-colors ${variantStyles[variant]} ${interactiveStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
