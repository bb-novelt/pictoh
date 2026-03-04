import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';

const API_URL = 'https://api.arasaac.org/v1/pictograms/all/fr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, 'picto_fr_sample.json');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      const statusCode = res.statusCode ?? 0;

      if (statusCode < 200 || statusCode >= 300) {
        res.resume();
        reject(new Error(`HTTP ${statusCode} ${res.statusMessage ?? ''}`.trim()));
        return;
      }

      res.setEncoding('utf8');
      let raw = '';
      res.on('data', (chunk) => {
        raw += chunk;
      });
      res.on('end', () => resolve(raw));
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('Request timeout after 30s'));
    });
  });
}

async function main() {
  console.log(`Fetching: ${API_URL}`);

  const rawBody = await httpGet(API_URL);
  const first1000Chars = rawBody.slice(0, 10000);

  await writeFile(OUTPUT_PATH, first1000Chars, 'utf8');

  console.log(`Saved first 1000 characters to: ${OUTPUT_PATH}`);
  console.log(`Characters written: ${first1000Chars.length}`);
}

main().catch((error) => {
  console.error('Failed to fetch ARASAAC pictograms (first 1000 characters):', error);
  process.exitCode = 1;
});
