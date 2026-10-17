// Frame the unmodified recorded comparison without cutting axis labels or context.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const [imageOutput, receiptOutput] = process.argv.slice(2);
assert.ok(imageOutput && receiptOutput, 'IMAGE_OUTPUT RECEIPT_OUTPUT');
const url = 'https://raw.githubusercontent.com/antonsoo/tonemirror/fe8c07dd7d5e9c7e38c5c2d40c44f6054cded5db/docs/assets/paired-listening/paired-listening.png';
const response = await fetch(url); assert.equal(response.status, 200);
const bytes = Buffer.from(await response.arrayBuffer());
const sha = data => createHash('sha256').update(data).digest('hex');
assert.equal(sha(bytes), 'd661c4cc7c63201f15c7eb155e0eb8505726a271241fa75271726249c164f2be');
const browser = await chromium.launch();
try {
 const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
 await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;background:#12121a}body{display:grid;place-items:center}img{display:block;width:1140px;height:690px}</style><img alt="Recorded rising and falling Mandarin examples in ToneMirror" src="data:image/png;base64,${bytes.toString('base64')}">`);
 await page.locator('img').evaluate(image => image.decode());
 await page.screenshot({ path: imageOutput });
 await writeFile(receiptOutput, JSON.stringify({ sourceUrl: url, sourceBytes: bytes.length, sourceSha256: sha(bytes), sourceDimensions: [1140,690], outputDimensions: [1200,750], operation: 'Unmodified source pixels centered with 30 pixels of background padding on each side. No curve, label or metric was redrawn. Final WebP encoding uses scripts/make_thumb.py.', licenseNotice: 'public/thumbs/ATTRIBUTION.txt' }, null, 2)+'\n');
} finally { await browser.close(); }
