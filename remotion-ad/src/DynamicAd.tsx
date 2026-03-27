import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { DynamicScene, SceneData } from './scenes/DynamicScene';

export interface ScenePlanProps {
  [key: string]: unknown;
  titulo?: string;
  campaign?: string;
  campanha?: string;
  video_length?: number;
  total_frames?: number;
  paleta_cores?: Record<string, string>;
  color_palette?: Record<string, string>;
  cta_final?: string;
  cta_acao?: string;
  scenes: SceneData[];
  scene_images?: Record<string, string>;
  // Audio — continuous narration + background music
  narration_file?: string;
  narration_volume?: number;
  background_music?: string;
  background_music_volume?: number;
}

export const DynamicAd: React.FC<ScenePlanProps> = (props) => {
  const {
    scenes = [],
    paleta_cores,
    color_palette,
    cta_final,
    cta_acao,
    scene_images,
    narration_file,
    narration_volume = 1,
    background_music,
    background_music_volume = 0.25,
  } = props;

  const palette: Record<string, string> = {
    ...color_palette,
    ...paleta_cores,
  };

  if (!palette.coffee_dark && !palette.fundo_principal) {
    palette.coffee_dark = '#2C1A0E';
    palette.coffee_mid = '#4B2E1A';
    palette.cold_blue = '#BFD9E8';
    palette.amber = '#F5A623';
    palette.off_white = '#F9F5F0';
  }

  const bgColor = palette.coffee_dark || palette.fundo_principal || '#2C1A0E';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Background music — plays for full video duration */}
      {background_music && (
        <Audio
          src={staticFile(background_music)}
          volume={background_music_volume}
        />
      )}

      {/* Continuous narration — single fluid audio over all scenes */}
      {narration_file && (
        <Audio
          src={staticFile(narration_file)}
          volume={narration_volume}
        />
      )}

      {/* Visual scenes */}
      {scenes.map((scene, index) => {
        const startFrame = scene.frame_inicio || 0;
        const duration = scene.duracao_frames || 90;
        const isLast = index === scenes.length - 1;

        return (
          <Sequence
            key={scene.scene_id || index}
            from={startFrame}
            durationInFrames={duration}
            name={scene.nome || scene.tipo || `Scene ${index + 1}`}
          >
            <DynamicScene
              scene={scene}
              palette={palette}
              ctaText={cta_final}
              ctaAction={cta_acao}
              isLastScene={isLast}
              sceneImages={scene_images as Record<string, string>}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
