/**
 * publish_now.js
 * Executes Instagram and YouTube publishing for test_job_payload_1_20260315.
 */

const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// ── Credentials ────────────────────────────────────────────────────────────────
const envData = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8');
const getEnv = (key) => {
  const match = envData.match(new RegExp(`^${key}=(.*)`, 'm'));
  return match ? match[1].trim() : null;
};

const IG_ACCOUNT_ID      = getEnv('INSTAGRAM_ACCOUNT_ID');
const IG_ACCESS_TOKEN    = getEnv('INSTAGRAM_ACCESS_TOKEN');
const THREADS_USER_ID      = getEnv('THREADS_USER_ID');
const THREADS_ACCESS_TOKEN = getEnv('THREADS_ACCESS_TOKEN');
const YT_CLIENT_ID       = getEnv('YOUTUBE_CLIENT_ID');
const YT_CLIENT_SECRET   = getEnv('YOUTUBE_CLIENT_SECRET');
const YT_REFRESH_TOKEN   = getEnv('YOUTUBE_REFRESH_TOKEN');

// ── Campaign data ──────────────────────────────────────────────────────────────
const CAMPAIGN_DIR = path.join(__dirname, '..', 'outputs', 'test_job_payload_1_20260315');
const PUBLISH_MD   = path.join(CAMPAIGN_DIR, 'Publish test_job_payload_1 2026-03-15.md');

const IG_IMAGE_URL = 'https://zpthrcqdcmueifnqyvgh.supabase.co/storage/v1/object/public/campaign-uploads/test_job_payload_1_20260315_instagram_ad_1773564616525.png';
const IG_CAPTION   = `Still dragging this morning? ☕

Cold brew delivers smooth energy without the bitterness or the crash — grab-and-go, no brewing required.

Upgrade Your Morning →

#ColdBrewCoffeeCo #ColdBrew #MorningFuel #BrewedDifferent #CoffeeCulture`;

const THREADS_POST = `Hot coffee in the morning is fine. Cold brew in the morning is a different kind of morning entirely.

No bitterness. No waiting. Just smooth energy from the first sip. ☕`;

const YT_VIDEO_PATH = path.join(CAMPAIGN_DIR, 'video', 'video_ad.mp4');
const YT_TITLE       = 'Upgrade Your Morning with Cold Brew Coffee | Cold Brew Coffee Co.';
const YT_DESCRIPTION = 'Discover why cold brew is becoming the go-to morning choice for busy professionals — smooth taste, zero bitterness, and clean energy with no crash. Ready-to-drink, no brewing required. Shop now at [link].';
const YT_TAGS        = ['cold brew coffee','morning routine','smooth coffee','ready to drink coffee','cold brew energy','no bitterness coffee','coffee for professionals','cold brew at home'];

// ── Helpers ────────────────────────────────────────────────────────────────────
function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.request(url, options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, body }); }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function postJson(url, payload, headers = {}) {
  const body = JSON.stringify(payload);
  return fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...headers },
    body,
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function updatePublishMd(platform, mediaId) {
  let md = fs.readFileSync(PUBLISH_MD, 'utf-8');
  md = md.replace(
    `- [ ] ${platform} — Ready to publish`,
    `- [x] ${platform} — Published (ID: ${mediaId})`
  );
  md = md.replace(
    '- [ ] Posts published (pending user approval — reference this file to trigger)',
    '- [x] Posts published'
  );
  fs.writeFileSync(PUBLISH_MD, md);
}

// ── Instagram ──────────────────────────────────────────────────────────────────
async function publishInstagram() {
  console.log('\n── Instagram ──────────────────────────────────────────────');

  // 1. Create container
  console.log('Creating media container…');
  const containerRes = await postJson(
    `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}/media`,
    { image_url: IG_IMAGE_URL, caption: IG_CAPTION },
    { Authorization: `Bearer ${IG_ACCESS_TOKEN}` }
  );

  if (!containerRes.body.id) {
    console.error('Container creation failed:', JSON.stringify(containerRes.body, null, 2));
    return null;
  }

  const containerId = containerRes.body.id;
  console.log(`Container created: ${containerId}`);

  // 2. Poll for FINISHED status
  for (let attempt = 1; attempt <= 5; attempt++) {
    console.log(`Checking container status (attempt ${attempt}/5)…`);
    const statusRes = await fetchJson(
      `https://graph.facebook.com/v25.0/${containerId}?fields=status_code&access_token=${IG_ACCESS_TOKEN}`
    );
    const status = statusRes.body.status_code;
    console.log(`  Status: ${status}`);
    if (status === 'FINISHED') break;
    if (status === 'ERROR') {
      console.error('Container status ERROR — aborting Instagram publish.');
      return null;
    }
    if (attempt === 5) {
      console.error('Container never reached FINISHED after 5 attempts.');
      return null;
    }
    await sleep(60000);
  }

  // 3. Publish container
  console.log('Publishing container…');
  const publishRes = await postJson(
    `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}/media_publish`,
    { creation_id: containerId },
    { Authorization: `Bearer ${IG_ACCESS_TOKEN}` }
  );

  if (!publishRes.body.id) {
    console.error('Publish failed:', JSON.stringify(publishRes.body, null, 2));
    return null;
  }

  const mediaId = publishRes.body.id;
  console.log(`✓ Instagram post published! Media ID: ${mediaId}`);
  return mediaId;
}

// ── Threads ────────────────────────────────────────────────────────────────────
async function publishThreads() {
  console.log('\n── Threads ─────────────────────────────────────────────────');

  // 1. Create container
  console.log('Creating Threads container…');
  const containerRes = await postJson(
    `https://graph.threads.net/v1.0/${THREADS_USER_ID}/threads`,
    { media_type: 'TEXT', text: THREADS_POST, access_token: THREADS_ACCESS_TOKEN }
  );

  if (!containerRes.body.id) {
    console.error('Container creation failed:', JSON.stringify(containerRes.body, null, 2));
    return null;
  }

  const containerId = containerRes.body.id;
  console.log(`Container created: ${containerId}`);

  // 2. Publish container
  console.log('Publishing container…');
  const publishRes = await postJson(
    `https://graph.threads.net/v1.0/${THREADS_USER_ID}/threads_publish`,
    { creation_id: containerId, access_token: THREADS_ACCESS_TOKEN }
  );

  if (!publishRes.body.id) {
    console.error('Publish failed:', JSON.stringify(publishRes.body, null, 2));
    return null;
  }

  const postId = publishRes.body.id;
  console.log(`✓ Threads post published! Post ID: ${postId}`);
  return postId;
}

// ── YouTube ────────────────────────────────────────────────────────────────────
async function getYouTubeAccessToken() {
  console.log('Refreshing YouTube access token…');
  const res = await postJson('https://oauth2.googleapis.com/token', {
    client_id:     YT_CLIENT_ID,
    client_secret: YT_CLIENT_SECRET,
    refresh_token: YT_REFRESH_TOKEN,
    grant_type:    'refresh_token',
  });

  if (!res.body.access_token) {
    throw new Error(`Token refresh failed: ${JSON.stringify(res.body)}`);
  }
  console.log('Access token obtained.');
  return res.body.access_token;
}

function uploadVideoMultipart(accessToken, videoPath) {
  return new Promise((resolve, reject) => {
    const videoBuffer = fs.readFileSync(videoPath);
    const metadata = JSON.stringify({
      snippet: {
        title:       YT_TITLE,
        description: YT_DESCRIPTION,
        tags:        YT_TAGS,
        categoryId:  '22', // People & Blogs
      },
      status: { privacyStatus: 'public' },
    });

    const BOUNDARY = '----FormBoundary' + Date.now();
    const metaPart = [
      `--${BOUNDARY}`,
      'Content-Type: application/json; charset=UTF-8',
      '',
      metadata,
      '',
    ].join('\r\n');
    const videoPart = `--${BOUNDARY}\r\nContent-Type: video/mp4\r\n\r\n`;
    const closing = `\r\n--${BOUNDARY}--\r\n`;

    const metaBuffer  = Buffer.from(metaPart, 'utf-8');
    const videoHeader = Buffer.from(videoPart, 'utf-8');
    const closeBuffer = Buffer.from(closing, 'utf-8');
    const body = Buffer.concat([metaBuffer, videoHeader, videoBuffer, closeBuffer]);

    const options = {
      method: 'POST',
      hostname: 'www.googleapis.com',
      path: '/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${BOUNDARY}`,
        'Content-Length': body.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function publishYouTube() {
  console.log('\n── YouTube ─────────────────────────────────────────────────');

  if (!fs.existsSync(YT_VIDEO_PATH)) {
    console.error(`Video file not found at ${YT_VIDEO_PATH}`);
    return null;
  }

  const accessToken = await getYouTubeAccessToken();

  console.log(`Uploading video (${(fs.statSync(YT_VIDEO_PATH).size / 1024 / 1024).toFixed(1)} MB)…`);
  const res = await uploadVideoMultipart(accessToken, YT_VIDEO_PATH);

  if (res.status !== 200 || !res.body.id) {
    console.error('YouTube upload failed:', JSON.stringify(res.body, null, 2));
    return null;
  }

  const videoId = res.body.id;
  console.log(`✓ YouTube video uploaded! Video ID: ${videoId}`);
  console.log(`  URL: https://www.youtube.com/watch?v=${videoId}`);
  return videoId;
}

// ── Main ───────────────────────────────────────────────────────────────────────
(async () => {
  console.log('=== Publishing: test_job_payload_1 (2026-03-15) ===');

  const igId     = await publishInstagram();
  const threadsId = await publishThreads();
  const ytId     = await publishYouTube();

  // Update Publish MD
  if (igId)      updatePublishMd('Instagram', igId);
  if (threadsId) updatePublishMd('Threads', threadsId);
  if (ytId)      updatePublishMd('YouTube', ytId);

  console.log('\n=== Summary ===');
  console.log(`Instagram : ${igId      ? `✓ ${igId}`                                      : '✗ Failed'}`);
  console.log(`Threads   : ${threadsId ? `✓ ${threadsId}`                                  : '✗ Failed'}`);
  console.log(`YouTube   : ${ytId      ? `✓ https://www.youtube.com/watch?v=${ytId}`       : '✗ Failed'}`);

  if (!igId || !threadsId || !ytId) process.exit(1);
})();
