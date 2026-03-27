/**
 * Media Module — Unified API for all media operations
 *
 * Usage:
 *   const media = require('./media');
 *   await media.image.generate('coffee cup', 'out.png');
 *   await media.image.stock('coffee morning', 'out.jpg');
 *   await media.tts.speak('Bom dia', 'out.mp3', { provider: 'elevenlabs' });
 *   await media.sfx.fetch('pop sound', 'out.mp3');
 *   await media.music.fetch('lo-fi piano', 'out.mp3');
 *   media.providers.printStatus();
 */

const providers = require('./providers');
const { generateImage, fetchStockImage } = require('./image-generator');
const { generateSpeech, VOICES } = require('./tts-generator');
const { fetchSFX, fetchMusic } = require('./sfx-fetcher');

module.exports = {
  providers,
  image: {
    generate: generateImage,
    stock: fetchStockImage,
  },
  tts: {
    speak: generateSpeech,
    voices: VOICES,
  },
  sfx: {
    fetch: fetchSFX,
  },
  music: {
    fetch: fetchMusic,
  },
};
