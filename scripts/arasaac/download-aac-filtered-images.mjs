#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = '/home/bb/pictoh';
const inputPath = path.join(
  repoRoot,
  'scripts/arasaac/picto_fr_aac_true_violence_false_sex_false_all_keywords.json'
);
const outputDir = path.join(repoRoot, 'public/assets/pictures');
const apiBase = 'https://api.arasaac.org/v1/pictograms';
const extension = '.png';
const separator = '__';

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function buildFileName(id, keywords) {
  const normalizedKeywords = Array.isArray(keywords)
    ? [...new Set(keywords.map((k) => slugify(k)).filter(Boolean))]
    : [];

  const keywordsPart = normalizedKeywords.length > 0 ? normalizedKeywords.join(separator) : 'no-keyword';
  return `${id}${separator}${keywordsPart}${extension}`;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readInput() {
  const raw = await fs.readFile(inputPath, 'utf-8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Input JSON must be an array: ${inputPath}`);
  }
  return parsed;
}

async function downloadOne(id, filePath) {
  const url = `${apiBase}/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  await fs.writeFile(filePath, bytes);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const entries = await readInput();
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of entries) {
    const id = entry?._id;
    const keywords = entry?.keywords;

    if (typeof id !== 'number' && typeof id !== 'string') {
      failed += 1;
      console.error('[invalid]', 'Missing _id in entry:', entry);
      continue;
    }

    const fileName = buildFileName(id, keywords);
    const filePath = path.join(outputDir, fileName);

    if (await exists(filePath)) {
      skipped += 1;
      continue;
    }

    try {
      await downloadOne(id, filePath);
      downloaded += 1;
      console.log('[ok]', fileName);
    } catch (error) {
      failed += 1;
      console.error('[error]', `id=${id}`, error.message);
    }
  }

  console.log('\nDone');
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output dir: ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
