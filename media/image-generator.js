/**
 * Image Generator — Multi-provider image fetching/generation
 *
 * Supports: Kie.ai Z-Image (default), DALL-E 3, Stability AI, Unsplash, Pexels
 *
 * Usage:
 *   const { generateImage, fetchStockImage } = require('./image-generator');
 *   await generateImage('coffee cup on table', 'output.png');                         // uses kie z-image (default)
 *   await generateImage('coffee cup on table', 'output.png', { provider: 'dalle' });  // uses DALL-E
 *   await fetchStockImage('coffee morning', 'output.jpg', { provider: 'unsplash' });
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { getEnvVar, getBestProvider } = require('./providers');

// ── Kie.ai Z-Image ─────────────────────────────────────────────────────────

async function generateKieZImage(prompt, outputPath, options = {}) {
  const apiKey = getEnvVar('KIE_API_KEY');
  if (!apiKey) throw new Error('KIE_API_KEY not configured');

  const aspectRatio = options.aspectRatio || options.aspect_ratio || '1:1';
  const model = options.model || 'z-image';

  // Step 1: Create task
  const createBody = JSON.stringify({
    model,
    input: {
      prompt,
      aspect_ratio: aspectRatio,
      nsfw_checker: true,
    },
  });

  console.log(`  🎨 Kie.ai ${model}: generating image (${aspectRatio})...`);

  const createResponse = await httpPost('api.kie.ai', '/api/v1/jobs/createTask', createBody, {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  });

  const createData = JSON.parse(createResponse);
  if (createData.code !== 200) {
    throw new Error(`Kie.ai createTask failed: ${createData.msg || JSON.stringify(createData)}`);
  }

  const taskId = createData.data.taskId;
  console.log(`  ⏳ Task created: ${taskId}`);

  // Step 2: Poll for result
  const maxWait = 120000; // 2 min
  const pollInterval = 3000; // 3s
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, pollInterval));

    const statusResponse = await httpGet('api.kie.ai', `/api/v1/jobs/getTask?taskId=${taskId}`, {
      'Authorization': `Bearer ${apiKey}`,
    });

    const statusData = JSON.parse(statusResponse);

    if (statusData.code !== 200) {
      throw new Error(`Kie.ai getTask failed: ${statusData.msg || JSON.stringify(statusData)}`);
    }

    const status = statusData.data?.status;

    if (status === 'completed' || status === 'success') {
      // Get the image URL from the result
      const output = statusData.data.output || statusData.data;
      const imageUrl = output.image_url || output.imageUrl
        || (output.images && output.images[0])
        || (output.results && output.results[0]?.url);

      if (!imageUrl) {
        throw new Error(`Kie.ai: task completed but no image URL found in response: ${JSON.stringify(statusData.data)}`);
      }

      await downloadFile(imageUrl, outputPath);
      console.log(`  ✅ Kie.ai Z-Image saved: ${outputPath}`);
      return { provider: 'kie-zimage', taskId, path: outputPath };
    }

    if (status === 'failed' || status === 'error') {
      throw new Error(`Kie.ai task failed: ${JSON.stringify(statusData.data)}`);
    }

    // Still processing, continue polling
  }

  throw new Error(`Kie.ai: task ${taskId} timed out after ${maxWait / 1000}s`);
}

// ── DALL-E 3 ────────────────────────────────────────────────────────────────

async function generateDalle(prompt, outputPath, options = {}) {
  const apiKey = getEnvVar('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const size = options.size || '1024x1024';
  const quality = options.quality || 'standard'; // 'standard' or 'hd'

  const body = JSON.stringify({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size,
    quality,
    response_format: 'url',
  });

  const response = await httpPost('api.openai.com', '/v1/images/generations', body, {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  });

  const data = JSON.parse(response);
  const imageUrl = data.data[0].url;
  const revisedPrompt = data.data[0].revised_prompt;

  await downloadFile(imageUrl, outputPath);
  console.log(`  ✅ DALL-E image saved: ${outputPath}`);
  return { provider: 'dalle', revisedPrompt, path: outputPath };
}

// ── Stability AI ────────────────────────────────────────────────────────────

async function generateStability(prompt, outputPath, options = {}) {
  const apiKey = getEnvVar('STABILITY_API_KEY');
  if (!apiKey) throw new Error('STABILITY_API_KEY not configured');

  const width = options.width || 1024;
  const height = options.height || 1024;

  const body = JSON.stringify({
    text_prompts: [{ text: prompt, weight: 1 }],
    cfg_scale: 7,
    height,
    width,
    samples: 1,
    steps: 30,
  });

  const response = await httpPost(
    'api.stability.ai',
    '/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    body,
    {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  );

  const data = JSON.parse(response);
  const base64Image = data.artifacts[0].base64;
  fs.writeFileSync(outputPath, Buffer.from(base64Image, 'base64'));
  console.log(`  ✅ Stability AI image saved: ${outputPath}`);
  return { provider: 'stability', path: outputPath };
}

// ── Unsplash ────────────────────────────────────────────────────────────────

async function fetchUnsplash(query, outputPath, options = {}) {
  const accessKey = getEnvVar('UNSPLASH_ACCESS_KEY');
  if (!accessKey) throw new Error('UNSPLASH_ACCESS_KEY not configured');

  const orientation = options.orientation || 'squarish'; // landscape, portrait, squarish
  const page = options.page || 1;

  const url = `/search/photos?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=1&page=${page}`;

  const response = await httpGet('api.unsplash.com', url, {
    'Authorization': `Client-ID ${accessKey}`,
  });

  const data = JSON.parse(response);
  if (!data.results || data.results.length === 0) {
    throw new Error(`No Unsplash results for: ${query}`);
  }

  const photo = data.results[0];
  const imageUrl = photo.urls.regular; // 1080px wide
  const attribution = `Photo by ${photo.user.name} on Unsplash`;

  await downloadFile(imageUrl, outputPath);
  console.log(`  ✅ Unsplash image saved: ${outputPath} (${attribution})`);
  return { provider: 'unsplash', attribution, photographer: photo.user.name, path: outputPath };
}

// ── Pexels ──────────────────────────────────────────────────────────────────

async function fetchPexels(query, outputPath, options = {}) {
  const apiKey = getEnvVar('PEXELS_API_KEY');
  if (!apiKey) throw new Error('PEXELS_API_KEY not configured');

  const orientation = options.orientation || 'square'; // landscape, portrait, square
  const size = options.size || 'medium'; // small, medium, large
  const page = options.page || 1;

  const url = `/v1/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=1&page=${page}`;

  const response = await httpGet('api.pexels.com', url, {
    'Authorization': apiKey,
  });

  const data = JSON.parse(response);
  if (!data.photos || data.photos.length === 0) {
    throw new Error(`No Pexels results for: ${query}`);
  }

  const photo = data.photos[0];
  const imageUrl = photo.src[size] || photo.src.original;

  await downloadFile(imageUrl, outputPath);
  console.log(`  ✅ Pexels image saved: ${outputPath}`);
  return { provider: 'pexels', photographer: photo.photographer, path: outputPath };
}

// ── Unified Interface ───────────────────────────────────────────────────────

async function generateImage(prompt, outputPath, options = {}) {
  const provider = options.provider || getBestProvider('image')?.id || 'kie-zimage';

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  switch (provider) {
    case 'kie-zimage': return generateKieZImage(prompt, outputPath, options);
    case 'dalle': return generateDalle(prompt, outputPath, options);
    case 'stability': return generateStability(prompt, outputPath, options);
    default: throw new Error(`Unknown image generation provider: ${provider}`);
  }
}

async function fetchStockImage(query, outputPath, options = {}) {
  const provider = options.provider || getBestProvider('image', true)?.id || 'unsplash';

  switch (provider) {
    case 'unsplash': return fetchUnsplash(query, outputPath, options);
    case 'pexels': return fetchPexels(query, outputPath, options);
    default: throw new Error(`Unknown stock image provider: ${provider}`);
  }
}

// ── HTTP Helpers ────────────────────────────────────────────────────────────

function httpGet(host, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request({ host, path, method: 'GET', headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        else resolve(data);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function httpPost(host, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      host, path, method: 'POST',
      headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        else resolve(data);
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    const protocol = url.startsWith('https') ? https : require('http');
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(res.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

module.exports = {
  generateImage,
  fetchStockImage,
  generateKieZImage,
  generateDalle,
  generateStability,
  fetchUnsplash,
  fetchPexels,
};
