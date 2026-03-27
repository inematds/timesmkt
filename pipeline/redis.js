const fs = require('fs');
const path = require('path');

// Read a variable from .env manually — no dotenv dependency
function getEnvVar(key) {
  const envPath = path.resolve(__dirname, '../.env');
  const envData = fs.readFileSync(envPath, 'utf-8');
  const match = envData.match(new RegExp(`^${key}=(.*)`, 'm'));
  return match ? match[1].trim() : null;
}

// Redis connection config for BullMQ (ioredis-compatible format)
// Supports both local Redis and Upstash (remote with TLS)
const redisEndpoint = getEnvVar('UPSTASH_REDIS_ENDPOINT') || 'localhost';
const redisPassword = getEnvVar('UPSTASH_REDIS_PASSWORD');
const isLocal = redisEndpoint === 'localhost' || redisEndpoint === '127.0.0.1';

const redisConnection = {
  host: redisEndpoint,
  port: 6379,
  ...(redisPassword && { password: redisPassword }),
  ...(!isLocal && { tls: {} }),
};

module.exports = { redisConnection };
