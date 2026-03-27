import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CoffeeCanSilhouette } from '../components/SVGIcons';
import { COLORS } from '../theme/colors';

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background color flood: dark → amber + cold blue
  const amberFloodScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 55 },
  });
  const blueFloodScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 55 },
  });

  // Can slides in from the right with spring overshoot
  const canSlideX = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 95, mass: 0.9 },
  });

  // Can scale pop
  const canScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 9, stiffness: 110 },
  });

  // Floating animation
  const floatY = Math.sin(frame * 0.18) * 10;

  // Energy rings pulsing from the can
  const ring1Scale = interpolate(frame, [25, 75], [0.6, 2.2], { extrapolateRight: 'clamp' });
  const ring1Opacity = interpolate(frame, [25, 50, 75], [0, 0.5, 0], { extrapolateRight: 'clamp' });
  const ring2Scale = interpolate(frame, [42, 88], [0.6, 2.2], { extrapolateRight: 'clamp' });
  const ring2Opacity = interpolate(frame, [42, 65, 88], [0, 0.45, 0], { extrapolateRight: 'clamp' });

  // Text
  const textOpacity = interpolate(frame, [28, 48], [0, 1], { extrapolateRight: 'clamp' });
  const textSlide = spring({ frame: frame - 28, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.coffeeDark, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

      {/* Amber flood from bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-20%',
        width: '1600px',
        height: '1600px',
        borderRadius: '50%',
        backgroundColor: COLORS.amber,
        opacity: 0.18,
        transform: `scale(${amberFloodScale})`,
      }} />

      {/* Cold blue flood from top-right */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-20%',
        width: '1200px',
        height: '1200px',
        borderRadius: '50%',
        backgroundColor: COLORS.coldBlue,
        opacity: 0.14,
        transform: `scale(${blueFloodScale})`,
      }} />

      {/* Energy rings */}
      <div style={{
        position: 'absolute',
        width: '280px', height: '280px',
        borderRadius: '50%',
        border: `6px solid ${COLORS.amber}`,
        transform: `scale(${ring1Scale})`,
        opacity: ring1Opacity,
      }} />
      <div style={{
        position: 'absolute',
        width: '280px', height: '280px',
        borderRadius: '50%',
        border: `6px solid ${COLORS.coldBlue}`,
        transform: `scale(${ring2Scale})`,
        opacity: ring2Opacity,
      }} />

      {/* Can slides in from right */}
      <div style={{
        transform: `translateX(${(1 - canSlideX) * 600}px) scale(${canScale}) translateY(${floatY}px)`,
        zIndex: 10,
        filter: `drop-shadow(0 12px 40px rgba(0,0,0,0.45))`,
        marginBottom: 60,
      }}>
        <CoffeeCanSilhouette size={320} />
      </div>

      {/* Text */}
      <h2
        style={{
          position: 'absolute',
          bottom: '120px',
          color: COLORS.offWhite,
          fontFamily: 'Inter, sans-serif',
          fontSize: '72px',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.1,
          opacity: textOpacity,
          transform: `translateY(${40 - textSlide * 40}px)`,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          letterSpacing: '-0.02em',
          zIndex: 10,
        }}
      >
        Meet Cold Brew.
      </h2>
    </AbsoluteFill>
  );
};
