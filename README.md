# The Gentleman's Protocol Website

Static marketing site for The Gentleman's Protocol.

Production is live. For authoritative status and prioritized follow-ups, see [PROJECT_STATUS.md](PROJECT_STATUS.md). The detailed launch acceptance record is retained in [PRODUCTION_LAUNCH_CHECKLIST.md](PRODUCTION_LAUNCH_CHECKLIST.md).

Local credential locations and handling rules are documented in [SECRETS.md](SECRETS.md). No secret values belong in this repository.

## Requirements

- Node.js 20 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

In another terminal, serve the repository root with any static file server. The Tailwind watcher writes compiled CSS to `dist/styles.css`.

## Production build

```bash
npm run check
```

The production output is written to `_site/`. Configure Cloudflare Pages with:

- Build command: `npm run check`
- Output directory: `_site`
- Node version: 20 or newer

## Build configuration

Set these environment variables in Cloudflare Pages. See `.env.example`.

| Variable | Required for launch | Purpose |
|---|---:|---|
| `SITE_URL` | Yes | Canonical production origin, without trailing slash |
| `FORM_ENDPOINT` | Yes | HTTPS endpoint returning JSON `{ "success": true }` only after durable storage |
| `POSTHOG_KEY` | Yes for telemetry | Public PostHog project key |
| `POSTHOG_HOST` | Yes for telemetry | PostHog project host/region |
| `TURNSTILE_SITE_KEY` | Yes for spam protection | Public Cloudflare Turnstile site key |
| `PUBLIC_EMAIL` | Yes | Public fallback and privacy-contact email address |

Configure these server-side variables for the Pages Function:

| Variable | Required for launch | Purpose |
|---|---:|---|
| `LEAD_WEBHOOK_URL` | Yes | Founder-owned durable lead destination |
| `LEAD_WEBHOOK_TOKEN` | If supported | Bearer credential for the lead destination |
| `TURNSTILE_SECRET` | Yes | Server-side Turnstile verification secret |
| `TURNSTILE_HOSTNAMES` | Yes | Comma-separated hostnames accepted from Siteverify; production must not include local hostnames |
| `ALLOWED_ORIGINS` | For cross-origin staging | Comma-separated extra allowed origins |

The Turnstile secret and form-provider credentials belong only in the server-side form handler. Never expose them in browser configuration or commit them to Git.

## Form API contract

The form sends a JSON `POST` request. The endpoint must:

1. Validate required fields server-side.
2. Verify the Turnstile token server-side.
3. Apply rate limiting and duplicate protection.
4. Store the application durably.
5. Send the founder notification.
6. Return a 2xx JSON response containing `{ "success": true }` only after storage succeeds.
7. Return an appropriate non-2xx JSON error on failure.
8. Allow CORS requests only from the staging and production origins.

The founder-owned Google Apps Script source and its deployment instructions are in [`apps-script/`](apps-script/README.md).

## Privacy

Analytics uses explicit events, memory-only persistence, and no autocapture. Session replay is enabled across the site with all inputs masked and recorded URL query strings removed. Never add form values, names, email addresses, LinkedIn URLs, or free-text responses to analytics events or unmask form fields in replay.

The founder approved the launch-draft Privacy Policy and Terms on August 8, 2026. Obtain legal review as the business and data practices evolve.
