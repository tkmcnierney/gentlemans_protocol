import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root = path.resolve('_site');
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml'
};

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  if (pathname === '/api/inquiries' && request.method === 'POST') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ success: true }));
    return;
  }
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  const filename = path.resolve(root, relativePath);
  if (!filename.startsWith(root)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const details = await stat(filename);
    if (!details.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filename)] || 'application/octet-stream' });
    createReadStream(filename).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });

  await page.locator('#mobile-menu-btn').click();
  assert.equal(await page.locator('#mobile-menu-btn').getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('#mobile-menu').isVisible(), true);

  await page.locator('.faq-toggle').first().click();
  assert.equal(await page.locator('.faq-toggle').first().getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('.faq-content').first().isVisible(), true);

  await page.locator('#full_name').fill('Test Person');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#city').fill('New York, NY');
  await page.locator('#role_linkedin').fill('Founder');
  await page.locator('#btn-next-step').click();
  assert.equal(await page.locator('#form-step-2').isVisible(), true);

  await page.locator('#prompt_reason').fill('Testing the application experience.');
  await page.locator('#timeline').selectOption('Within 30 days');
  await page.locator('#btn-submit-form').click();
  await page.locator('#form-success-state').waitFor({ state: 'visible' });

  assert.deepEqual(errors, []);
  console.log('Browser interaction checks passed.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
