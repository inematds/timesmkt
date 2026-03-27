import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FlatHumanTired } from '../components/SVGIcons';
import { COLORS } from '../theme/colors';

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fades in with desaturated tone
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Character slides up from bottom
  const charTranslateY = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Subtle up-down bob (tired sway)
  const bobY = Math.sin(frame * 0.15) * 8;

  // Text
  const textOpacity = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: 'clamp' });
  const textSlide = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #3A3030 0%, #2A2020 100%)`,
        opacity: bgOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'saturate(0.4)',
      }}
    >
      {/* Tired character */}
      <div
        style={{
          transform: `translateY(${(1 - charTranslateY) * 120 + bobY}px)`,
          marginBottom: 32,
        }}
      >
        <FlatHumanTired size={240} />
      </div>

      {/* Text */}
      <h2
        style={{
          color: COLORS.offWhite,
          fontFamily: 'Inter, sans-serif',
          fontSize: '70px',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.2,
          opacity: textOpacity,
          transform: `translateY(${40 - textSlide * 40}px)`,
          textShadow: '0 4px 16px rgba(0,0,0,0.6)',
          letterSpacing: '-0.02em',
        }}
      >
        We've been there.
      </h2>
    </AbsoluteFill>
  );
};
