import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Problem } from './scenes/Scene2Problem';
import { Scene3Solution } from './scenes/Scene3Solution';
import { Scene4Benefits } from './scenes/Scene4Benefits';
import { Scene5CTA } from './scenes/Scene5CTA';

export const ColdBrewAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#2C1A0E' }}>
      <Series>
        <Series.Sequence durationInFrames={90}>
          <Scene1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <Scene2Problem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <Scene3Solution />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <Scene4Benefits />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <Scene5CTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
