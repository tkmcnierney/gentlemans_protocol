# Founder Launch Actions and Accounts

> **Status: Archived.** The domain, business accounts, Cloudflare, analytics, and production launch were completed. Current founder actions are tracked in [PROJECT_STATUS.md](PROJECT_STATUS.md).

Owner: Lukas
Goal: Own every business account and supply the decisions/configuration needed for the developer launch track.

## Founder progress audit — August 8, 2026

Legend: `[x]` completed here, `[~]` partially complete or awaiting confirmation, `[ ]` not completed here.

### Completed here

- [x] Created and secured the founder-owned Cloudflare account with 2FA and recovery codes.
- [x] Purchased `gentlemansprotocol.com` through Cloudflare Registrar.
- [x] Pointed the domain to Cloudflare nameservers.
- [x] Created Google Workspace with `lukas@gentlemansprotocol.com` as the first administrator.
- [x] Activated Gmail and verified external send/receive delivery.
- [x] Secured the Google Workspace administrator with 2FA and stored backup codes in LastPass.
- [x] Created and tested `hello@gentlemansprotocol.com` for public inquiries.
- [x] Created and tested `apply@gentlemansprotocol.com` for application notifications.
- [x] Selected the existing founder-shared Google Sheet/Apps Script as the lead destination.
- [x] Created the founder-owned PostHog US Cloud project, selected the Free plan, and supplied the public project key and US host to the deployment agent.
- [x] Enabled PostHog onboarding for autocapture, heatmaps, web vitals, and session replay; the application form remains subject to masking/exclusion requirements in deployment.
- [x] Invited Tyler to PostHog as an organization member.
- [x] Created the founder-owned managed Turnstile widget and supplied its public site key and secret through the deployment workflow.
- [x] Added a least-privilege account-access plan for Tyler covering Cloudflare, GitHub, PostHog, Google, Search Console, and the password manager.

### Partially complete or awaiting confirmation

- [~] Confirm Cloudflare Registrar auto-renew is enabled.
- [~] Confirm the original failed domain charge has been refunded.
- [~] Revoke the temporary `Turnstile setup` Cloudflare API token after the deployment agent finishes validation.
- [~] SPF and DKIM are published; DMARC is not yet published.
- [~] Confirm the existing lead Sheet contains the required statuses, attribution fields, owners, and follow-up dates.
- [~] Define in writing what counts as a qualified lead.
- [~] Deployment agent must add the exact staging hostname to Turnstile and complete real-token/replay validation.
- [~] Deployment agent must verify a staging submission is durably stored and notifies `apply@gentlemansprotocol.com`.
- [~] Tyler's required access is documented, but Cloudflare/GitHub/Google permissions still need to be granted and tested where not already present.

### Not completed here

- [ ] Add DMARC, beginning with a monitoring policy.
- [ ] Decide whether Tyler needs a paid `tyler@gentlemansprotocol.com` Workspace inbox.
- [ ] Supply and approve all business/legal inputs.
- [ ] Complete the claims, testimonial, photograph, biography, and permissions review.
- [ ] Create Google Search Console after the production domain is live.
- [ ] Perform the founder staging and production pre-launch tests.
- [ ] Optionally create a sanitized PostHog outcomes Sheet after lead volume makes downstream conversion reporting useful.

## Do these first

These are the only immediate founder actions. Development can proceed in parallel.

1. Choose and purchase the domain.
2. Create the Cloudflare account that will own the domain, DNS, Turnstile, and Pages project.
3. Create the business email account.
4. Decide where application submissions will be stored.
5. Create the analytics account/project.
6. Supply the business and legal information listed below.
7. Confirm that all public claims, testimonials, and images are approved.

## 1. Domain selection and purchase

Create a shortlist of three to five domains. Prefer:

- An available `.com`
- Easy pronunciation and spelling
- No hyphens or numbers
- No trademark conflict
- A reasonable standard registration and renewal price

Check both the first-year and renewal price. Avoid paying for unnecessary registrar add-ons. Purchase the selected domain through the founder-owned Cloudflare account and enable auto-renew.

Recommended canonical format: the root domain, such as `gentlemansprotocol.com`, with `www` redirecting to it.

Founder output for developer:

- Final domain name
- Confirmation that registration is complete
- Preferred root or `www` canonical format if different from the recommendation

## 2. Cloudflare account

Create one founder-owned Cloudflare account and:

- Use a durable founder-controlled email address.
- Enable two-factor authentication.
- Save recovery codes in the business password manager.
- Add a current payment method for domain renewal.
- Verify the registrant email when requested.
- Keep auto-renew enabled.

The account will own:

- Domain registration
- DNS
- Cloudflare Pages
- HTTPS configuration
- Turnstile spam protection

Do not send the primary password or recovery codes to a developer. Grant scoped account/project access when collaboration is needed.

## 3. Business email

Create Google Workspace under the founder-owned account.

Decide:

- Primary inbox, for example `lukas@domain.com`
- Public address, for example `hello@domain.com` or `apply@domain.com`
- Whether Tyler needs a separate paid inbox
- Who receives inquiry notifications

Public addresses can often be aliases or groups rather than additional paid users.

Configure or approve configuration of:

- MX records
- SPF
- DKIM
- DMARC

Founder output for developer:

- Public contact address
- Lead-notification recipient address or addresses

## 4. Lead destination and workflow

Choose where applications will be stored. Fastest initial choice: a founder-owned Google Sheet associated with the business Workspace account.

Define these columns/statuses:

- Anonymous lead ID
- Submission timestamp
- Contact/application fields
- UTM source, medium, campaign, and landing referrer
- Lead status
- Qualified: yes/no
- Call booked: yes/no
- Client acquired: yes/no
- Follow-up owner
- Follow-up date

Recommended status values:

- New
- Contacted
- Qualified
- Call booked
- Not a fit
- Won
- Lost

Restrict sheet access to the founders and anyone who genuinely handles applications.

Founder output for developer:

- Selected destination: Google Sheets, Airtable, CRM, or form service
- Required account/project access or integration instructions
- Notification recipients
- Definition of a qualified lead

### PostHog outcome sync

Keep the raw application Sheet as the private system of record. Create a separate sanitized outcomes Sheet for PostHog so funnel reporting can extend beyond submission to qualification, booking, and acquisition.

The sanitized Sheet may contain only:

- Anonymous lead ID
- Submission timestamp
- Lead status
- Qualified: yes/no
- Call booked: yes/no
- Client acquired: yes/no
- UTM source, medium, and campaign when needed for attribution

Do not copy names, email addresses, phone numbers, LinkedIn URLs, cities, free-text application responses, or other identifying application fields into the PostHog-connected Sheet.

The website's explicit events and masked session replay measure where applicants abandon the form. The sanitized outcomes Sheet supplies the downstream funnel:

`Submission -> Qualified -> Call booked -> Client acquired`

## 5. Analytics account

Create a founder-owned PostHog account and project.

Initial privacy settings:

- Session replay on, with all inputs masked and URL query strings removed
- Autocapture on for general site interactions, with the entire application form excluded
- Heatmaps and web-vitals capture on
- Keep the explicit funnel events as the authoritative conversion taxonomy
- Do not capture form values or text inputs
- Do not identify visitors using names or email addresses

Founder output for developer:

- Project key
- PostHog host/region
- Scoped project access if dashboard configuration is requested

The project key is intended for client-side use, but account passwords and personal API keys must remain private.

## 6. Turnstile spam protection

In the founder-owned Cloudflare account, create a Turnstile widget for:

- The temporary staging hostname
- The final production domain

Founder output for developer:

- Site key
- Secret supplied through a secure environment-variable channel

Never commit the Turnstile secret to Git.

## 7. Business and legal inputs

Supply or confirm:

- Legal business or individual operator name
- Public brand name
- Business jurisdiction/state
- Public contact email
- Mailing address if counsel determines it should be published
- Types of personal information collected
- Where applications are stored
- Who can access applications
- Data retention preference
- How applicants can request access or deletion
- Effective date for the policies
- Whether any advertising pixels will be used at launch
- Whether services are restricted to adults aged 18 or older

The developer can integrate policy copy, but the founder should obtain legal advice if legal certainty is required. A developer is not a substitute for counsel.

## 8. Content and permissions review

Confirm in writing that:

- Every testimonial is genuine and accurately represented.
- Testimonial publication is authorized.
- Every published photograph is owned or licensed for business use.
- The before/after subject approves this use.
- The `50,000+ followers` statement is current or appropriately qualified.
- Founder titles, biographies, cities, and experience claims are accurate.
- The promised 24–48-hour response time can be met.
- Program duration, deliverables, and availability statements are accurate.

Send corrections to the developer before production launch.

## 9. Accounts checklist

| Account | Founder owns it | 2FA | Purpose |
|---|---:|---:|---|
| Cloudflare | Required | Required | Domain, DNS, hosting, Turnstile |
| Google Workspace | Required | Required | Business email and potentially lead storage |
| PostHog | Required | Required | Funnel analytics |
| GitHub/Git provider | Required | Required | Source repository and deployment connection |
| Lead/form provider, if used | Required | Required | Application delivery |
| Google Search Console | Required | Required | Search indexing and monitoring |
| Password manager | Required | Required | Credentials and recovery codes |

Use founder-controlled business emails wherever possible. Do not let a contractor become the sole owner of any account.

## 9a. Tyler deployment access

Give Tyler his own login to each service required for development and deployment. Never share Lukas's password, 2FA device, recovery codes, personal API keys, or primary account session.

### Cloudflare

From **Manage Account -> Members**, invite Tyler's Cloudflare user and grant only the roles needed to deploy and operate the website:

- `Workers Platform Admin` at the account scope for Workers/Pages deployments and project environment configuration
- `Domain DNS` scoped to `gentlemansprotocol.com` when he must configure the root domain, `www`, or email/domain records
- `Turnstile` at the account scope while he configures or validates the application widget

Do not grant `Super Administrator`, billing access, registrar/domain-transfer authority, or permission to manage account members unless the founders explicitly decide to share full ownership. Require 2FA on Tyler's Cloudflare account. Review and reduce temporary permissions after launch.

### GitHub

- Give Tyler a separate GitHub account with 2FA.
- Grant write/maintain access to the website repository and permission to merge/deploy the production branch.
- Keep at least two founders able to administer or recover the repository.
- Use the Cloudflare Pages GitHub integration instead of sharing personal GitHub credentials or long-lived tokens.

### PostHog

- Invite Tyler as an organization `Member` so he can inspect funnels, heatmaps, web vitals, and masked session replays.
- Keep billing and organization administration with Lukas unless both founders decide otherwise.
- Do not create or share a personal API key for browser analytics.

### Google Workspace, Sheets, and Apps Script

- Share the application Sheet with Tyler as an editor only if he handles applications or maintains the integration.
- Grant access to the associated Apps Script project if he must update or deploy the webhook.
- Do not make Tyler a Google Workspace super administrator merely to deploy the website.
- If Tyler later receives `tyler@gentlemansprotocol.com`, secure it with 2FA and replace his personal address in business groups and service invitations.

### Search Console and password manager

- Add Tyler to Google Search Console after the production property is created if he will submit sitemaps or investigate indexing.
- Share only the deployment secrets Tyler needs through a restricted business password-manager vault.
- Do not place passwords, Turnstile secrets, webhook tokens, recovery codes, or personal API keys in Git, chat, email, or documentation.

Founder acceptance check: Tyler can deploy a preview, update the Pages environment configuration, inspect deployment logs, and promote an approved build without using Lukas's login or receiving billing, registrar-transfer, or member-management privileges.

## 10. Founder pre-launch test

Before announcing the site:

- Open it on a real iPhone and Android device.
- Read the entire page as a prospect.
- Submit one real test application.
- Confirm the saved application is complete.
- Confirm the notification arrives.
- Confirm the public email address works.
- Confirm Privacy and Terms pages are understandable.
- Confirm the domain and `www` redirect correctly.
- Confirm there are no browser HTTPS warnings.
- Share the URL in a private message and confirm the social preview looks professional.

## Fast founder schedule

### Today

- Purchase domain.
- Create Cloudflare account.
- Create or begin Google Workspace setup.
- Choose public email and notification recipients.
- Choose Google Sheets or another lead destination.
- Create PostHog project.

### While development proceeds

- Provide business/legal inputs.
- Review claims and permissions.
- Create Turnstile widget when the staging hostname is available.
- Review the staging site.

### Launch day

- Approve final copy and policies.
- Perform the founder pre-launch test.
- Verify the first real production application.
- Begin responding to leads and updating their outcomes.
