# Developer Launch Plan

> **Status: Archived.** The production implementation is complete. Current development follow-ups are tracked in [PROJECT_STATUS.md](PROJECT_STATUS.md).

Owner: Codex/developer
Goal: Prepare, instrument, test, and deploy the website while the founder creates and owns all external accounts.

## Working assumptions

- The site remains static and is deployed on Cloudflare Pages.
- The founder owns Cloudflare, domain, email, analytics, and form-service accounts.
- PostHog is the initial funnel analytics platform.
- Session replay is enabled with all form inputs masked; broad autocapture remains disabled.
- Analytics never receives form values or personally identifiable information.
- Development begins on a temporary staging URL and does not wait for the final domain.

## Phase 1: Repository and staging readiness

- Create a production-friendly project structure.
- Replace the Tailwind browser CDN with compiled, versioned CSS.
- Preserve the current design and behavior.
- Add repeatable local build and preview commands.
- Add deployment configuration for Cloudflare Pages.
- Add an environment/configuration mechanism for the production domain, form endpoint, analytics key, and Turnstile key.
- Ensure secrets are never committed to Git.
- Add a useful `README.md` with development and deployment instructions.

Deliverable: a reproducible production build that can be deployed to a temporary Pages URL.

## Phase 2: Privacy, performance, and production hardening

- Strip EXIF and GPS metadata from all published images.
- Resize oversized images and generate WebP or AVIF derivatives.
- Add explicit dimensions and lazy loading where appropriate.
- Add a meta description, canonical URL configuration, Open Graph metadata, social preview image, favicon, and Apple touch icon.
- Add structured business data.
- Add `robots.txt` and `sitemap.xml`.
- Add security headers appropriate for the external services in use.
- Add accessible state to the mobile menu and FAQ controls.
- Improve keyboard focus and reduced-motion behavior.
- Fix any responsive or browser-specific issues discovered during testing.

Deliverable: fast, accessible, search-ready production pages with sanitized assets.

## Phase 3: Lead form

- Replace or harden the current Google Apps Script submission flow.
- Require a verifiable server response before displaying success.
- Display an actionable failure message and retry option.
- Prevent repeated submissions while a request is in progress.
- Generate an anonymous lead ID for submission reconciliation.
- Add submission timestamps and acquisition attribution.
- Add founder notification support.
- Add honeypot and Cloudflare Turnstile protection.
- Add a branded fallback contact email supplied by the founder.
- Add a form privacy disclosure linking to the Privacy Policy.
- Ensure form responses never enter analytics.

Deliverable: tested lead storage, notification, error handling, retry behavior, and spam protection.

## Phase 4: Funnel telemetry

Implement explicit events:

| Event | Safe properties |
|---|---|
| `landing_page_viewed` | UTM source, campaign, referrer category, device category |
| `meaningful_visit` | Engagement threshold reached |
| `section_viewed` | Section identifier |
| `cta_clicked` | CTA location |
| `faq_opened` | FAQ identifier |
| `before_after_used` | Selected state |
| `form_viewed` | Entry CTA location |
| `form_started` | Time to first interaction |
| `form_field_reached` | Field identifier only, never its value |
| `form_validation_error` | Field identifier and safe error category |
| `form_step_1_completed` | Elapsed time |
| `form_step_2_viewed` | Elapsed time from start |
| `form_back_clicked` | Current step |
| `form_submit_attempted` | Anonymous lead/session ID |
| `form_submit_failed` | Safe technical error category |
| `form_submit_succeeded` | Anonymous lead ID |

Implementation requirements:

- Enable session replay across the site with all inputs masked and URL query strings removed.
- Disable broad autocapture.
- Never transmit names, emails, LinkedIn URLs, free text, or field values.
- Preserve UTM attribution through form completion.
- Filter or identify founder/developer traffic.
- Avoid duplicate events caused by repeat renders or clicks.
- Provide a staging debug mode.
- Configure the core funnel and source dashboard once account access/configuration is available.

Deliverable: privacy-safe measurement from landing-page visit through confirmed submission.

## Phase 5: Legal and content integration

- Add Privacy Policy and Terms pages using founder-supplied/approved copy.
- Add footer links to both pages.
- Add the final business name, contact method, jurisdiction, and effective dates.
- Apply any approved testimonial or claim corrections.
- Add the final canonical domain and branded email everywhere they are required.

Deliverable: integrated, linked, launch-ready policy and business content.

## Phase 6: QA

Test:

- Chrome, Safari, and Firefox
- Common phone, tablet, and desktop widths
- At least one real iPhone and Android device with founder assistance
- Keyboard-only navigation
- Reduced-motion mode
- Slow-network behavior
- Every funnel event and property
- Successful submission
- Server failure and retry
- Duplicate-click protection
- Spam/honeypot behavior
- Founder notification
- No personal form data in analytics
- SEO and social metadata
- Broken links and missing assets
- Production build and deployment behavior

Deliverable: documented verification with launch blockers resolved.

## Phase 7: Production launch

After the founder supplies the domain and account configuration:

- Connect the custom domain to Cloudflare Pages.
- Configure the root and `www` hostnames.
- Make the root domain canonical unless the founder requests otherwise.
- Redirect the secondary hostname permanently.
- Verify HTTPS and security headers.
- Add the final canonical URL to metadata and sitemap.
- Verify production analytics.
- Run a real production form submission and reconcile its lead ID.
- Verify the founder notification.
- Verify the branded fallback email link.
- Confirm the public pages and social preview.

Deliverable: production website with a verified acquisition funnel.

## Phase 8: Post-launch measurement

- Establish a weekly funnel report.
- Monitor submission failure rate and notification delivery.
- Separate internal, referral, organic, and campaign traffic.
- Record the first baseline after sufficient targeted visits.
- Create an experiment backlog from the largest funnel losses.
- Change one important variable per experiment.
- Judge experiments by qualified leads and clients, not clicks alone.

## Inputs required from the founder

Development can start without these, but final integration requires:

- Final domain
- Cloudflare Pages project/account access or deployment collaboration
- PostHog project key and host
- Chosen form/lead destination and required configuration
- Cloudflare Turnstile site key and secret
- Public branded email address
- Approved Privacy Policy and Terms copy
- Business legal name, jurisdiction, and contact information
- Confirmation/corrections for testimonials, images, claims, locations, and response time

Secrets should be entered directly into provider dashboards or secure environment variables, not pasted into documentation or committed files.
