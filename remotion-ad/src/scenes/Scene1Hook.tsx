import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AlarmClock, SunArc } from '../components/SVGIcons';
import { COLORS } from '../theme/colors';

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background fades in
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Alarm clock pops in with spring overshoot
  const clockScale = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 100, mass: 0.8 },
  });

  // Ring vibration — subtle left-right oscillation
  const ringOffset = Math.sin(frame * 0.6) * (frame < 60 ? Math.min(frame * 0.2, 5) : 0);

  // Sun arc rises from the bottom
  const sunProgress = interpolate(frame, [20, 85], [0, 0.72], { extrapolateRight: 'clamp' });

  // Text slides up and fades in
  const textOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });
  const textTranslateY = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.coffeeMid} 0%, ${COLORS.coffeeDark} 100%)`,
        opacity: bgOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}
    >
      {/* Alarm clock */}
      <div style={{ transform: `scale(${clockScale})`, marginBottom: 24 }}>
        <AlarmClock size={220} ringOffset={ringOffset} />
      </div>

      {/* Sun arc below clock */}
      <div style={{ marginTop: -20 }}>
        <SunArc size={320} progress={sunProgress} />
      </div>

      {/* Hook text */}
      <h1
        style={{
          color: COLORS.offWhite,
          fontFamily: 'Inter, sans-serif',
          fontSize: '78px',
          fontWeight: 800,
          textAlign: 'center',
          marginTop: 32,
          lineHeight: 1.1,
          opacity: textOpacity,
          transform: `translateY(${40 - textTranslateY * 40}px)`,
          textShadow: `0 4px 20px rgba(0,0,0,0.55)`,
          letterSpacing: '-0.02em',
        }}
      >
        Still dragging<br />this morning?
      </h1>
    </AbsoluteFill>
  );
};
