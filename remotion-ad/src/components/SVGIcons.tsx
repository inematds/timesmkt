import React from 'react';
import { COLORS } from '../theme/colors';

export const CoffeeBean: React.FC<{ size?: number }> = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z"
      fill={COLORS.coffeeMid}
    />
    <path
      d="M30 30C45 40 45 60 40 70C55 60 55 40 50 30"
      stroke={COLORS.coffeeDark}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CoffeeCupWithSteam: React.FC<{ size?: number }> = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Steam */}
    <path d="M35 15C40 10 40 5 35 0" stroke={COLORS.offWhite} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
    <path d="M50 15C55 10 55 5 50 0" stroke={COLORS.offWhite} strokeWidth="3" strokeLinecap="round" opacity={0.6} />
    <path d="M65 15C70 10 70 5 65 0" stroke={COLORS.offWhite} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
    {/* Cup */}
    <path d="M75 25H25V65C25 78.8071 36.1929 90 50 90C63.8071 90 75 78.8071 75 65V25Z" fill={COLORS.coffeeMid} />
    {/* Handle */}
    <path d="M75 35H85C90.5228 35 95 39.4772 95 45v5C95 56.0457 86.0457 65 75 65" stroke={COLORS.coffeeMid} strokeWidth="8" strokeLinecap="round" />
    {/* Red bitter aura overlay (optional usage) */}
    <circle cx="50" cy="55" r="10" fill="red" opacity="0.3" filter="blur(4px)" />
  </svg>
);

export const DownwardArrow: React.FC<{ size?: number }> = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10V80M50 80L30 60M50 80L70 60" stroke="#FF4D4D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ColdBrewBottle: React.FC<{ size?: number }> = ({ size = 150 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bottle top */}
    <path d="M40 5H60V25H40V5Z" fill={COLORS.coffeeDark} />
    {/* Bottle Body */}
    <path d="M30 25C25 25 20 30 20 35V135C20 143.284 26.7157 150 35 150H65C73.2843 150 80 143.284 80 135V35C80 30 75 25 70 25H30Z" fill={COLORS.coldBlue} opacity="0.3" />
    <path d="M25 40H75V145C75 147.761 72.7614 150 70 150H30C27.2386 150 25 147.761 25 145V40Z" fill={COLORS.coffeeDark} />
    {/* Label */}
    <rect x="25" y="60" width="50" height="40" fill={COLORS.offWhite} />
    <circle cx="50" cy="80" r="10" fill={COLORS.amber} />
    {/* Liquid highlight */}
    <path d="M30 40H40C40 40 35 90 30 140V40Z" fill="white" opacity="0.1" />
  </svg>
);

export const Checkmark: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill={COLORS.amber} />
    <path d="M30 50L45 65L70 35" stroke={COLORS.coffeeDark} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Custom SVGs for "Your Morning, Upgraded" concept ───

export const AlarmClock: React.FC<{ size?: number; ringOffset?: number }> = ({ size = 200, ringOffset = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Vibration lines */}
    <line x1={8 + ringOffset} y1="30" x2={2 + ringOffset} y2="22" stroke={COLORS.amber} strokeWidth="3" strokeLinecap="round" />
    <line x1={92 - ringOffset} y1="30" x2={98 - ringOffset} y2="22" stroke={COLORS.amber} strokeWidth="3" strokeLinecap="round" />
    {/* Bell bumps */}
    <circle cx="22" cy="20" r="8" fill={COLORS.coffeeMid} />
    <circle cx="78" cy="20" r="8" fill={COLORS.coffeeMid} />
    {/* Clock body */}
    <circle cx="50" cy="55" r="35" fill={COLORS.coffeeMid} stroke={COLORS.amber} strokeWidth="4" />
    <circle cx="50" cy="55" r="29" fill={COLORS.coffeeDark} />
    {/* Clock hands */}
    <line x1="50" y1="55" x2="50" y2="32" stroke={COLORS.offWhite} strokeWidth="3.5" strokeLinecap="round" />
    <line x1="50" y1="55" x2="66" y2="62" stroke={COLORS.amber} strokeWidth="3" strokeLinecap="round" />
    {/* Center dot */}
    <circle cx="50" cy="55" r="3.5" fill={COLORS.amber} />
    {/* Feet */}
    <line x1="38" y1="88" x2="32" y2="96" stroke={COLORS.coffeeMid} strokeWidth="4" strokeLinecap="round" />
    <line x1="62" y1="88" x2="68" y2="96" stroke={COLORS.coffeeMid} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const SunArc: React.FC<{ size?: number; progress?: number }> = ({ size = 300, progress = 1 }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 300 165" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Horizon line */}
    <line x1="0" y1="160" x2="300" y2="160" stroke={COLORS.coffeeMid} strokeWidth="3" />
    {/* Sun glow */}
    <circle cx="150" cy="160" r="60" fill={COLORS.amber} opacity="0.12" />
    {/* Sun arc path (semicircle) */}
    <path d="M 20 160 A 130 130 0 0 1 280 160" stroke={COLORS.amber} strokeWidth="3" strokeDasharray="6 6" opacity="0.4" />
    {/* Sun body */}
    <circle cx="150" cy={160 - progress * 120} r="28" fill={COLORS.amber} />
    {/* Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 150 + Math.cos(rad) * 36;
      const y1 = (160 - progress * 120) + Math.sin(rad) * 36;
      const x2 = 150 + Math.cos(rad) * 48;
      const y2 = (160 - progress * 120) + Math.sin(rad) * 48;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.amber} strokeWidth="3" strokeLinecap="round" />;
    })}
  </svg>
);

export const FlatHumanTired: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="50" cy="22" r="18" fill="#7A6355" />
    {/* Half-closed eyes */}
    <line x1="40" y1="22" x2="46" y2="22" stroke={COLORS.coffeeDark} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="54" y1="22" x2="60" y2="22" stroke={COLORS.coffeeDark} strokeWidth="2.5" strokeLinecap="round" />
    {/* Frown */}
    <path d="M 43 30 Q 50 27 57 30" stroke={COLORS.coffeeDark} strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Neck */}
    <rect x="45" y="38" width="10" height="10" rx="3" fill="#7A6355" />
    {/* Body — slumped */}
    <path d="M 25 48 Q 50 44 75 48 L 70 100 H 30 Z" fill="#5A4A3E" />
    {/* Arms — drooping down */}
    <path d="M 30 55 Q 18 70 20 88" stroke="#7A6355" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M 70 55 Q 82 70 80 88" stroke="#7A6355" strokeWidth="10" strokeLinecap="round" fill="none" />
    {/* Legs */}
    <rect x="32" y="98" width="14" height="36" rx="7" fill="#7A6355" />
    <rect x="54" y="98" width="14" height="36" rx="7" fill="#7A6355" />
    {/* Zzzs */}
    <text x="68" y="18" fontSize="12" fill={COLORS.coldBlue} fontWeight="bold" opacity="0.8">z</text>
    <text x="76" y="10" fontSize="10" fill={COLORS.coldBlue} fontWeight="bold" opacity="0.6">z</text>
    <text x="83" y="4" fontSize="8" fill={COLORS.coldBlue} fontWeight="bold" opacity="0.4">z</text>
  </svg>
);

export const FlatHumanAlert: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="50" cy="22" r="18" fill={COLORS.coffeeMid} />
    {/* Open eyes with pupils */}
    <circle cx="43" cy="20" r="4" fill={COLORS.offWhite} />
    <circle cx="57" cy="20" r="4" fill={COLORS.offWhite} />
    <circle cx="44" cy="20" r="2" fill={COLORS.coffeeDark} />
    <circle cx="58" cy="20" r="2" fill={COLORS.coffeeDark} />
    {/* Smile */}
    <path d="M 42 30 Q 50 36 58 30" stroke={COLORS.coffeeDark} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Neck */}
    <rect x="45" y="38" width="10" height="10" rx="3" fill={COLORS.coffeeMid} />
    {/* Body — upright */}
    <path d="M 28 48 Q 50 45 72 48 L 68 100 H 32 Z" fill={COLORS.coffeeMid} />
    {/* Arms — raised and energetic */}
    <path d="M 32 56 Q 14 40 16 22" stroke={COLORS.coffeeMid} strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M 68 56 Q 86 40 84 22" stroke={COLORS.coffeeMid} strokeWidth="10" strokeLinecap="round" fill="none" />
    {/* Hands holding can suggestion */}
    <circle cx="16" cy="20" r="8" fill={COLORS.coffeeMid} />
    <circle cx="84" cy="20" r="8" fill={COLORS.coffeeMid} />
    {/* Legs */}
    <rect x="32" y="98" width="14" height="36" rx="7" fill={COLORS.coffeeMid} />
    <rect x="54" y="98" width="14" height="36" rx="7" fill={COLORS.coffeeMid} />
  </svg>
);

export const SparkleBurst: React.FC<{ size?: number; count?: number }> = ({ size = 200, count = 8 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 360;
      const rad = (angle * Math.PI) / 180;
      const dist = 60 + (i % 2) * 20;
      const cx = 100 + Math.cos(rad) * dist;
      const cy = 100 + Math.sin(rad) * dist;
      const starColor = i % 3 === 0 ? COLORS.amber : i % 3 === 1 ? COLORS.coldBlue : COLORS.offWhite;
      return (
        <g key={i} transform={`translate(${cx}, ${cy})`}>
          <path d={`M 0 -10 L 2.5 -2.5 L 10 0 L 2.5 2.5 L 0 10 L -2.5 2.5 L -10 0 L -2.5 -2.5 Z`}
            fill={starColor} opacity={0.85} transform={`rotate(${angle * 0.5})`} />
        </g>
      );
    })}
    {/* Center glow */}
    <circle cx="100" cy="100" r="22" fill={COLORS.amber} opacity="0.25" />
    <circle cx="100" cy="100" r="12" fill={COLORS.amber} opacity="0.5" />
  </svg>
);

export const CoffeeCanSilhouette: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size * 0.6} height={size} viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Can top ellipse */}
    <ellipse cx="30" cy="8" rx="26" ry="8" fill={COLORS.coffeeMid} />
    {/* Can body */}
    <rect x="4" y="8" width="52" height="78" rx="4" fill={COLORS.coffeeDark} />
    {/* Can label band */}
    <rect x="4" y="30" width="52" height="36" fill={COLORS.coffeeMid} rx="2" />
    {/* Brand text area (off-white stripe) */}
    <rect x="10" y="35" width="40" height="10" rx="2" fill={COLORS.offWhite} opacity="0.9" />
    {/* Amber accent stripe */}
    <rect x="4" y="28" width="52" height="4" fill={COLORS.amber} />
    <rect x="4" y="64" width="52" height="4" fill={COLORS.amber} />
    {/* Cold blue liquid suggestion */}
    <ellipse cx="30" cy="50" rx="14" ry="5" fill={COLORS.coldBlue} opacity="0.25" />
    {/* Can bottom ellipse */}
    <ellipse cx="30" cy="86" rx="26" ry="8" fill={COLORS.coffeeMid} />
    {/* Shine highlight */}
    <path d="M 10 15 Q 14 50 12 82" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.1" />
  </svg>
);

export const SunRisingCup: React.FC<{ size?: number }> = ({ size = 150 }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun */}
    <circle cx="75" cy="80" r="40" fill={COLORS.amber} />
    {/* Sun rays pass 1 */}
    <path d="M75 10v10M75 130v10M10 75h10M130 75h10M30 30l8 8M112 112l8 8M30 120l8-8M112 38l8-8" stroke={COLORS.amber} strokeWidth="6" strokeLinecap="round" />
    {/* Cup obscuring sun */}
    <path d="M100 80H50V120C50 133.807 61.1929 145 75 145C88.8071 145 100 133.807 100 120V80Z" fill={COLORS.offWhite} />
    {/* Liquid */}
    <path d="M100 85H50V90C50 90 75 95 100 90V85Z" fill={COLORS.coffeeMid} />
  </svg>
);
