# Nottingham Car Recovery — Production Website

Static, production-ready website for **Nottingham Car Recovery**, built for
Cloudflare Workers + Assets. Visually based on the approved v0 "Midnight
Rescue" design, rebuilt as dependency-free static HTML/CSS/JS with a single
Cloudflare Worker for form handling.

No Next.js, React, Tailwind, shadcn or Vercel code is included in the
deployed output. A small Node.js **build-time generator** (`gen/`) is used
during development to keep all 28 pages consistent — it is not required
at runtime and is not deployed.

---

## 1. Project Structure

```
production-site/
├── public/                        ← deployed as Cloudflare Assets (site root)
│   ├── index.html                 ← homepage + 27 other clean-URL pages (28 total)
│   ├── services.html
│   ├── breakdown-recovery-nottingham.html
│   ├── accident-recovery-nottingham.html
│   ├── m1-breakdown-recovery-nottingham.html
│   ├── car-towing-vehicle-transport-nottingham.html
│   ├── van-commercial-recovery-nottingham.html
│   ├── auction-non-runner-collection-nottingham.html
│   ├── areas.html
│   ├── car-recovery-west-bridgford.html
│   ├── car-recovery-beeston.html
│   ├── car-recovery-arnold.html
│   ├── car-recovery-hucknall.html
│   ├── car-recovery-carlton-gedling.html
│   ├── car-recovery-bulwell.html
│   ├── car-recovery-clifton.html
│   ├── car-recovery-long-eaton.html
│   ├── about.html
│   ├── booking.html
│   ├── contact.html
│   ├── privacy.html
│   ├── terms.html
│   ├── recovery-without-breakdown-cover-nottingham.html   ← Phase 1 lead-expansion (urgent journey)
│   ├── car-wont-start-recovery-nottingham.html            ← Phase 1 lead-expansion (urgent journey)
│   ├── car-recovery-from-home-nottingham.html             ← Phase 1 lead-expansion (urgent journey)
│   ├── long-distance-car-transport-nottingham.html        ← Phase 1 lead-expansion (planned-transport journey)
│   ├── garage-vehicle-collection-delivery-nottingham.html ← Phase 1 lead-expansion (urgent journey)
│   ├── recovery-driver-work-nottingham.html               ← operator network (separate from customer journey)
│   ├── 404.html                   ← used by Workers Assets not_found_handling
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── _redirects
│   ├── _headers
│   ├── config/
│   │   └── site-config.js         ← THE single file to edit before launch
│   └── assets/
│       ├── css/styles.css
│       ├── js/site.js
│       ├── js/forms.js
│       ├── js/tracking.js
│       └── images/
│           ├── hero-recovery.png  ← reused from the approved v0 project
│           ├── logo.svg           ← simple logo inspired by the v0 mark
│           └── favicon.svg
├── worker/
│   └── index.js                   ← Cloudflare Worker: /notify + static asset serving
├── gen/                           ← BUILD-TIME ONLY, not deployed
│   ├── build.js                   ← run this to regenerate public/*.html
│   ├── components.js              ← shared layout/section renderers
│   ├── data.js                    ← services/areas/routes/FAQs data
│   ├── icons.js                   ← inline SVG icon set
│   ├── schema.js                  ← JSON-LD helpers
│   ├── site-config-loader.js      ← reads public/config/site-config.js at build time
│   ├── validate.js                ← automated pre-launch checks (node gen/validate.js)
│   └── pages/                     ← one module per page/page-group
│       ├── ...                    ← home, services, service-pages, areas, locations,
│       │                             about, booking, contact, legal (original 22 pages)
│       ├── lead-expansion.js      ← Phase 1 cluster: 5 new customer pages
│       └── operator.js            ← recovery-driver-work-nottingham.html
├── wrangler.toml
└── README.md
```

`gen/` is a plain Node.js script (no dependencies, no `npm install`
required) used only to keep the 28 HTML pages consistent while authoring
the site. **Only `public/`, `worker/`, `wrangler.toml` need to be deployed.**
`gen/` can be kept in the repository for future maintenance or removed —
either is fine, it never runs in production.

---

## 2. Local Preview

No build step is required to preview the static site — it's plain HTML/CSS/JS.

```bash
cd production-site/public
npx serve .
# or: python3 -m http.server 8080
```

Then open `http://localhost:8080`. Note: the `/notify` form endpoint will
not work with a plain static server — see section 6 to test the Worker
locally with `wrangler dev`.

To regenerate the HTML pages after editing anything in `gen/`:

```bash
cd production-site
node gen/build.js
```

---

## 3. Git Setup

This project was **not** initialised as a git repository and **nothing has
been committed or pushed**, per instructions.

Suggested first steps:

```bash
cd production-site
git init
git add .
git commit -m "Initial production build of Nottingham Car Recovery site"
```

**Suggested repository name:** `nottingham-car-recovery-website`
**Suggested staging branch:** `staging` (create from `main` before any live launch work)
**Suggested first commit message:** `Initial production build of Nottingham Car Recovery site`

---

## 4. Cloudflare Setup

This project uses **Workers with Assets** (not Cloudflare Pages), so a
single Worker both serves the static site and handles the `/notify` API
route.

1. Install Wrangler if you don't already have it: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Review `wrangler.toml` — the `[assets]` block points at `./public`.
4. Deploy: `wrangler deploy` (run from `production-site/`)
5. Attach the custom domain `www.nottingham-car-recovery.co.uk` in the
   Cloudflare dashboard (Workers & Pages → your worker → Triggers → Custom Domains).

### Worker secrets

The `/notify` endpoint sends form submissions to Telegram. Set these two
secrets before forms will work — **do not hard-code them anywhere**:

```bash
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
```

- `TELEGRAM_BOT_TOKEN`: create a bot via [@BotFather](https://t.me/BotFather) on Telegram, copy the token it gives you.
- `TELEGRAM_CHAT_ID`: the numeric chat ID that should receive enquiry notifications (a private chat, or a group the bot has been added to).

---

## 5. Activating Contact Details, Analytics & Verification

**Everything below is controlled from exactly one file:**
`public/config/site-config.js`

Open it and fill in:

| Field | Purpose | Current value |
|---|---|---|
| `phoneDisplay` / `phoneHref` | Phone number shown/dialled | `'07865 449983'` / `'tel:07865449983'` — **live** |
| `whatsappNumber` | WhatsApp click-to-chat number | `'447865449983'` — **live** (`https://wa.me/447865449983`) |
| `businessEmail` | Contact email | `''` — **intentionally blank, no email is offered** |
| `serviceHours` / `isTwentyFourSeven` | Hours shown site-wide | `'24 hours a day, 7 days a week'` / `true` |
| `googleAnalyticsId` | GA4 measurement ID — leave blank to keep GA4 off | `''` (placeholder) |
| `clarityProjectId` | Microsoft Clarity project ID — leave blank to keep it off | `''` (placeholder) |
| `googleSiteVerification` | Search Console verification meta value | `''` (placeholder), see section 8 |
| `bingSiteVerification` | Bing Webmaster Tools verification meta value | `''` (placeholder), see section 8 |

**How activation works:** `gen/site-config-loader.js` reads this exact file
at build time (via Node's built-in `vm` module — no dependency added) so
`node gen/build.js` bakes the real `tel:`/`wa.me` links, phone number and
hours directly into every generated page — nothing is hard-coded per page.
`public/assets/js/site.js` also re-applies the same config at runtime as a
self-healing fallback for anyone browsing without JavaScript having run
the rebuild step, and for any field that is later blanked again.

**Phone and WhatsApp are currently live** and point to `07865 449983` /
`https://wa.me/447865449983` on every page, including the sticky mobile
bar. **No business email is provided.** `businessEmail` is deliberately
left as `''`, not a placeholder string — while it is blank, no Email
button, mailto link or email address is rendered anywhere on the site;
phone, WhatsApp and the enquiry forms (which all still accept an optional
email field where present) are the contact methods. If a business email
is added later, fill in `businessEmail` and re-add an Email CTA/footer
line following the same pattern as the phone number, then regenerate.

**24/7 wording:** `isTwentyFourSeven: true` reflects genuine 24-hour
availability and enables the "24/7 Vehicle Recovery" hero badge, the
"24-hour recovery..." trust-strip line, and the footer/contact hours
text. If this ever stops being accurate, set it back to `false` and
change `serviceHours` — cautious wording elsewhere (subject to
confirmation, quote agreed before dispatch, suitable vehicles, agreed
destination) is unaffected either way, since 24/7 describes availability
to be contacted, not a guarantee of arrival time or job acceptance.

### GA4 / Clarity

Both are entirely optional and **only load if an ID is present** in
`site-config.js` (see `public/assets/js/tracking.js`). With no IDs set, no
GA4 or Clarity network requests are made at all.

Once enabled, GA4 automatically tracks:
- `phone_click` / `whatsapp_click` (from `data-track="phone-click"` / `data-track="whatsapp-click"` on CTA buttons)
- `callback_submit`, `booking_submit`, `contact_submit`, plus a `generate_lead` event, all fired from a `ncr:form-success` event dispatched by `forms.js` on successful submission. (Underscored to match standard GA4 event-name conventions.)

---

## 6. Forms & the Worker

There are three form types, all submitting to a single endpoint:
**`POST /notify`**, handled by `worker/index.js`. There is only one
form-handling architecture in this project — no duplicate handlers. The
form type is carried in a `form_name` field:

| `form_name` | Used on | Required fields |
|---|---|---|
| `callback` | Home, Contact, all 6 core service pages, all 8 location pages, and 4 of the Phase 1 lead-expansion pages (`recovery-without-breakdown-cover`, `car-wont-start-recovery`, `car-recovery-from-home`, `garage-vehicle-collection-delivery`) | `name`, `phone` |
| `planned_transport` | Booking (`/booking`) | `name`, `phone`, `collection`, `destination` |
| `operator_interest` | Recovery operator network (`/recovery-driver-work-nottingham`) | `name`, `phone`, `email`, `basePostcode`, `ownVehicle`, `experience`, plus 3 required acknowledgement checkboxes |

The `long-distance-car-transport-nottingham` page is a planned-transport
page and does not embed a form itself — its "Plan Transport" action links
to `/booking`.

- **Progressive enhancement:** forms work with plain HTML POST if
  JavaScript is unavailable (the Worker returns a small HTML confirmation
  page). With JavaScript, `assets/js/forms.js` intercepts submission,
  validates client-side, submits via `fetch` as JSON, and shows
  submitting/success/error states without a page reload. Entered data is
  **not** cleared unless the submission actually succeeds, and a
  duplicate-submission guard prevents double-sends while a request is in
  flight.
- **Anti-spam:** a hidden honeypot field (`honeypot`) is included in every
  form. If it's filled in, the Worker silently returns a success-looking
  response without contacting Telegram.
- **Tracking fields:** every form includes hidden fields for `sourcePage`,
  `pageTitle`, `currentUrl`, `referrer`, `timestamp`, all five `utm_*`
  parameters, `gclid` and `msclkid`. These are populated by `forms.js`
  from the current page/URL at submit time and preserved in the callback
  and planned-transport Telegram messages when present.
- **Validation:** required fields, lengths and basic email/phone shape are
  checked both client-side (`forms.js`) and server-side (`worker/index.js`),
  with validation rules specific to each `form_name`.
- **Security:** the Worker sanitises all input, sends messages to Telegram
  as plain text (no Markdown/HTML parse mode, so no formatting-escaping
  bugs are possible), applies a body-size limit, never echoes internal
  error detail to the client, and sets security headers on every response.
  Each form type produces a clearly distinct Telegram message header
  (`CALL ME BACK LEAD`, `NEW PLANNED TRANSPORT REQUEST`,
  `NEW RECOVERY OPERATOR INTEREST`) so the three lead types can never be
  confused with each other.
- **Operator applications collect no sensitive documents:** identity,
  licence, insurance and similar verification documents are explicitly
  not requested through the initial form — see section 11a.

### Testing the Worker locally

```bash
cd production-site
wrangler secret put TELEGRAM_BOT_TOKEN   # or use .dev.vars for local-only testing
wrangler secret put TELEGRAM_CHAT_ID
wrangler dev
```

Then submit a form against `http://localhost:8787` and confirm a message
arrives in the configured Telegram chat. Test all three forms, plus:
- Submitting with the honeypot field filled (via devtools) → should return
  a success response but **no** Telegram message.
- Submitting with required fields empty → should return a 422 with a
  clear message and no Telegram send.

---

## 7. Clean URLs & Redirects

Clean URLs (`/services`, not `/services.html`) are handled two ways,
matching the spec:

1. **Workers Assets config** — `wrangler.toml` sets
   `html_handling = "auto-trailing-slash"`, so `/public/services.html` is
   automatically served at `/services`.
2. **`public/_redirects`** — included per spec as an explicit belt-and-braces
   rule set:
   ```
   /index.html / 301
   /*.html /:splat 301
   ```

All internal links across the site use clean URLs only (no `.html`
anywhere in `href` attributes, canonicals, or `og:url`).

**To test redirects after deploying:** visit `/index.html` and any
`/*.html` URL directly and confirm each 301s to its clean equivalent.

---

## 8. Sitemap, Search Console & Bing

- `public/sitemap.xml` lists all 28 public pages using clean URLs only
  (no `.html`, no `/notify`, no tracking parameters, no duplicates). It is
  regenerated automatically by `gen/build.js` from the same page list used
  to build the site, so it can never drift out of sync.
- `public/robots.txt` allows all crawling and references the sitemap.

**After deploying:**
1. **Google Search Console** — add the `www.nottingham-car-recovery.co.uk`
   property, verify using the HTML-tag method (paste the verification
   value into `googleSiteVerification` in `site-config.js`, which is
   injected as a `<meta name="google-site-verification">` tag — see note
   below), then submit `sitemap.xml`.
2. **Bing Webmaster Tools** — same process using `bingSiteVerification`.
3. **IndexNow** (recommended) — Bing/Yandex support instant-indexing pings.
   Once the site is live, consider adding a small IndexNow key file and
   pinging on publish; this is optional and not included by default since
   it requires a generated key tied to the live domain.

> **Note:** `googleSiteVerification`/`bingSiteVerification` are stored in
> `site-config.js` as the source of truth, but since verification meta
> tags must be present in the raw HTML `<head>` (not injected by
> JavaScript) for Search Console/Bing to detect them, add the same value
> directly into `gen/components.js` (`renderHead`) as a
> `<meta name="google-site-verification" content="...">` /
> `<meta name="msvalidate.01" content="...">` tag once you have a real
> value, then run `node gen/build.js` to regenerate all pages.

---

## 9. Security Headers

`public/_headers` sets, for every response:
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
`X-Frame-Options`, `Content-Security-Policy`, and
`Strict-Transport-Security`.

Because `/notify` responses are generated by the Worker itself (not served
from `public/`), `worker/index.js` also applies the same core security
headers directly to every response it returns.

**CSP exceptions (documented):**

`public/_headers` is generated by `gen/build.js` (`buildHeaders()`/`CSP`
constant) — edit it there, not by hand, then run `node gen/build.js`.

- `script-src` allows `https://www.googletagmanager.com` and
  `https://www.clarity.ms` — the hosts GA4's `gtag.js` and Microsoft
  Clarity's tag script actually load from. Required only if GA4/Clarity
  are enabled (see section 5); unused and harmless while their IDs are blank.
- `connect-src` allows `https://www.googletagmanager.com`,
  `https://www.google-analytics.com`, `https://*.google-analytics.com`
  (GA4 uses regional subdomains such as `region1.google-analytics.com`
  for its collection endpoint), `https://analytics.google.com`,
  `https://www.clarity.ms` and `https://*.clarity.ms` (Clarity's beacon
  collection uses subdomains such as `c.clarity.ms`). These are the
  narrow, documented hosts each script actually calls — no wildcard
  origin, no `'unsafe-eval'`, and no other third-party service is allowed.
- `style-src` includes `'unsafe-inline'` because a handful of content
  sections (e.g. the booking form layout, a few spacing tweaks in
  `about.html`/`contact.html`) use inline `style="..."` attributes rather
  than an extra CSS class. If you move those into `styles.css` classes,
  `'unsafe-inline'` can be removed from `style-src` for a stricter policy.
- `frame-ancestors 'none'` is unchanged and not weakened by the above.

If GA4/Clarity are never enabled, those two host allowances are unused but
harmless.

---

## 10. Image Replacement Checklist

- `public/assets/images/hero-recovery.png` — reused directly from the
  approved v0 project (`public/images/hero-recovery.png` in the source
  ZIP). It is a **neutral, non-branded stock-style image** (a recovery
  truck loading a car at night), not a photo of real company vehicles or
  staff. Replace with genuine business photography when available.
  **Known limitation:** no image-compression tooling was available in
  this environment, so the file is still full-size (~1.9 MB) — compress
  and/or convert to WebP before launch for better performance.
- `public/assets/images/logo.svg` — a simple hand-built SVG logo inspired
  by the approved v0 mark's shape and amber colour, not a scan or trace of
  any third-party or manufacturer logo. Safe to use as-is or replace with
  a designed logo later.
- `public/assets/images/favicon.svg` — companion small-size favicon, same
  mark. Modern browsers support SVG favicons directly; if you need a
  `.ico`/PNG fallback for older browsers, generate one from `favicon.svg`
  and add it back into `<head>` in `gen/components.js`.
- No staff photos, fleet photos, or fabricated award/accreditation badges
  are used anywhere on the site.

---

## 11. Legal Review Warning

**`public/privacy.html` and `public/terms.html` are practical starting
drafts only.** They cover the topics requested (form data, Telegram
processing, Cloudflare/GA4/Clarity where enabled, retention, user rights,
quote-only bookings, cancellations, England & Wales jurisdiction, etc.),
written in plain UK-oriented language — **but they have not been reviewed
by a solicitor and must not be treated as final legal advice.**

**Get both pages reviewed by a qualified UK solicitor before launch,**
particularly to confirm UK GDPR compliance, cancellation/consumer-rights
wording, and liability limitations. This warning is also embedded as an
HTML comment at the top of both pages' content.

---

## 11a. Recovery Operator Network — Launch Note

`/recovery-driver-work-nottingham` captures expressions of interest from
independent recovery operators and drivers via a dedicated
`operator_interest` form (separate from the customer callback and
planned-transport forms — see section 6). It deliberately uses "Independent
recovery operator network" and "Register your interest in suitable
opportunities" rather than any language implying employment, a guaranteed
subcontract, a franchise, a membership scheme, or a lead marketplace with
guaranteed returns. It does not use JobPosting structured data (WebPage is
used instead — see `gen/schema.js`'s `webPageSchema()`), and does not
advertise salary, day rate, minimum income, guaranteed leads/jobs, constant
work, employment benefits, paid training, or police/insurer work.

**Before dispatching any actual work to third-party operators, obtain
professional review of:**

- Independent-contractor or referral terms
- Employment-status implications
- Tax and intermediary obligations
- Data-sharing and privacy arrangements
- Customer contracting and payment flows
- Insurance requirements
- Operator and driver verification
- Damage and complaints responsibility
- Health and safety
- Applicable operator-licensing requirements

This project does not draw legal conclusions on any of the above — the
page copy is deliberately cautious and non-committal (e.g. "employment and
tax status depends on the actual working arrangement") specifically so
that these determinations are made properly, not by website copy.

---

## 12. Launch Checklist

- [x] Phone, WhatsApp and hours are set in `public/config/site-config.js`
      (`07865 449983` / `https://wa.me/447865449983` / 24/7). No business
      email is provided — that stays intentionally blank.
- [ ] Regenerate pages if you edited anything under `gen/`: `node gen/build.js`
- [ ] Set `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` via `wrangler secret put`
- [ ] Test all three form types end-to-end (callback, planned transport,
      operator interest — success, validation error, honeypot)
- [ ] Complete the professional review items in section 11a before
      dispatching any real work to third-party recovery operators
- [ ] Get Privacy Policy & Terms reviewed by a solicitor
- [ ] Replace/compress the hero image; add real business photography if available
- [ ] Set `googleAnalyticsId`/`clarityProjectId` only if/when approved for use
- [ ] Add real Search Console / Bing verification meta tags (see section 8) and redeploy
- [ ] `wrangler deploy`, then attach the custom domain in the Cloudflare dashboard
- [ ] Confirm HTTPS is enforced and `/index.html` and `/*.html` all redirect to clean URLs
- [ ] Submit `sitemap.xml` in Search Console and Bing Webmaster Tools
- [ ] Run the validation checks in section 13 again against the live site

---

## 13. Automated Validation

`gen/build.js` guarantees structural consistency (single source of data
for the sitemap, nav, footer, breadcrumbs, contact details). Run the
validation script after any change:

```bash
cd production-site
node gen/build.js
node gen/validate.js
```

`gen/validate.js` checks (81 checks as of the Phase 1 expansion pass): all
28 pages exist, exactly one H1 each, unique titles/descriptions, clean
canonicals matching `og:url`, no internal `.html` links, no broken
internal links, sitemap matches pages with no duplicates, `robots.txt` is
correct, all JSON-LD parses and FAQ schema matches visible FAQs with no
duplicates, every form targets `/notify`, no hard-coded Telegram secrets,
a forbidden-string sweep (Leicester, v0.app, vercel, lorem, TODO,
localhost, workers.dev, example.com, API_KEY), no discouraged
superlative/guarantee phrases, working Privacy/Terms links, all call
links use the configured `tel:` number, all WhatsApp links use the
configured `wa.me` link, no `mailto:`/email-CTA remnants, no
`aria-disabled="true"` in generated HTML, 24/7 wording present when
`isTwentyFourSeven` is `true`, the van page's FAQ wording, the Worker's
use of `request.formData()` for multipart parsing, GA4/Clarity/
verification IDs remaining blank, the exact contact/hours values in
`site-config.js`, the `_headers` CSP's GA4/Clarity allowances (no
`unsafe-eval`, no wildcard-only policy), and the underscored GA4 event
names.

For a quick manual spot-check after making changes:

```bash
grep -RIL "google-site-verification" public/*.html   # expected on all, once real values are added
grep -RIn "\.html\"" public/*.html                    # should only match canonical/og:url self-references, never in nav hrefs
```

---

## 14. Rollback Guidance

Cloudflare Workers keeps previous deployments. If a deploy introduces a
problem:

```bash
wrangler deployments list
wrangler rollback <deployment-id>
```

Because this project has no build pipeline beyond the local `gen/build.js`
script, rollback is simply: redeploy the previous known-good `public/` +
`worker/index.js` (e.g. via git history once you've initialised the repo),
or use Wrangler's built-in rollback command above.

---

## 15. Known Limitations

- Hero image is not compressed/converted to WebP (no image tooling
  available in the build environment) — see section 10.
- No automated CI pipeline is included; deployment is manual via Wrangler.
- Search Console/Bing verification meta tags need to be added directly
  into `gen/components.js` once you have real values (see section 8),
  since they must be static HTML, not JS-injected.
- Phone/WhatsApp/hours are live; analytics IDs and verification codes
  remain blank placeholders until `site-config.js` is edited — see section 5.
- No business email is provided. `businessEmail` is intentionally blank
  rather than a placeholder, and no email CTA is rendered anywhere.
- Privacy Policy and Terms require legal review — see section 11.
