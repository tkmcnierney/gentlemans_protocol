import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  '_site/index.html',
  '_site/privacy.html',
  '_site/terms.html',
  '_site/robots.txt',
  '_site/sitemap.xml',
  '_site/dist/styles.css'
];

for (const filename of requiredFiles) await access(filename);
await access('functions/api/inquiries.js');
await import('../functions/api/inquiries.js');

const html = await readFile('_site/index.html', 'utf8');
const failures = [];

if (html.includes('cdn.tailwindcss.com')) failures.push('Tailwind browser CDN remains enabled');
if (!html.includes('dist/styles.css')) failures.push('Compiled stylesheet is missing');
if (!html.includes('form_submit_succeeded')) failures.push('Submission telemetry is missing');
if (!html.includes('privacy.html')) failures.push('Privacy link is missing');
if (!html.includes('terms.html')) failures.push('Terms link is missing');

const inlineScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter(match => !match[1].includes('application/ld+json'))
  .map(match => match[2])
  .filter(Boolean);

for (const [index, source] of inlineScripts.entries()) {
  try {
    new Function(source);
  } catch (error) {
    failures.push(`Inline script ${index + 1} does not parse: ${error.message}`);
  }
}

if (failures.length) {
  failures.forEach(failure => console.error(`FAIL: ${failure}`));
  process.exit(1);
}

console.log('Site checks passed.');
