import React from 'react';
import { interpolate, spring, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

interface ProductImageProps {
  src?: string;
  size?: number;
  entrance?: 'spring-pop' | 'slide-right' | 'slide-left' | 'fade' | 'slide-up';
  startFrame?: number;
  floating?: boolean;
  glow?: boolean;
  glowColor?: string;
  position?: 'center' | 'top' | 'bottom';
  positionPercent?: number;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src = 'coffee_can.png.jpeg',
  size = 300,
  entrance = 'spring-pop',
  startFrame = 10,
  floating = true,
  glow = false,
  glowColor = '#F5A623',
  position = 'center',
  positionPercent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  // Entrance animations
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let opacity = 1;

  if (entrance === 'spring-pop') {
    scale = spring({ frame: relFrame, fps, config: { damping: 9, stiffness: 110 } });
    opacity = interpolate(frame, [startFrame, startFrame + 5], [0, 1], {
      extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    });
  } else if (entrance === 'slide-right') {
    const slide = spring({ frame: relFrame, fps, config: { damping: 10, stiffness: 95 } });
    translateX = (1 - slide) * 600;
    scale = spring({ frame: relFrame, fps, config: { damping: 10, stiffness: 95 } });
  } else if (entrance === 'slide-left') {
    const slide = spring({ frame: relFrame, fps, config: { damping: 10, stiffness: 95 } });
    translateX = -(1 - slide) * 600;
    scale = spring({ frame: relFrame, fps, config: { damping: 10, stiffness: 95 } });
  } else if (entrance === 'slide-up') {
    const slide = spring({ frame: relFrame, fps, config: { damping: 12, stiffness: 80 } });
    translateY = (1 - slide) * 400;
    opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
      extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    });
  } else {
    opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
      extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    });
  }

  // Floating animation
  const floatY = floating ? Math.sin(frame * 0.15) * 8 : 0;

  // Glow effect
  const glowIntensity = glow
    ? 20 + Math.sin(frame * 0.1) * 10
    : 0;

  // Position
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
  };

  if (positionPercent !== undefined) {
    posStyle.top = `${positionPercent}%`;
    posStyle.left = '50%';
    posStyle.marginLeft = -size / 2;
  } else if (position === 'top') {
    posStyle.top = '15%';
    posStyle.left = '50%';
    posStyle.marginLeft = -size / 2;
  } else if (position === 'bottom') {
    posStyle.bottom = '15%';
    posStyle.left = '50%';
    posStyle.marginLeft = -size / 2;
  } else {
    posStyle.top = '50%';
    posStyle.left = '50%';
    posStyle.marginLeft = -size / 2;
    posStyle.marginTop = -size / 2;
  }

  return (
    <div style={{
      ...posStyle,
      opacity,
      transform: `translateX(${translateX}px) translateY(${translateY + floatY}px) scale(${scale})`,
      filter: glow
        ? `drop-shadow(0 0 ${glowIntensity}px ${glowColor}) drop-shadow(0 12px 40px rgba(0,0,0,0.4))`
        : 'drop-shadow(0 12px 40px rgba(0,0,0,0.4))',
    }}>
      <Img
        src={staticFile(src)}
        style={{ width: size, height: 'auto', objectFit: 'contain' }}
      />
    </div>
  );
};
