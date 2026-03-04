import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';

const API_URL = 'https://api.arasaac.org/v1/pictograms/all/fr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, 'picto_fr.json');

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
  await writeFile(OUTPUT_PATH, rawBody, 'utf8');

  console.log(`Saved raw response to: ${OUTPUT_PATH}`);
  console.log(`Bytes written: ${Buffer.byteLength(rawBody, 'utf8')}`);
}

main().catch((error) => {
  console.error('Failed to fetch ARASAAC pictograms:', error);
  process.exitCode = 1;
});
