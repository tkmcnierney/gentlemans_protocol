# The Gentleman's Protocol Launch Plan

> **Status: Archived.** Production launched on August 8, 2026. Current status and remaining work are tracked in [PROJECT_STATUS.md](PROJECT_STATUS.md).

This plan is now divided into two parallel owner-specific documents:

- [Developer Launch Plan](DEV_LAUNCH_PLAN.md): repository work, form integration, telemetry, QA, deployment, and launch verification.
- [Founder Launch Actions](FOUNDER_LAUNCH_ACTIONS.md): domain purchase, founder-owned accounts, email, lead workflow, business/legal inputs, and approvals.

The founder will own all external accounts. Development can begin against a temporary staging URL while the founder selects the domain and creates the accounts. The documents above are the current execution checklists; the material below is retained as the combined planning reference.

## Objective

Launch the existing landing page quickly with reliable lead capture, privacy-safe funnel analytics, professional email, and production hosting. Keep the site static for now; no application framework, database, CMS, or customer portal is required.

## Fastest viable launch

The fastest safe route is:

- Register the domain with Cloudflare Registrar.
- Deploy the static site on Cloudflare Pages.
- Use a temporary Cloudflare Pages URL while the domain is being selected or configured.
- Use Google Workspace for branded email.
- Use a reliable form endpoint with delivery confirmation and spam protection.
- Use PostHog with explicit, privacy-safe events and session recording disabled.
- Publish short Privacy Policy and Terms pages before collecting real applications.

DNS management, static hosting, and HTTPS can all be free. The expected base recurring cost is the domain plus business email.

## What the founders need to do first

These decisions should happen today, but they do not need to block technical work.

1. Create a shortlist of three to five domains.
2. Check availability and renewal prices, then purchase the best available option.
3. Decide whether the canonical address will use the root domain (recommended, for example `gentlemansprotocol.com`) or `www`.
4. Decide which founder-owned account will own the registrar, hosting, analytics, and email services.
5. Turn on two-factor authentication and store recovery codes safely.
6. Choose the primary public email address, such as `hello@domain.com` or `apply@domain.com`.
7. Decide where new leads will be stored and who will respond to them.
8. Confirm the published testimonials, business claims, photographs, and promised 24–48 hour response time are accurate and approved.

Do not delay deployment while searching indefinitely for a perfect domain. A clear, pronounceable non-premium `.com` is preferable. The domain can be changed later, although the old domain should then remain registered and redirect to the new one.

## Decisions that should not delay launch

The following can wait until real customers demonstrate a need:

- React or Next.js migration
- CMS
- Customer accounts
- Client dashboard
- Online payments
- Secure resource library
- Messaging portal
- Automated CRM
- Blog
- Elaborate animations
- Session replay

## Launch-critical engineering

### 1. Make lead capture reliable

The current form uses a Google Apps Script endpoint with `no-cors`. It can show success even if the server did not save the application. Before public launch:

- Use an endpoint that returns a verifiable success or failure response.
- Display a real error and retry option after failure.
- Do not show success until storage is confirmed.
- Store a timestamp and anonymous lead ID with each application.
- Send a founder notification for each valid submission.
- Prevent accidental duplicate submissions.
- Add a honeypot and Cloudflare Turnstile or equivalent spam protection.
- Add a fallback branded email address beside the form.
- Test the entire workflow in production.

### 2. Protect applicant privacy

- Add a Privacy Policy.
- Add Terms/site terms.
- Add a form disclosure linking to the Privacy Policy.
- State what information is collected, why it is collected, where it is stored, who can access it, and how deletion can be requested.
- Do not send names, email addresses, LinkedIn URLs, free-text answers, or dating information to analytics.
- Strip EXIF metadata from every image. `assets/lukas-before.jpg` currently contains GPS metadata and must not be published in that form.
- Limit access to the lead sheet or CRM.

### 3. Production hardening

- Replace the Tailwind development CDN with compiled CSS.
- Resize images to their rendered dimensions and generate WebP or AVIF versions.
- Add lazy loading to below-the-fold images.
- Add meta description and canonical URL.
- Add Open Graph and social-sharing metadata and an appropriate share image.
- Add a proper favicon and Apple touch icon.
- Add structured business data.
- Add `robots.txt` and `sitemap.xml`.
- Add security headers.
- Add accessible accordion and mobile-menu state.
- Add visible keyboard focus and reduced-motion behavior.
- Verify the page on current Chrome, Safari, Firefox, iPhone, and Android.

## Funnel telemetry

### Funnel

```text
Landing-page visit
        ↓
Meaningful engagement
        ↓
Inquiry section viewed
        ↓
CTA clicked
        ↓
Form started
        ↓
Step 1 completed
        ↓
Step 2 completed
        ↓
Submission attempted
        ↓
Submission confirmed
        ↓
Qualified lead
        ↓
Call booked
        ↓
Client acquired
```

The website measures through confirmed submission. Qualification, booking, and acquisition are recorded in the lead sheet or CRM using the anonymous lead ID.

### Event taxonomy

| Event | Safe properties |
|---|---|
| `landing_page_viewed` | UTM source, campaign, referrer category, device category |
| `meaningful_visit` | Engagement threshold reached |
| `section_viewed` | Section identifier |
| `cta_clicked` | CTA location: header, hero, or mobile menu |
| `faq_opened` | FAQ identifier |
| `before_after_used` | Selected state |
| `form_viewed` | Entry CTA location |
| `form_started` | Time to first interaction |
| `form_field_reached` | Field identifier only; never its value |
| `form_validation_error` | Field identifier and safe error category |
| `form_step_1_completed` | Elapsed time |
| `form_step_2_viewed` | Elapsed time from form start |
| `form_back_clicked` | Current step |
| `form_submit_attempted` | Anonymous lead/session ID |
| `form_submit_failed` | Safe technical error category |
| `form_submit_succeeded` | Anonymous lead ID |

Explicit events should be used instead of broad automatic capture. Session recording should remain disabled at launch because this site collects sensitive personal information.

### Weekly dashboard

Track:

- Visits by source and campaign
- Meaningfully engaged visit rate
- Inquiry-section view rate
- CTA click-through rate
- Form-start rate
- Step 1 completion rate
- Step 2 completion rate
- Submission success and technical failure rates
- Qualified-lead rate by source
- Call-booking rate
- Client conversion rate
- Cost per qualified lead when paid campaigns begin

Interpret common funnel problems as follows:

| Observation | Likely area to investigate |
|---|---|
| Low meaningful engagement | Traffic quality, page speed, or hero messaging |
| Engagement but few CTA clicks | Offer clarity, trust, or proof |
| CTA clicks but few form starts | Form presentation or perceived commitment |
| Step 1 abandonment | Identity or qualification questions |
| Step 2 abandonment | Free-text effort or hesitation about applying |
| Submission failures | Form infrastructure |
| Many submissions but few qualified leads | Audience targeting |
| Qualified leads but few clients | Sales process, pricing, or offer |

## Accelerated execution schedule

### Day 0: founder decisions

- Shortlist and purchase the domain.
- Select the public email address.
- Confirm account ownership and enable two-factor authentication.
- Confirm testimonials, claims, images, and response-time promise.
- Provide business identity/contact details needed for legal pages.

### Day 1: staging and infrastructure

- Deploy the current site to a private or unadvertised Cloudflare Pages URL.
- Create the production form backend and lead destination.
- Configure lead notifications.
- Create the analytics project and event specification.

### Day 2: site hardening

- Repair the form experience.
- Add privacy disclosure and legal pages.
- Remove photo metadata and optimize images.
- Add SEO and social metadata.
- Add analytics events.

### Day 3: QA and production

- Test responsive layouts and browsers.
- Test every funnel event.
- Test successful, failed, duplicate, and spam form submissions.
- Connect the domain and configure HTTPS and redirects.
- Configure business email records.
- Run a real production submission and verify delivery.

### Day 4: launch verification

- Verify DNS, HTTPS, redirects, email authentication, analytics, and form delivery.
- Submit the sitemap to Google Search Console.
- Confirm the social-sharing preview.
- Begin monitoring the funnel and submission health.

This three-to-four-day schedule is achievable if founder decisions and legal copy are supplied promptly. A one-day soft launch is possible, but it should be sent only to a small trusted audience until form delivery, privacy, and analytics have been verified.

## DNS and email checklist

- Root-domain hosting record configured
- `www` record configured
- One hostname selected as canonical
- Other hostname redirected permanently
- HTTPS active
- DNSSEC active
- Google Workspace MX records configured
- SPF configured
- DKIM configured
- DMARC configured, beginning with a monitoring policy if appropriate
- Registrar auto-renew enabled
- Registrant email verified

## Staging acceptance criteria

Do not announce the site publicly until:

- A real test application is saved correctly.
- The founders receive the notification.
- A simulated failure displays an error rather than success.
- No personal form contents appear in analytics.
- Funnel events appear exactly once and in the correct order.
- GPS and unnecessary EXIF data have been removed from published images.
- Privacy and Terms links work.
- The site works on a real iPhone and Android device.
- The primary and secondary domain behavior is correct.
- HTTPS works without warnings.

## First optimization cycle

Review the funnel weekly. Avoid redesigning the page in response to a handful of visits. Early data can reveal obvious failures, but small conversion differences require meaningful traffic.

For each experiment:

1. Identify the largest meaningful drop in the funnel.
2. Write one hypothesis explaining it.
3. Change one important variable.
4. Run the change long enough to collect relevant traffic.
5. Compare qualified leads, not just clicks.
6. Keep or revert the change.
7. Record the result and next question.

Analytics shows where visitors stop. Applicant conversations and short user interviews should be used to understand why.
