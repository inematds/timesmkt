import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FlatHumanAlert, SparkleBurst, CoffeeCanSilhouette } from '../components/SVGIcons';
import { COLORS } from '../theme/colors';

export const Scene4Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background floods to amber
  const bgFlood = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 50 },
  });

  // Alert character pops in
  const charScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 9, stiffness: 100 },
  });

  // Sparkle burst expands outward
  const sparkleScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 11, stiffness: 80 },
  });
  const sparkleOpacity = interpolate(frame, [15, 30, 140, 170], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  // Can pulse glow
  const canGlow = interpolate(frame, [20, 50, 80, 110, 140], [0, 1, 0.4, 1, 0.4], { extrapolateRight: 'clamp' });

  // Text slides in per word (simulate with opacity stagger)
  const word1Opacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' });
  const word2Opacity = interpolate(frame, [38, 53], [0, 1], { extrapolateRight: 'clamp' });
  const word3Opacity = interpolate(frame, [51, 66], [0, 1], { extrapolateRight: 'clamp' });

  const word1Slide = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const word2Slide = spring({ frame: frame - 38, fps, config: { damping: 14 } });
  const word3Slide = spring({ frame: frame - 51, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>

      {/* Amber background flood */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at center, ${COLORS.amber} 0%, #D4860A 100%)`,
        transform: `scale(${bgFlood})`,
      }} />

      {/* Sparkle burst centered on can */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${sparkleScale})`,
        opacity: sparkleOpacity,
        zIndex: 5,
      }}>
        <SparkleBurst size={600} count={12} />
      </div>

      {/* Can with glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -56%)`,
        zIndex: 8,
        filter: `drop-shadow(0 0 ${24 + canGlow * 24}px rgba(249,245,240,${0.2 + canGlow * 0.25}))`,
      }}>
        <CoffeeCanSilhouette size={260} />
      </div>

      {/* Alert character to the right */}
      <div style={{
        position: 'absolute',
        right: '80px',
        bottom: '200px',
        transform: `scale(${charScale})`,
        zIndex: 9,
      }}>
        <FlatHumanAlert size={180} />
      </div>

      {/* Text — per-word entrance */}
      <div style={{
        position: 'absolute',
        bottom: '90px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        zIndex: 12,
      }}>
        <span style={{
          color: COLORS.coffeeDark,
          fontFamily: 'Inter, sans-serif',
          fontSize: '68px',
          fontWeight: 800,
          opacity: word1Opacity,
          transform: `translateY(${30 - word1Slide * 30}px)`,
          letterSpacing: '-0.02em',
        }}>No</span>
        <span style={{
          color: COLORS.coffeeDark,
          fontFamily: 'Inter, sans-serif',
          fontSize: '68px',
          fontWeight: 800,
          opacity: word2Opacity,
          transform: `translateY(${30 - word2Slide * 30}px)`,
          letterSpacing: '-0.02em',
        }}>bitterness.</span>
        <span style={{
          color: COLORS.offWhite,
          fontFamily: 'Inter, sans-serif',
          fontSize: '68px',
          fontWeight: 800,
          opacity: word3Opacity,
          transform: `translateY(${30 - word3Slide * 30}px)`,
          textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          letterSpacing: '-0.02em',
        }}>Pure boost.</span>
      </div>
    </AbsoluteFill>
  );
};
