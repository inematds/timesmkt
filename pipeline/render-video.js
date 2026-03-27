/**
 * Remotion Video Render Script
 *
 * Renders a video using Remotion. Supports two modes:
 *   1. Dynamic: reads a scene_plan.json and renders the DynamicAd composition
 *   2. Fallback: renders the hardcoded ColdBrewAd composition
 *
 * Usage:
 *   node pipeline/render-video.js <output_path> [scene_plan_path]
 *
 * Examples:
 *   node pipeline/render-video.js outputs/campaign/video/ad.mp4 outputs/campaign/video/scene_plan.json
 *   node pipeline/render-video.js outputs/campaign/video/ad.mp4
 */

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const outputPath = process.argv[2];
const scenePlanPath = process.argv[3];

if (!outputPath) {
  console.error('Usage: node pipeline/render-video.js <output_path> [scene_plan_path]');
  process.exit(1);
}

const absOutput = path.resolve(__dirname, '..', outputPath);
const remotionDir = path.resolve(__dirname, '..', 'remotion-ad');

// Ensure output directory exists
fs.mkdirSync(path.dirname(absOutput), { recursive: true });

// Determine composition and props
let compositionId = 'ColdBrewAd';
let propsArg = [];

if (scenePlanPath) {
  const absScenePlan = path.resolve(__dirname, '..', scenePlanPath);

  if (fs.existsSync(absScenePlan)) {
    console.log(`📋 Scene plan: ${absScenePlan}`);

    const scenePlan = JSON.parse(fs.readFileSync(absScenePlan, 'utf-8'));

    // Determine composition based on aspect ratio
    const config = scenePlan.remotion_config || scenePlan.composition || {};
    const width = config.width || 1080;
    const height = config.height || 1920;

    if (height > width) {
      compositionId = 'DynamicAd'; // 9:16 vertical
    } else {
      compositionId = 'DynamicAdSquare'; // 1:1 square
    }

    // Pass scene plan as input props via --props
    propsArg = ['--props', JSON.stringify(scenePlan)];

    console.log(`   Composition: ${compositionId} (${width}x${height})`);
    console.log(`   Scenes: ${scenePlan.scenes?.length || 0}`);
    console.log(`   Title: ${scenePlan.titulo || scenePlan.concept_title || 'N/A'}`);
  } else {
    console.log(`⚠ Scene plan not found: ${absScenePlan}, falling back to ColdBrewAd`);
  }
}

console.log(`🎬 Rendering ${compositionId} to: ${absOutput}`);

try {
  execFileSync('npx', [
    'remotion', 'render',
    'src/index.ts',
    compositionId,
    absOutput,
    ...propsArg,
  ], {
    cwd: remotionDir,
    stdio: 'inherit',
    timeout: 300000, // 5 min max
  });

  console.log(`✅ Video rendered successfully: ${absOutput}`);
} catch (err) {
  console.error(`❌ Remotion render failed: ${err.message}`);
  process.exit(1);
}
