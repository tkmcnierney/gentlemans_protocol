import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const liveUrl = process.env.LIVE_URL;
if (!liveUrl) throw new Error('LIVE_URL is required');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));

try {
  await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.locator('#full_name').fill('LAUNCH TEST - DELETE');
  await page.locator('#email').fill('hello@gentlemansprotocol.com');
  await page.locator('#city').fill('Deployment test');
  await page.locator('#role_linkedin').fill('Turnstile launch validation');
  await page.locator('#btn-next-step').click();
  await page.locator('#prompt_reason').fill('Automated live Turnstile test. This row can be deleted.');
  await page.locator('#timeline').selectOption('Just exploring');

  const responseField = page.locator('input[name="cf-turnstile-response"]');
  await responseField.waitFor({ state: 'attached', timeout: 30_000 });
  await page.waitForFunction(() => {
    const field = document.querySelector('input[name="cf-turnstile-response"]');
    return field?.value?.length > 20;
  }, { timeout: 30_000 });
  const token = await responseField.inputValue();

  await page.locator('#btn-submit-form').click();
  await page.locator('#form-success-state').waitFor({ state: 'visible', timeout: 30_000 });

  const replayResponse = await page.request.post(new URL('/api/inquiries', liveUrl).toString(), {
    data: {
      lead_id: 'turnstile-replay-test',
      full_name: 'Replay Test',
      email: 'hello@gentlemansprotocol.com',
      city: 'Test',
      role_linkedin: 'Test',
      prompt_reason: 'Replay-token rejection test',
      timeline: 'Just exploring',
      turnstile_token: token
    }
  });
  assert.equal(replayResponse.status(), 400);
  assert.equal((await replayResponse.json()).error, 'verification_failed');
  assert.deepEqual(pageErrors, []);
  console.log('Live form succeeded and replayed Turnstile token was rejected.');
} finally {
  await browser.close();
}
