import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface CTAButtonProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  startFrame?: number;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  bgColor = '#F5A623',
  textColor = '#2C1A0E',
  startFrame = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 10, stiffness: 110 },
  });
  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Subtle pulse after entrance
  const pulse = frame > startFrame + 30
    ? 1 + Math.sin((frame - startFrame) * 0.08) * 0.02
    : 1;

  return (
    <div style={{
      position: 'absolute',
      bottom: '12%',
      left: '50%',
      transform: `translateX(-50%) scale(${scale * pulse})`,
      opacity,
      zIndex: 25,
    }}>
      <div style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: 'Inter, sans-serif',
        fontSize: 40,
        fontWeight: 800,
        padding: '24px 80px',
        borderRadius: 60,
        boxShadow: `0 10px 40px rgba(0,0,0,0.3)`,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}>
        {text}
      </div>
    </div>
  );
};
