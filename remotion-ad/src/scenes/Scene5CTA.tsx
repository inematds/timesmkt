import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CoffeeCanSilhouette } from '../components/SVGIcons';
import { COLORS } from '../theme/colors';

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Clean off-white background fades in
  const bgOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Per-word CTA text animation
  const word1Scale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const word2Scale = spring({ frame: frame - 22, fps, config: { damping: 12, stiffness: 100 } });
  const word3Scale = spring({ frame: frame - 34, fps, config: { damping: 12, stiffness: 100 } });
  const word1Opacity = interpolate(frame, [10, 20], [0, 1], { extrapolateRight: 'clamp' });
  const word2Opacity = interpolate(frame, [22, 32], [0, 1], { extrapolateRight: 'clamp' });
  const word3Opacity = interpolate(frame, [34, 44], [0, 1], { extrapolateRight: 'clamp' });

  // Can fades in below text
  const canOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp' });
  const canScale = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 85 } });

  // CTA button scales up
  const btnScale = spring({ frame: frame - 70, fps, config: { damping: 10, stiffness: 110 } });
  const btnOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp' });

  // Subtle floating can
  const floatY = Math.sin(frame * 0.15) * 8;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.offWhite,
        opacity: bgOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}
    >
      {/* Headline — per-word */}
      <div style={{
        display: 'flex',
        gap: '28px',
        marginBottom: 32,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { word: 'Upgrade', scale: word1Scale, opacity: word1Opacity },
          { word: 'Your', scale: word2Scale, opacity: word2Opacity },
          { word: 'Morning.', scale: word3Scale, opacity: word3Opacity },
        ].map(({ word, scale, opacity }) => (
          <span
            key={word}
            style={{
              color: COLORS.coffeeDark,
              fontFamily: 'Inter, sans-serif',
              fontSize: '88px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              opacity,
              transform: `scale(${scale})`,
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Can */}
      <div style={{
        opacity: canOpacity,
        transform: `scale(${canScale}) translateY(${floatY}px)`,
        marginBottom: 36,
        filter: 'drop-shadow(0 16px 40px rgba(44,26,14,0.2))',
      }}>
        <CoffeeCanSilhouette size={260} />
      </div>

      {/* CTA button */}
      <div
        style={{
          opacity: btnOpacity,
          transform: `scale(${btnScale})`,
          backgroundColor: COLORS.amber,
          color: COLORS.coffeeDark,
          fontFamily: 'Inter, sans-serif',
          fontSize: '44px',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          padding: '24px 80px',
          borderRadius: '60px',
          boxShadow: `0 10px 40px rgba(245,166,35,0.45)`,
        }}
      >
        Shop Now
      </div>
    </AbsoluteFill>
  );
};
