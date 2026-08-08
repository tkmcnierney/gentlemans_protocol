import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = '_site';
const siteUrl = (process.env.SITE_URL || 'https://gentlemansprotocol.com').replace(/\/$/, '');
const replacements = new Map([
  ['https://gentlemansprotocol.com', siteUrl],
  ['hello@gentlemansprotocol.com', process.env.PUBLIC_EMAIL || 'hello@gentlemansprotocol.com'],
  ['content="/api/inquiries" data-config="form-endpoint"', `content="${escapeAttribute(process.env.FORM_ENDPOINT || '/api/inquiries')}" data-config="form-endpoint"`],
  ['content="phc_BkSnjeUJmDquhinEcop7xc7qqk9PHBikP6ba75TuATwb" data-config="posthog-key"', `content="${escapeAttribute(process.env.POSTHOG_KEY || 'phc_BkSnjeUJmDquhinEcop7xc7qqk9PHBikP6ba75TuATwb')}" data-config="posthog-key"`],
  ['content="https://us.i.posthog.com" data-config="posthog-host"', `content="${escapeAttribute(process.env.POSTHOG_HOST || 'https://us.i.posthog.com')}" data-config="posthog-host"`],
  ['content="0x4AAAAAAEKVaMWc9mDr_0Sw" data-config="turnstile-site-key"', `content="${escapeAttribute(process.env.TURNSTILE_SITE_KEY || '0x4AAAAAAEKVaMWc9mDr_0Sw')}" data-config="turnstile-site-key"`]
]);

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

async function renderFile(source, destination) {
  let contents = await readFile(source, 'utf8');
  for (const [search, replacement] of replacements) {
    contents = contents.replaceAll(search, replacement);
  }
  await writeFile(destination, contents);
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(path.join(outputDirectory, 'dist'), { recursive: true });
await mkdir(path.join(outputDirectory, 'assets'), { recursive: true });
const assetsToPublish = [
  'lukas-after.webp',
  'lukas-before.webp',
  'lukas-coach.webp',
  'lukas-hero.webp',
  'tyler-coach.webp',
  'tyler-hero.webp',
  'tyler-hero.jpg'
];
for (const filename of assetsToPublish) {
  await cp(path.join('assets', filename), path.join(outputDirectory, 'assets', filename));
}
await cp('dist/styles.css', path.join(outputDirectory, 'dist/styles.css'));

for (const filename of ['index.html', 'privacy.html', 'terms.html', 'robots.txt', 'sitemap.xml']) {
  await renderFile(filename, path.join(outputDirectory, filename));
}

for (const filename of ['_headers', '_redirects']) {
  await cp(filename, path.join(outputDirectory, filename));
}

console.log(`Built ${outputDirectory} for ${siteUrl}`);
