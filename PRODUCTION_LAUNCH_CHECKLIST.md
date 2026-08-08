# Production Launch Checklist

> **Status: Production launch completed.** This document is retained as the detailed acceptance record. All unfinished work is consolidated in [PROJECT_STATUS.md](PROJECT_STATUS.md).

Last updated: August 8, 2026

Production site: [https://gentlemansprotocol.com](https://gentlemansprotocol.com)

The goal is to launch safely as fast as possible. Items are separated into launch-critical work and improvements that should not delay production.

## Current production status

- [x] Production site deployed on Cloudflare Pages
- [x] Apex and `www` domains active with HTTPS
- [x] Permanent `301` redirect from `www` to the apex domain
- [x] Redirects preserve paths and query parameters
- [x] Application backend waits for confirmed Google Apps Script success
- [x] Successful production application observed in the shared Google Sheet
- [x] Turnstile protects the form and rejects invalid tokens
- [x] PostHog analytics and masked session replay configured
- [x] Privacy Policy and Website Terms approved and published
- [x] Automated build, unit, browser, and live checks pass

## Launch-critical founder actions

These are the only remaining items that should be treated as launch-critical.

### 1. Test the complete production application journey

Owner: Founder

- [x] Open `https://gentlemansprotocol.com` in an incognito window
- [x] Submit one clearly labeled production test application
- [x] Confirm the page displays **Application received**
- [x] Confirm exactly one row appears in the shared Google Sheet
- [ ] Confirm the row contains the expected values
- [ ] Delete or label the test row after verification

Email notification delivery is not required for successful storage. Until Google Apps Script email permission is authorized, founders must monitor the Sheet directly.

### 2. Confirm PostHog production telemetry

Owner: Founder

- [x] Confirm the production visit and funnel events appear in PostHog
- [ ] Open the corresponding session replay
- [ ] Confirm names, emails, LinkedIn URLs, and application responses are masked
- [ ] Confirm campaign query strings are not exposed in replay

If masking fails, disable session replay until corrected. Event analytics can remain enabled.

### 3. Establish an application-monitoring routine

Owner: Founders

- [x] Both founders will check the shared Sheet directly during launch
- [x] Founders will coordinate responses from the shared Sheet
- [ ] Set an expected response time
- [x] Keep direct Sheet monitoring in place until notification email delivery is confirmed

## Email notification follow-up

Owner: Google Sheet / Apps Script deployment owner

This should be completed soon, but does not need to delay launch because applications are already stored successfully.

- [ ] Make a company-controlled Workspace account the long-term Sheet owner
- [ ] Ensure that account can manage the bound Apps Script deployment
- [ ] Copy `apps-script/Code.gs` into the bound Apps Script project
- [ ] Run `testNotificationEmail` and approve `MailApp`
- [ ] Confirm the test reaches `apply@gentlemansprotocol.com`
- [ ] Edit the existing web-app deployment
- [ ] Select **New version** and deploy without changing the `/exec` URL
- [ ] Submit another website application
- [ ] Confirm both the Sheet row and notification email arrive

## Technical SEO completed

- [x] Apex `.com` selected as the canonical hostname
- [x] `www` permanently redirects to the apex hostname
- [x] Canonical tags point to production URLs
- [x] Unique page titles, descriptions, and canonical URLs
- [x] Open Graph and Twitter metadata configured
- [x] Structured `ProfessionalService` data configured
- [x] `robots.txt` permits crawling and references the sitemap
- [x] Sitemap contains absolute, clean canonical production URLs
- [x] Sitemap includes current modification dates
- [x] No placeholder domains or visible pre-launch markers remain

## SEO immediately after launch

These items are valuable but should not hold up production.

### Google Search Console

Owner: Founder with development assistance

- [ ] Add a **Domain property** named `gentlemansprotocol.com`
- [ ] Copy the Google-provided DNS TXT verification value
- [ ] Give the TXT value to the development agent; it is not a secret
- [ ] Add the verification TXT record through Cloudflare
- [ ] Complete verification in Search Console
- [ ] Submit `https://gentlemansprotocol.com/sitemap.xml`
- [ ] Inspect and request indexing for the homepage
- [ ] Monitor indexing and crawl reports over the following days

### Social sharing asset

Owner: Development/design

- [ ] Create a branded 1200 x 630 social preview image
- [ ] Replace the current portrait `og:image`
- [ ] Add explicit image dimensions and alt text
- [ ] Test previews on LinkedIn, Slack, iMessage, and launch channels

### Performance and accessibility

Owner: Development

- [ ] Run a production mobile Core Web Vitals and accessibility audit
- [ ] Check LCP, CLS, INP, font loading, and image loading
- [ ] Fix high-impact issues and re-run the audit

### Stable Pages hostname

Owner: Development

- [ ] Optionally redirect `gentlemans-protocol.pages.dev` to the `.com`

The Pages hostname already publishes the `.com` canonical URL, so this is not a launch blocker. A forced redirect requires broader account-level Bulk Redirect permissions than the maintenance token currently has.

## Ongoing SEO growth

- [ ] Identify the phrases qualified customers actually use
- [ ] Publish focused pages or articles that answer those needs
- [ ] Add credible founder biographies and relevant credentials
- [ ] Earn legitimate mentions and links from publications, podcasts, communities, and partners
- [ ] Review Search Console queries and landing-page performance monthly
- [ ] Use PostHog funnel data to improve conversion without exposing applicant information
- [ ] Keep testimonials accurate and obtain publication permission

Do not buy unrelated domains for SEO. Redirected domains generally help only when they already have legitimate traffic or authority. Buy variants only for meaningful brand protection, common typing errors, or a planned shorter brand.

## Cloudflare credential follow-up

- [x] Long-standing Cloudflare token stored locally with restrictive permissions
- [x] Token restricted to the company account and domain
- [ ] After launch, reduce infrastructure Edit permissions to Read where practical
- [x] Revoke the older temporary Turnstile token
- [x] Delete `/home/lukasc/.config/gentlemans-protocol/secrets/cloudflare-turnstile-token` after revocation
- [ ] Keep `/home/lukasc/.config/gentlemans-protocol/secrets/cloudflare-launch-token` out of Git and rotate it if this machine is compromised

## Production launch decision

The website can be announced publicly once these three checks are complete:

1. One successful end-to-end production application
2. Confirmed PostHog events and replay masking
3. A founder assigned to monitor and respond through the Sheet

Everything else can be completed immediately after launch without delaying the announcement.
