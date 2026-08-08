# Project Status and Prioritized Follow-ups

> **Status:** Authoritative project tracker
>
> **Production launched:** August 8, 2026
>
> **Production URL:** [https://gentlemansprotocol.com](https://gentlemansprotocol.com)

This document is the single source of truth for current status and remaining work. Earlier launch plans are retained as historical planning records; unfinished work from them has been consolidated here.

## Production outcome

The website is live and can be announced publicly.

### Completed

- [x] Static production site deployed through Cloudflare Pages
- [x] Apex and `www` domains active with HTTPS
- [x] Permanent one-hop `301` from `www` to the apex domain
- [x] Canonical URLs, metadata, structured data, sitemap, and robots directives published
- [x] Privacy Policy and Website Terms approved and published
- [x] Production application submitted successfully
- [x] Application received exactly once in the shared Google Sheet
- [x] Frontend waits for confirmed backend storage before displaying success
- [x] Turnstile server-side validation enabled
- [x] Invalid Turnstile tokens rejected
- [x] PostHog production funnel events received through `form_submit_succeeded`
- [x] Session replay configured with `maskAllInputs: true` and query-string stripping
- [x] Founders agreed to monitor the Sheet directly until email notifications work
- [x] Long-standing Cloudflare and PostHog credentials stored outside Git with restrictive permissions
- [x] Automated build, unit, browser, and live deployment checks pass

## Remaining work by priority

None of the following items blocks announcing the current website. Priorities reflect operational risk and expected business value.

## P0 — Secure and preserve production

Complete as soon as possible.

### Commit and back up the production code

Owner: Development and repository owner

- [x] Review the current working tree
- [x] Commit the production launch implementation
- [x] Push `main` to `git@github.com:tkmcnierney/gentlemans_protocol.git`
- [x] Confirm the company retains access to the GitHub repository
- [ ] Decide whether to connect Cloudflare Pages to GitHub for automatic production deployments

The live deployment currently contains code that is not committed to Git. Cloudflare is serving it, but GitHub is not yet a reliable recovery source.

### Finish session-replay privacy verification

Owner: Development

- [ ] Wait for PostHog to expose the successful launch-test recording
- [ ] Inspect the recording without copying applicant information into logs or chat
- [ ] Confirm names, emails, LinkedIn URLs, and free-text answers are masked
- [ ] Confirm campaign query strings do not appear in replay network metadata
- [ ] Disable replay immediately if masking fails; event analytics may remain enabled

Production funnel events are verified. The exact launch-test recording remained in PostHog's lazy-loading state during the launch audit.

### Retire the temporary Turnstile credential

Owner: Cloudflare account owner

- [x] Revoke the older temporary Turnstile API token in Cloudflare
- [x] Delete `/home/lukasc/.config/gentlemans-protocol/secrets/cloudflare-turnstile-token` after revocation
- [ ] Retain the scoped long-standing Cloudflare maintenance token

### Clean up the production test

Owner: Founder

- [x] Founders accept retaining the production test row; no cleanup required

## P1 — Make launch operations reliable

Target: next one to three business days.

### Enable application notification emails

Owner: Google Sheet / Apps Script deployment owner

- [ ] Make a company-controlled Workspace account the long-term Sheet owner
- [ ] Ensure that account can manage the bound Apps Script deployment
- [ ] Copy `apps-script/Code.gs` into the bound Apps Script project
- [ ] Run `testNotificationEmail` and approve the `MailApp` permission
- [ ] Confirm the test reaches `apply@gentlemansprotocol.com`
- [ ] Edit the existing web-app deployment and select **New version**
- [ ] Deploy without changing the existing `/exec` URL
- [ ] Submit a website test and confirm both the Sheet row and email arrive

Until this is complete, both founders will monitor the Sheet directly.

### Define the lead-response process

Owner: Founders

- [ ] Choose a response-time target, such as one business day
- [ ] Decide who owns the first reply when both founders see a lead
- [ ] Record lead status and outcome consistently in the Sheet

### Add DMARC for business email

Owner: Google Workspace and Cloudflare account owner

- [x] SPF record published
- [x] Google DKIM record published
- [ ] Publish a Google Workspace-compatible DMARC record, initially using a monitoring policy
- [ ] Confirm legitimate mail continues to pass SPF, DKIM, and DMARC
- [ ] Strengthen the policy after reviewing reports

### Establish repeatable deployments

Owner: Development and repository owner

- [ ] Choose GitHub-triggered Cloudflare deployments or document direct-upload ownership
- [ ] Protect production secrets from preview environments where appropriate
- [ ] Document a rollback procedure using a known-good Pages deployment
- [ ] Run the full check suite before every production deployment

### Register the site with search engines

Owner: Founder with development assistance

- [ ] Add the `gentlemansprotocol.com` Domain property in Google Search Console
- [ ] Add the Google-provided verification TXT record through Cloudflare
- [ ] Submit `https://gentlemansprotocol.com/sitemap.xml`
- [ ] Inspect and request indexing for the homepage
- [ ] Monitor coverage and crawl reports after discovery
- [ ] Optionally import the property into Bing Webmaster Tools

### Create the social-sharing image

Owner: Development/design

- [ ] Create a branded 1200 x 630 image
- [ ] Replace the current portrait `og:image`
- [ ] Publish explicit image dimensions and alt text
- [ ] Test LinkedIn, Slack, iMessage, and other launch-channel previews

### Run the production performance audit

Owner: Development

- [ ] Enable the Chrome DevTools MCP connection
- [ ] Measure mobile LCP, CLS, INP, network chains, and accessibility
- [ ] Fix high-impact findings
- [ ] Re-run the audit and record final results

## P2 — Instrument and optimize growth

Target: first two weeks after launch.

### Build the PostHog operating dashboard

Owner: Development/growth

- [ ] Create a landing-page funnel from visit through successful submission
- [ ] Track form validation and field-reach drop-off
- [ ] Add acquisition breakdowns for source, medium, campaign, and referrer category
- [ ] Add Web Vitals monitoring
- [ ] Exclude labeled founder/test traffic where practical
- [ ] Agree on a weekly review cadence

### Improve organic discoverability

Owner: Founders and development

- [ ] Research the phrases qualified customers actually use
- [ ] Publish focused pages or articles that answer those needs
- [ ] Strengthen founder biographies and evidence of relevant experience
- [ ] Earn legitimate mentions and links from publications, podcasts, communities, and partners
- [ ] Review Search Console queries and landing-page performance monthly
- [ ] Keep testimonials accurate and retain publication permission

### Optional infrastructure cleanup

Owner: Development

- [ ] Optionally redirect `gentlemans-protocol.pages.dev` to the `.com`
- [ ] Reduce long-standing Cloudflare Edit permissions to Read where routine mutation is unnecessary
- [ ] Review PostHog personal-token use and rotate it if the owning user leaves
- [ ] Review all local credential last-used dates quarterly

The stable Pages hostname already publishes the `.com` canonical URL, so its redirect is not urgent.

## Document inventory

| Document | Status | Purpose |
| --- | --- | --- |
| `PROJECT_STATUS.md` | **Active — authoritative** | Current completion state and consolidated prioritized backlog |
| `README.md` | **Active** | Developer setup, build, deployment, API contract, and project entry point |
| `SECRETS.md` | **Active** | Local credential locations and safe handling rules |
| `apps-script/README.md` | **Active runbook** | Pending Apps Script email-notification deployment procedure |
| `PRODUCTION_LAUNCH_CHECKLIST.md` | **Completed launch record** | Detailed production acceptance history; outstanding work moved here |
| `LAUNCH_PLAN.md` | **Archived** | Original end-to-end launch strategy |
| `DEV_LAUNCH_PLAN.md` | **Archived** | Original engineering implementation plan |
| `FOUNDER_LAUNCH_ACTIONS.md` | **Archived** | Original founder accounts, domain, and launch-action plan |

## Status rules

- New unfinished production or business work belongs in this document.
- Technical operating instructions belong in `README.md`, `SECRETS.md`, or the relevant component runbook.
- Archived plans should not receive new checklist items.
- Completed items remain checked to preserve a clear operational history.
