import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Solid color with optional gradient
export const SolidBackground: React.FC<{
  color: string;
  secondaryColor?: string;
  gradient?: 'radial' | 'linear-top' | 'linear-bottom';
}> = ({ color, secondaryColor, gradient }) => {
  let bg = color;
  if (secondaryColor && gradient) {
    if (gradient === 'radial') {
      bg = `radial-gradient(ellipse at center, ${secondaryColor} 0%, ${color} 100%)`;
    } else if (gradient === 'linear-top') {
      bg = `linear-gradient(180deg, ${secondaryColor} 0%, ${color} 100%)`;
    } else {
      bg = `linear-gradient(0deg, ${secondaryColor} 0%, ${color} 100%)`;
    }
  }
  return <AbsoluteFill style={{ background: bg }} />;
};

// Animated color flood (circle expanding from center)
export const FloodBackground: React.FC<{
  color: string;
  delay?: number;
}> = ({ color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 20, stiffness: 50 },
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '200%',
        height: '200%',
        borderRadius: '50%',
        backgroundColor: color,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }} />
    </AbsoluteFill>
  );
};

// Desaturated/memory effect background
export const MemoryBackground: React.FC<{
  color: string;
  saturation?: number;
}> = ({ color, saturation = 0.4 }) => {
  return (
    <AbsoluteFill style={{
      backgroundColor: color,
      filter: `saturate(${saturation})`,
    }} />
  );
};

// Animated gradient background
export const AnimatedGradient: React.FC<{
  colorTop: string;
  colorBottom: string;
}> = ({ colorTop, colorBottom }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 90], [0, 100], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${colorTop} ${100 - progress}%, ${colorBottom} 100%)`,
    }} />
  );
};

// Pulsing glow ring effect
export const GlowRings: React.FC<{
  color1: string;
  color2: string;
}> = ({ color1, color2 }) => {
  const frame = useCurrentFrame();

  const ring1Scale = interpolate(frame, [10, 60], [0.5, 2.5], { extrapolateRight: 'clamp' });
  const ring1Opacity = interpolate(frame, [10, 35, 60], [0, 0.5, 0], { extrapolateRight: 'clamp' });
  const ring2Scale = interpolate(frame, [25, 75], [0.5, 2.5], { extrapolateRight: 'clamp' });
  const ring2Opacity = interpolate(frame, [25, 50, 75], [0, 0.4, 0], { extrapolateRight: 'clamp' });

  return (
    <>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 300, height: 300, borderRadius: '50%',
        border: `6px solid ${color1}`,
        transform: `translate(-50%, -50%) scale(${ring1Scale})`,
        opacity: ring1Opacity,
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 300, height: 300, borderRadius: '50%',
        border: `6px solid ${color2}`,
        transform: `translate(-50%, -50%) scale(${ring2Scale})`,
        opacity: ring2Opacity,
      }} />
    </>
  );
};

// Flash transition (white flash at start of scene)
export const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 1, 5], [0, 1, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#FFFFFF',
      opacity,
      zIndex: 50,
    }} />
  );
};

// Vignette overlay for memory/flashback scenes
export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.6 }) => {
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
      zIndex: 15,
    }} />
  );
};
