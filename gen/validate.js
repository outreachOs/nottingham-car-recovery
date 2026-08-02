'use strict';
/* Validation checks per project spec section 34. Read-only — reports issues. */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const WORKER_FILE = path.join(__dirname, '..', 'worker', 'index.js');
const README_FILE = path.join(__dirname, '..', 'README.md');
const CONFIG_FILE = path.join(PUBLIC_DIR, 'config', 'site-config.js');

const REQUIRED_PAGES = [
  'index.html','services.html','breakdown-recovery-nottingham.html','accident-recovery-nottingham.html',
  'm1-breakdown-recovery-nottingham.html','car-towing-vehicle-transport-nottingham.html',
  'van-commercial-recovery-nottingham.html','auction-non-runner-collection-nottingham.html','areas.html',
  'car-recovery-west-bridgford.html','car-recovery-beeston.html','car-recovery-arnold.html',
  'car-recovery-hucknall.html','car-recovery-carlton-gedling.html','car-recovery-bulwell.html',
  'car-recovery-clifton.html','car-recovery-long-eaton.html','about.html','booking.html','contact.html',
  'privacy.html','terms.html',
  // Phase 1 organic lead-expansion cluster (6 new pages)
  'recovery-without-breakdown-cover-nottingham.html','car-wont-start-recovery-nottingham.html',
  'car-recovery-from-home-nottingham.html','long-distance-car-transport-nottingham.html',
  'garage-vehicle-collection-delivery-nottingham.html','recovery-driver-work-nottingham.html'
];

const LEAD_EXPANSION_PAGES = [
  'recovery-without-breakdown-cover-nottingham.html','car-wont-start-recovery-nottingham.html',
  'car-recovery-from-home-nottingham.html','garage-vehicle-collection-delivery-nottingham.html'
];

let issues = [];
let passes = [];

function fail(msg) { issues.push(msg); }
function pass(msg) { passes.push(msg); }

// 1. All 28 HTML files exist
const missing = REQUIRED_PAGES.filter((f) => !fs.existsSync(path.join(PUBLIC_DIR, f)));
if (missing.length) fail('Missing pages: ' + missing.join(', '));
else pass(`All ${REQUIRED_PAGES.length} required HTML files exist (22 original + 6 Phase 1 expansion pages).`);

const pageHtml = {};
for (const f of REQUIRED_PAGES) {
  pageHtml[f] = fs.readFileSync(path.join(PUBLIC_DIR, f), 'utf8');
}

// 2. Exactly one H1 per page
for (const f of REQUIRED_PAGES) {
  const matches = pageHtml[f].match(/<h1[\s>]/g) || [];
  if (matches.length !== 1) fail(`${f}: expected exactly 1 <h1>, found ${matches.length}`);
}
if (!issues.some((i) => i.includes('<h1>'))) pass('Every page has exactly one H1.');

// 3 & 4. Unique titles / descriptions
const titles = {};
const descriptions = {};
for (const f of REQUIRED_PAGES) {
  const t = (pageHtml[f].match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  const d = (pageHtml[f].match(/<meta name="description" content="([\s\S]*?)">/) || [])[1];
  if (!t) fail(`${f}: missing <title>`);
  if (!d) fail(`${f}: missing meta description`);
  if (t) {
    if (titles[t]) fail(`Duplicate title "${t}" in ${f} and ${titles[t]}`);
    titles[t] = f;
  }
  if (d) {
    if (descriptions[d]) fail(`Duplicate description in ${f} and ${descriptions[d]}`);
    descriptions[d] = f;
  }
}
if (Object.keys(titles).length === REQUIRED_PAGES.length) pass('All titles are unique.');
if (Object.keys(descriptions).length === REQUIRED_PAGES.length) pass('All meta descriptions are unique.');

// 5 & 6. Clean canonical + og:url match, no .html
for (const f of REQUIRED_PAGES) {
  const canonical = (pageHtml[f].match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
  const ogUrl = (pageHtml[f].match(/<meta property="og:url" content="([^"]+)">/) || [])[1];
  if (!canonical) fail(`${f}: missing canonical`);
  if (!ogUrl) fail(`${f}: missing og:url`);
  if (canonical && canonical.includes('.html')) fail(`${f}: canonical contains .html (${canonical})`);
  if (canonical && ogUrl && canonical !== ogUrl) fail(`${f}: canonical (${canonical}) != og:url (${ogUrl})`);
  if (!canonical || !canonical.startsWith('https://nottingham-car-recovery.co.uk')) {
    fail(`${f}: canonical does not use production domain (${canonical})`);
  }
}
pass('Canonical/og:url checked for all pages (no .html, matching, production domain).');

// 7. No internal .html links in hrefs
for (const f of REQUIRED_PAGES) {
  const hrefs = pageHtml[f].match(/href="([^"]*)"/g) || [];
  for (const h of hrefs) {
    const val = h.slice(6, -1);
    if (val.includes('.html') && !val.startsWith('http')) {
      fail(`${f}: internal-looking href contains .html -> ${val}`);
    }
  }
}
if (!issues.some((i) => i.includes('.html ->'))) pass('No internal .html hrefs found.');

// 8. No broken internal links (clean paths must be in sitemap set or be #anchor/asset/config/notify)
const sitemapPaths = new Set(
  REQUIRED_PAGES.map((f) => (f === 'index.html' ? '/' : '/' + f.replace('.html', '')))
);
for (const f of REQUIRED_PAGES) {
  const hrefs = pageHtml[f].match(/href="([^"]*)"/g) || [];
  for (const h of hrefs) {
    const val = h.slice(6, -1);
    if (!val || val.startsWith('http') || val.startsWith('#') || val.startsWith('tel:') || val.startsWith('mailto:')) continue;
    const cleanPath = val.split('#')[0];
    if (cleanPath === '') continue;
    if (cleanPath.startsWith('/assets/') || cleanPath.startsWith('/config/')) continue;
    if (!sitemapPaths.has(cleanPath)) {
      fail(`${f}: internal link to unknown path -> ${val}`);
    }
  }
}
if (!issues.some((i) => i.includes('unknown path'))) pass('All internal page links resolve to known pages.');

// 9. Sitemap matches public pages, no duplicates
const sitemap = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const uniqueLocs = new Set(locs);
if (uniqueLocs.size !== locs.length) fail('sitemap.xml has duplicate URLs');
else pass('sitemap.xml has no duplicate URLs.');
if (locs.length !== REQUIRED_PAGES.length) fail(`sitemap.xml has ${locs.length} URLs, expected ${REQUIRED_PAGES.length}`);
else pass(`sitemap.xml URL count matches page count (${REQUIRED_PAGES.length}).`);
const sitemapCleanPaths = new Set(locs.map((l) => l.replace('https://nottingham-car-recovery.co.uk', '') || '/'));
for (const p of sitemapPaths) {
  if (!sitemapCleanPaths.has(p)) fail(`sitemap.xml missing path ${p}`);
}
if (locs.some((l) => l.includes('.html'))) fail('sitemap.xml contains a .html URL');
if (locs.some((l) => l.includes('/notify'))) fail('sitemap.xml contains /notify');

// 10. robots.txt sitemap correct
const robots = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://nottingham-car-recovery.co.uk/sitemap.xml')) {
  fail('robots.txt sitemap reference is missing or incorrect');
} else pass('robots.txt references the correct sitemap URL.');

// 11. Valid JSON-LD
for (const f of REQUIRED_PAGES) {
  const scripts = [...pageHtml[f].matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const s of scripts) {
    try {
      JSON.parse(s[1]);
    } catch (e) {
      fail(`${f}: invalid JSON-LD (${e.message})`);
    }
  }
}
if (!issues.some((i) => i.includes('invalid JSON-LD'))) pass('All JSON-LD blocks parse as valid JSON.');

// 12. FAQ schema matches visible FAQs, no duplicate FAQPage schema
for (const f of REQUIRED_PAGES) {
  const html = pageHtml[f];
  const visibleQuestions = [...html.matchAll(/<span>([\s\S]*?)<\/span>\s*<svg/g)]
    .map((m) => m[1].trim())
    .filter((q) => q.length > 0);
  // Narrow to faq trigger spans only (they are immediately followed by the chevron svg inside the trigger button)
  const faqSchemas = [...html.matchAll(/"@type":"FAQPage","mainEntity":(\[[\s\S]*?\])\}<\/script>/g)];
  if (faqSchemas.length > 1) fail(`${f}: multiple FAQPage schema blocks found`);
  if (faqSchemas.length === 1) {
    let entities;
    try {
      entities = JSON.parse(faqSchemas[0][1]);
    } catch (e) {
      fail(`${f}: FAQPage mainEntity not parseable`);
      continue;
    }
    const schemaQuestions = entities.map((e) => e.name);
    const triggerMatches = [...html.matchAll(/faq-item__trigger[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>/g)].map((m) => m[1].trim());
    if (schemaQuestions.length !== triggerMatches.length) {
      fail(`${f}: FAQ schema count (${schemaQuestions.length}) != visible FAQ count (${triggerMatches.length})`);
    } else {
      for (let i = 0; i < schemaQuestions.length; i++) {
        if (schemaQuestions[i] !== triggerMatches[i]) {
          fail(`${f}: FAQ schema question mismatch at index ${i}: "${schemaQuestions[i]}" vs "${triggerMatches[i]}"`);
        }
      }
    }
  }
}
if (!issues.some((i) => i.includes('FAQ schema'))) pass('FAQ schema matches visible FAQs on every page that has one; no duplicates.');

// 13. Forms point to /notify
for (const f of REQUIRED_PAGES) {
  const forms = [...pageHtml[f].matchAll(/<form[^>]*>/g)];
  for (const form of forms) {
    if (!/action="\/notify"/.test(form[0])) {
      fail(`${f}: a <form> does not target /notify -> ${form[0].slice(0, 80)}`);
    }
  }
}
if (!issues.some((i) => i.includes('does not target /notify'))) pass('All forms submit to /notify.');

// 14. No hard-coded Telegram secrets in worker
const workerSrc = fs.readFileSync(WORKER_FILE, 'utf8');
if (/[0-9]{8,10}:[A-Za-z0-9_-]{30,}/.test(workerSrc)) {
  fail('worker/index.js appears to contain a hard-coded Telegram bot token');
} else pass('No hard-coded Telegram bot token pattern found in worker/index.js.');
if (!/env\.TELEGRAM_BOT_TOKEN/.test(workerSrc) || !/env\.TELEGRAM_CHAT_ID/.test(workerSrc)) {
  fail('worker/index.js does not reference env.TELEGRAM_BOT_TOKEN / env.TELEGRAM_CHAT_ID');
} else pass('Worker reads Telegram credentials from env (secrets), not hard-coded.');

// 15. Forbidden strings scan
const forbidden = [
  'Leicester', 'leicester-car-recovery', 'v0.app', 'vercel', 'lorem ipsum', 'TODO',
  'localhost', 'workers.dev', 'example.com', 'API_KEY'
];
const allPublicFiles = fs.readdirSync(PUBLIC_DIR).filter((f) => f.endsWith('.html'))
  .concat(['sitemap.xml', 'robots.txt', '_redirects', '_headers'])
  .map((f) => path.join(PUBLIC_DIR, f));
const jsFiles = ['assets/js/site.js', 'assets/js/forms.js', 'assets/js/tracking.js', 'assets/css/styles.css']
  .map((f) => path.join(PUBLIC_DIR, f));

for (const filePath of [...allPublicFiles, ...jsFiles, WORKER_FILE]) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const term of forbidden) {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      fail(`Forbidden string "${term}" found in ${path.relative(process.cwd(), filePath)}`);
    }
  }
}
// Config file & README are allowed to contain documented placeholders
// (PHONE NUMBER TO BE ADDED etc.) but not the hard "forbidden" list above.
for (const term of forbidden) {
  const content = fs.readFileSync(CONFIG_FILE, 'utf8');
  if (content.toLowerCase().includes(term.toLowerCase())) {
    fail(`Forbidden string "${term}" found in config/site-config.js`);
  }
}
if (!issues.some((i) => i.startsWith('Forbidden string'))) pass('No forbidden strings (Leicester, v0.app, vercel, lorem, TODO, localhost, workers.dev, example.com, API_KEY) found.');

// Placeholder text should not leak onto visible pages (only allowed in config/README)
for (const f of REQUIRED_PAGES) {
  if (pageHtml[f].includes('PHONE NUMBER TO BE ADDED') || pageHtml[f].includes('EMAIL ADDRESS TO BE ADDED') || pageHtml[f].includes('WHATSAPP NUMBER TO BE ADDED')) {
    fail(`${f}: raw placeholder text is visible in HTML output`);
  }
}
if (!issues.some((i) => i.includes('raw placeholder text'))) pass('No raw "TO BE ADDED" placeholder text appears in any page HTML.');

// 404/HGV/response-time/guarantee word scan (spirit check)
const bannedMarketing = ['fastest', 'cheapest', 'guaranteed arrival', 'any vehicle', 'all commercial vehicles', 'every road', 'every lay-by'];
for (const f of REQUIRED_PAGES) {
  const lower = pageHtml[f].toLowerCase();
  for (const term of bannedMarketing) {
    if (lower.includes(term)) fail(`${f}: contains discouraged phrase "${term}"`);
  }
}
if (!issues.some((i) => i.includes('discouraged phrase'))) pass('No discouraged superlative/guarantee phrases found.');

// Privacy/terms links present
const footerFile = pageHtml['index.html'];
if (!footerFile.includes('href="/privacy"') || !footerFile.includes('href="/terms"')) {
  fail('Footer is missing Privacy/Terms links');
} else pass('Footer includes working Privacy and Terms links.');

// ------------------------------------------------------------------
// Pre-launch correction pass checks (contact details, worker parsing,
// CSP, GA4 event names, van FAQ, email removal, 24/7 wording)
// ------------------------------------------------------------------

// All call links use tel:07488813738
let telOk = true;
for (const f of REQUIRED_PAGES) {
  const allTel = [...pageHtml[f].matchAll(/<a[^>]*data-cta="call"[^>]*>/g)].map((m) => (m[0].match(/href="([^"]*)"/) || [])[1]);
  for (const href of allTel) {
    if (href !== 'tel:07488813738') {
      fail(`${f}: call link href is "${href}", expected "tel:07488813738"`);
      telOk = false;
    }
  }
}
if (telOk) pass('All call links use tel:07488813738.');

// All WhatsApp links use wa.me/447488813738
let waOk = true;
for (const f of REQUIRED_PAGES) {
  const allWa = [...pageHtml[f].matchAll(/<a[^>]*data-cta="whatsapp"[^>]*>/g)].map((m) => (m[0].match(/href="([^"]*)"/) || [])[1]);
  for (const href of allWa) {
    if (href !== 'https://wa.me/447488813738') {
      fail(`${f}: WhatsApp link href is "${href}", expected "https://wa.me/447488813738"`);
      waOk = false;
    }
  }
}
if (waOk) pass('All WhatsApp links use https://wa.me/447488813738.');

// No mailto: links, no email CTA, no empty/broken email references
let emailOk = true;
for (const f of REQUIRED_PAGES) {
  if (pageHtml[f].includes('mailto:')) {
    fail(`${f}: contains a mailto: link`);
    emailOk = false;
  }
  if (pageHtml[f].includes('data-cta="email"')) {
    fail(`${f}: contains an email CTA element`);
    emailOk = false;
  }
}
if (emailOk) pass('No mailto: links or email CTA elements found on any page.');

// No aria-disabled="true" on live call/WhatsApp links
let disabledOk = true;
for (const f of REQUIRED_PAGES) {
  if (/aria-disabled="true"/.test(pageHtml[f])) {
    fail(`${f}: contains aria-disabled="true"`);
    disabledOk = false;
  }
}
if (disabledOk) pass('No aria-disabled="true" found in generated HTML.');

// 24/7 wording present somewhere on the homepage
if (/24\/7|24-hour|24 hours a day/i.test(pageHtml['index.html'])) {
  pass('24/7 wording is present on the homepage.');
} else {
  fail('No 24/7 wording found on the homepage despite isTwentyFourSeven: true');
}

// Old HGV FAQ fully gone
if (Object.values(pageHtml).some((html) => html.includes('Do you recover HGVs?'))) {
  fail('Old "Do you recover HGVs?" FAQ still present somewhere');
} else {
  pass('Old "Do you recover HGVs?" FAQ has been fully replaced.');
}
if (!pageHtml['van-commercial-recovery-nottingham.html'].includes('What types of vans can you recover?')) {
  fail('New van FAQ question not found on van page');
} else {
  pass('New van FAQ question present on the van page.');
}

// Worker uses request.formData() for multipart, not URLSearchParams(raw-text)
if (/request\.formData\(\)/.test(workerSrc)) {
  pass('Worker uses request.formData() to parse multipart/form-data.');
} else {
  fail('Worker does not appear to use request.formData() for multipart parsing');
}

// GA4/Clarity/verification IDs remain blank placeholders
const configSrc = fs.readFileSync(CONFIG_FILE, 'utf8');
const idFields = ['googleAnalyticsId', 'clarityProjectId', 'googleSiteVerification', 'bingSiteVerification'];
let idsBlank = true;
for (const field of idFields) {
  const m = configSrc.match(new RegExp(field + ":\\s*'([^']*)'"));
  if (!m || m[1] !== '') {
    fail(`config: ${field} is not blank (found "${m ? m[1] : 'not found'}")`);
    idsBlank = false;
  }
}
if (idsBlank) pass('googleAnalyticsId, clarityProjectId, googleSiteVerification and bingSiteVerification remain blank.');

// site-config.js contact/hours values match the requested correction
if (configSrc.includes("phoneDisplay: '07488 813738'") &&
    configSrc.includes("phoneHref: 'tel:07488813738'") &&
    configSrc.includes("whatsappNumber: '447488813738'") &&
    configSrc.includes("businessEmail: ''") &&
    configSrc.includes("serviceHours: '24 hours a day, 7 days a week'") &&
    configSrc.includes('isTwentyFourSeven: true')) {
  pass('site-config.js contact/hours values match the requested correction exactly.');
} else {
  fail('site-config.js contact/hours values do not fully match the requested correction');
}

// CSP includes GA4/Clarity domains without wildcard-only policy or unsafe-eval
const headersSrc = fs.readFileSync(path.join(PUBLIC_DIR, '_headers'), 'utf8');
if (headersSrc.includes('unsafe-eval')) {
  fail('_headers CSP includes unsafe-eval');
} else if (!headersSrc.includes('google-analytics.com') || !headersSrc.includes('clarity.ms')) {
  fail('_headers CSP is missing expected GA4/Clarity domains');
} else if (/Content-Security-Policy:\s*\*/.test(headersSrc)) {
  fail('_headers CSP is wildcard-only');
} else {
  pass('_headers CSP includes narrow GA4/Clarity allowances, no unsafe-eval, no wildcard-only policy.');
}

// GA4 event names match the CRO spec exactly
const trackingSrc = fs.readFileSync(path.join(PUBLIC_DIR, 'assets', 'js', 'tracking.js'), 'utf8');
if (trackingSrc.includes('callback_submit') && trackingSrc.includes('planned_transport_submit') && trackingSrc.includes('generate_lead')) {
  pass('GA4 event names match spec (callback_submit, planned_transport_submit, generate_lead).');
} else {
  fail('tracking.js event names do not match the required names (callback_submit, planned_transport_submit)');
}
if (trackingSrc.includes('booking_submit') || trackingSrc.includes('contact_submit') || /callback-submit|booking-submit|contact-submit/.test(trackingSrc)) {
  fail('tracking.js still contains retired event names (booking_submit/contact_submit or hyphenated variants)');
}

// ------------------------------------------------------------------
// Conversion-rate-optimisation pass checks (section 19 of the CRO spec)
// ------------------------------------------------------------------

// Pages that must contain the compact, exactly-2-field callback form.
const CALLBACK_FORM_PAGES = [
  'index.html', 'contact.html',
  'breakdown-recovery-nottingham.html', 'accident-recovery-nottingham.html',
  'm1-breakdown-recovery-nottingham.html', 'car-towing-vehicle-transport-nottingham.html',
  'van-commercial-recovery-nottingham.html', 'auction-non-runner-collection-nottingham.html',
  'car-recovery-west-bridgford.html', 'car-recovery-beeston.html', 'car-recovery-arnold.html',
  'car-recovery-hucknall.html', 'car-recovery-carlton-gedling.html', 'car-recovery-bulwell.html',
  'car-recovery-clifton.html', 'car-recovery-long-eaton.html',
  'recovery-without-breakdown-cover-nottingham.html', 'car-wont-start-recovery-nottingham.html',
  'car-recovery-from-home-nottingham.html', 'garage-vehicle-collection-delivery-nottingham.html'
];

let callbackFieldsOk = true;
for (const f of CALLBACK_FORM_PAGES) {
  const html = pageHtml[f];
  const formMatch = html.match(/<form[^>]*data-form-name="callback"[\s\S]*?<\/form>/);
  if (!formMatch) {
    fail(`${f}: no data-form-name="callback" form found`);
    callbackFieldsOk = false;
    continue;
  }
  const formHtml = formMatch[0];
  const visibleInputs = [...formHtml.matchAll(/<(input|select|textarea)\b([^>]*)>/g)].filter((m) => {
    const attrs = m[2];
    return !/type="hidden"/.test(attrs) && !/id="honeypot"/.test(attrs);
  });
  const names = visibleInputs.map((m) => (m[2].match(/name="([^"]+)"/) || [])[1]);
  const expected = ['name', 'phone'];
  if (names.length !== 2 || names[0] !== 'name' || names[1] !== 'phone') {
    fail(`${f}: callback form visible fields are [${names.join(', ')}], expected exactly [name, phone]`);
    callbackFieldsOk = false;
  }
  for (const m of visibleInputs) {
    if (!/\brequired\b/.test(m[2])) {
      fail(`${f}: callback form field "${(m[2].match(/name="([^"]+)"/) || [])[1]}" is not required`);
      callbackFieldsOk = false;
    }
  }
  const forbiddenFieldNames = ['email', 'location', 'postcode', 'vehicle', 'registration', 'service', 'destination', 'message', 'consent'];
  for (const bad of forbiddenFieldNames) {
    if (new RegExp(`name="${bad}"`).test(formHtml)) {
      fail(`${f}: callback form unexpectedly includes a "${bad}" field`);
      callbackFieldsOk = false;
    }
  }
  if (/type="checkbox"/.test(formHtml)) {
    fail(`${f}: callback form includes a checkbox (consent checkbox must not be present)`);
    callbackFieldsOk = false;
  }
  if (!formHtml.includes('Call Me Back')) {
    fail(`${f}: callback form submit button is not "Call Me Back"`);
    callbackFieldsOk = false;
  }
  if (!formHtml.includes('id="honeypot"') || !formHtml.includes('name="honeypot"')) {
    fail(`${f}: callback form is missing the honeypot field`);
    callbackFieldsOk = false;
  }
}
if (callbackFieldsOk) {
  pass(`All ${CALLBACK_FORM_PAGES.length} callback forms (home, contact, 6 service pages, 8 location pages) have exactly 2 required visible fields (name, phone), no email/location/vehicle/message/consent fields, and the correct submit label.`);
}

// Booking page: planned-transport form field/requirement check
const bookingHtml = pageHtml['booking.html'];
if (!/<h1[^>]*>Request Planned Vehicle Transport<\/h1>/.test(bookingHtml)) {
  fail('booking.html: H1 is not exactly "Request Planned Vehicle Transport"');
} else {
  pass('booking.html H1 is "Request Planned Vehicle Transport".');
}
if (bookingHtml.includes('type="checkbox"')) {
  fail('booking.html: planned transport form includes a checkbox (consent checkbox must be removed)');
} else {
  pass('booking.html planned transport form has no consent checkbox.');
}
if (!bookingHtml.includes('data-form-name="planned_transport"')) {
  fail('booking.html: form is not marked data-form-name="planned_transport"');
}
const requiredPtFieldNames = ['name', 'phone', 'collection', 'destination'];
const missingPt = requiredPtFieldNames.filter((n) => !new RegExp(`<input[^>]*name="${n}"[^>]*required`).test(bookingHtml));
if (missingPt.length) {
  fail(`booking.html: expected required fields not marked required: ${missingPt.join(', ')}`);
} else {
  pass('booking.html required fields (name, phone, collection, destination) are all marked required.');
}
if (!/<details class="form-disclosure">/.test(bookingHtml) || / open>/.test(bookingHtml.match(/<details class="form-disclosure">/) ? bookingHtml : '')) {
  fail('booking.html: progressive disclosure <details> not found or not collapsed by default');
} else {
  pass('booking.html progressive disclosure section present and collapsed by default.');
}
if (!bookingHtml.includes('Submitting this form is a request only.')) {
  fail('booking.html: missing the required "request only" legal notice');
} else {
  pass('booking.html includes the required "request only" legal notice.');
}
if (!bookingHtml.includes('Send Transport Details<')) {
  fail('booking.html: submit button is not "Send Transport Details"');
} else {
  pass('booking.html submit button is "Send Transport Details".');
}
// Scope this to <main> only — the shared sitewide header/mobile-menu
// legitimately says "Call Me Back" on every page, including this one.
const bookingMain = (bookingHtml.match(/<main[^>]*>[\s\S]*?<\/main>/) || [bookingHtml])[0];
if (bookingMain.includes('Call Me Back')) {
  fail('booking.html: "Call Me Back" wording must not be used within the planned transport page content');
} else {
  pass('booking.html page content does not use "Call Me Back" wording (planned transport stays a separate journey).');
}
if (!/Need recovery now\?/.test(bookingHtml) || !/tel:07488813738/.test(bookingHtml) || !/https:\/\/wa\.me\/447488813738/.test(bookingHtml)) {
  fail('booking.html: missing the urgent-recovery notice with working call/WhatsApp links');
} else {
  pass('booking.html has the urgent-recovery notice with working call and WhatsApp links.');
}

// Homepage hero: phone visible, 24/7 line, call-now instruction
const homeHtml = pageHtml['index.html'];
if (!/Available 24\/7\./.test(homeHtml)) {
  fail('index.html: hero is missing "Available 24/7."');
} else {
  pass('Homepage hero includes "Available 24/7."');
}
if (!/Call now and tell us where you are/.test(homeHtml)) {
  fail('index.html: hero is missing the "Call now and tell us..." instruction line');
} else {
  pass('Homepage hero includes the "Call now and tell us..." instruction line.');
}

// Header: desktop call CTA shows the real number
if (!/header-call[\s\S]*?Call 07488 813738/.test(homeHtml)) {
  fail('index.html: desktop header call button does not read "Call 07488 813738"');
} else {
  pass('Desktop header call button reads "Call 07488 813738".');
}

// Sticky bar: exactly 2 actions, no third callback button
for (const f of ['index.html', 'contact.html', 'booking.html']) {
  const stickyMatch = pageHtml[f].match(/<div class="sticky-actions">[\s\S]*?<\/div>\s*<\/div>/);
  if (!stickyMatch) {
    fail(`${f}: sticky-actions bar not found`);
    continue;
  }
  const stickyLinks = [...stickyMatch[0].matchAll(/<a[^>]*data-cta="([^"]+)"/g)].map((m) => m[1]);
  if (stickyLinks.length !== 2 || stickyLinks[0] !== 'call' || stickyLinks[1] !== 'whatsapp') {
    fail(`${f}: sticky bar actions are [${stickyLinks.join(', ')}], expected exactly [call, whatsapp]`);
  }
}
pass('Sticky mobile action bar has exactly 2 actions (call, whatsapp) with no third callback button, checked on a sample of pages.');

// Van FAQ + HGV wording removed from body copy too
if (/\bHGV\b/i.test(pageHtml['van-commercial-recovery-nottingham.html'].replace(/"@type":"Question","name":"[^"]*HGV[^"]*"/gi, ''))) {
  // Only the FAQPage JSON-LD question text is allowed to be absent of HGV now; body prose should not mention it either.
  const bodyOnly = pageHtml['van-commercial-recovery-nottingham.html'].replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  if (/\bHGV\b/i.test(bodyOnly)) {
    fail('van-commercial-recovery-nottingham.html: "HGV" wording still present in visible body copy');
  }
}

// ------------------------------------------------------------------
// Final copy / customer-journey pass checks
// ------------------------------------------------------------------

// Retired urgent-CTA wording must not appear anywhere (except as prose
// inside unrelated headings like "Advance Booking" on service pages,
// which is legitimate body copy, not a CTA — checked separately below).
const RETIRED_URGENT_CTA_STRINGS = [
  'Request a Callback',
  'Request My Callback',
  'Request Planned Transport<',
  '>Get Help<',
  'Call for Recovery',
  'Call for Vehicle Recovery'
];
let retiredOk = true;
for (const f of REQUIRED_PAGES.concat(['404.html'])) {
  const html = pageHtml[f] || fs.readFileSync(path.join(PUBLIC_DIR, f), 'utf8');
  for (const term of RETIRED_URGENT_CTA_STRINGS) {
    if (html.includes(term)) {
      fail(`${f}: retired urgent CTA wording "${term}" still present`);
      retiredOk = false;
    }
  }
}
if (retiredOk) pass('No retired urgent CTA wording (Request a Callback / Request My Callback / Request Planned Transport / Call for Recovery etc.) found anywhere.');

// "Call Me Back" used consistently for the urgent callback CTA
let callMeBackOk = true;
for (const f of CALLBACK_FORM_PAGES) {
  if (!pageHtml[f].includes('Call Me Back')) {
    fail(`${f}: does not contain "Call Me Back" wording`);
    callMeBackOk = false;
  }
}
if (callMeBackOk) pass('"Call Me Back" wording is present consistently across the hero, callback CTAs and forms on every callback-form page.');

// Callback form exact copy
const homeCallbackSection = homeHtml.match(/<section id="callback"[\s\S]*?<\/section>/);
if (!homeCallbackSection || !homeCallbackSection[0].includes('Want Us to Call You?') || !homeCallbackSection[0].includes('Enter your name and number.')) {
  fail('index.html: callback section heading/copy does not match "Want Us to Call You?" / "Enter your name and number."');
} else {
  pass('Callback section heading and copy match spec ("Want Us to Call You?" / "Enter your name and number.").');
}
if (!homeCallbackSection || !homeCallbackSection[0].includes("We'll only use your details to call you about recovery.")) {
  fail('index.html: callback section is missing the required privacy note');
} else {
  pass('Callback section privacy note matches spec exactly.');
}

// Homepage section order: hero, trust-strip, callback, services
const homeSectionOrder = [...homeHtml.matchAll(/id="(hero|callback|services)"|class="hero"|class="trust-strip"/g)];
const heroIdx = homeHtml.indexOf('class="hero"');
const trustIdx = homeHtml.indexOf('class="trust-strip"');
const callbackIdx = homeHtml.indexOf('id="callback"');
const servicesIdx = homeHtml.indexOf('id="services"');
if (heroIdx > -1 && trustIdx > -1 && callbackIdx > -1 && servicesIdx > -1 && heroIdx < trustIdx && trustIdx < callbackIdx && callbackIdx < servicesIdx) {
  pass('Homepage section order is Hero -> Trust strip -> Callback -> Services, as required.');
} else {
  fail(`Homepage section order is incorrect (hero=${heroIdx}, trust=${trustIdx}, callback=${callbackIdx}, services=${servicesIdx})`);
}

// WhatsApp label simplified to "WhatsApp" (not "WhatsApp Us") in CTA button groups
if (/>WhatsApp Us</.test(homeHtml)) {
  fail('index.html: found "WhatsApp Us" — CTA button label should be simplified to "WhatsApp"');
} else {
  pass('WhatsApp CTA buttons use the simplified "WhatsApp" label (not "WhatsApp Us").');
}

// Footer: single "View Recovery Areas" link, no per-location list, WhatsApp present
const footerAreasMatch = homeHtml.match(/<h3>Areas<\/h3>\s*<ul>([\s\S]*?)<\/ul>/);
if (!footerAreasMatch || !footerAreasMatch[1].includes('View Recovery Areas') || (footerAreasMatch[1].match(/<li>/g) || []).length !== 1) {
  fail('index.html: footer Areas column is not simplified to a single "View Recovery Areas" link');
} else {
  pass('Footer Areas column is simplified to a single "View Recovery Areas" link.');
}
if (!homeHtml.includes('footer-contact') || !/WhatsApp:\s*<a[^>]*wa\.me/.test(homeHtml)) {
  fail('index.html: footer is missing a WhatsApp contact link');
} else {
  pass('Footer includes a WhatsApp contact link.');
}

// Booking/Plan Transport navigation label renamed consistently, URL unchanged
if (!homeHtml.includes('<a href="/booking">Plan Transport</a>')) {
  fail('index.html: footer "Plan Transport" link (pointing to /booking) not found with the renamed label');
} else {
  pass('Footer navigation label renamed to "Plan Transport", linking to the unchanged /booking URL.');
}
if (!bookingHtml.includes('>Plan Transport<') /* breadcrumb */) {
  fail('booking.html: breadcrumb label was not renamed to "Plan Transport"');
} else {
  pass('booking.html breadcrumb label renamed to "Plan Transport".');
}

// Telegram message header text
if (!workerSrc.includes('CALL ME BACK LEAD')) {
  fail('worker/index.js: callback Telegram message header is not "CALL ME BACK LEAD"');
} else {
  pass('worker/index.js callback Telegram message header is "CALL ME BACK LEAD".');
}
if (workerSrc.includes('NEW CALLBACK LEAD')) {
  fail('worker/index.js: retired "NEW CALLBACK LEAD" header text still present');
}
if (!workerSrc.includes('NEW PLANNED TRANSPORT REQUEST')) {
  fail('worker/index.js: planned transport Telegram header text must remain unchanged');
} else {
  pass('worker/index.js planned transport Telegram message format is unchanged.');
}

// Form success/error copy
const formsSrc = fs.readFileSync(path.join(PUBLIC_DIR, 'assets', 'js', 'forms.js'), 'utf8');
if (!formsSrc.includes('Got it.') || !formsSrc.includes("We'll call you on the number provided.")) {
  fail('forms.js: callback success message does not match "Got it." / "We\'ll call you on the number provided."');
} else {
  pass('forms.js callback success message matches spec ("Got it." / "We\'ll call you on the number provided.").');
}
if (!formsSrc.includes("Couldn't send it.")) {
  fail('forms.js: callback error message does not match "Couldn\'t send it."');
} else {
  pass('forms.js callback error message matches spec ("Couldn\'t send it.").');
}
if (/\d{1,2}(:\d{2})?\s*(am|pm|minutes|hours)\b/i.test(formsSrc.match(/Got it[\s\S]{0,200}/)?.[0] || '')) {
  fail('forms.js: callback success message appears to promise a specific callback time');
} else {
  pass('forms.js callback success message does not promise an exact callback time.');
}

// Sticky bar accessible name includes business name + number
if (!homeHtml.includes('aria-label="Call Nottingham Car Recovery on 07488 813738"')) {
  fail('index.html: sticky/desktop call button is missing the required accessible name "Call Nottingham Car Recovery on 07488 813738"');
} else {
  pass('Call button accessible name is "Call Nottingham Car Recovery on 07488 813738".');
}

// Planned transport separation: booking page must not offer "Call Me Back"
// as its form action, and the callback-form pages must not offer planned
// transport fields (already covered by the "forbidden field names" check).
if (bookingHtml.includes('data-form-name="callback"')) {
  fail('booking.html: unexpectedly contains a callback-type form');
} else {
  pass('booking.html contains only the planned_transport form, not the callback form.');
}

// ------------------------------------------------------------------
// Phase 1 organic lead-expansion cluster + operator network checks
// ------------------------------------------------------------------

// The 4 urgent lead-expansion pages already got their callback-form
// checks via CALLBACK_FORM_PAGES above. Confirm each also shows the
// phone number, 24/7 availability and both Call/WhatsApp buttons near
// the top (via the shared Need Recovery band + hero).
let leadPagesTopOk = true;
for (const f of LEAD_EXPANSION_PAGES) {
  const html = pageHtml[f];
  if (!/tel:07488813738/.test(html) || !/https:\/\/wa\.me\/447488813738/.test(html)) {
    fail(`${f}: missing visible call/WhatsApp links near the top`);
    leadPagesTopOk = false;
  }
  if (!/24\/7|24 hours a day/i.test(html)) {
    fail(`${f}: missing 24/7 availability wording`);
    leadPagesTopOk = false;
  }
}
if (leadPagesTopOk) pass('All 4 urgent lead-expansion pages show phone, WhatsApp and 24/7 availability near the top.');

// Long-distance page: planned-transport hierarchy, not urgent
const longDistanceHtml = pageHtml['long-distance-car-transport-nottingham.html'];
if (!longDistanceHtml) {
  fail('long-distance-car-transport-nottingham.html not found');
} else {
  // Scoped to <main> — the shared sitewide header/mobile-menu
  // legitimately says "Call Me Back" on every page, including this one.
  const longDistanceMain = (longDistanceHtml.match(/<main[^>]*>[\s\S]*?<\/main>/) || [longDistanceHtml])[0];
  if (longDistanceMain.includes('Call Me Back')) {
    fail('long-distance-car-transport-nottingham.html: must not use "Call Me Back" within the page content — this is a planned-transport page');
  } else {
    pass('long-distance-car-transport-nottingham.html page content does not use "Call Me Back" wording.');
  }
  if (!longDistanceHtml.includes('>Plan Transport<') || !/href="\/booking"[^>]*>[\s\S]{0,80}Plan Transport/.test(longDistanceHtml)) {
    fail('long-distance-car-transport-nottingham.html: missing a "Plan Transport" action linking to /booking');
  } else {
    pass('long-distance-car-transport-nottingham.html has a "Plan Transport" action linking to /booking.');
  }
  if (longDistanceHtml.includes('id="callback"')) {
    fail('long-distance-car-transport-nottingham.html: must not embed the two-field callback form');
  } else {
    pass('long-distance-car-transport-nottingham.html does not embed the two-field callback form.');
  }
}

// Operator page: separation from the customer journey
const operatorHtml = pageHtml['recovery-driver-work-nottingham.html'];
if (!operatorHtml) {
  fail('recovery-driver-work-nottingham.html not found');
} else {
  const operatorMain = (operatorHtml.match(/<main[^>]*>[\s\S]*?<\/main>/) || [operatorHtml])[0];
  if (/data-cta="call"|data-cta="whatsapp"|Call Me Back/.test(operatorMain)) {
    fail('recovery-driver-work-nottingham.html: page content must not include Call/WhatsApp/Call Me Back actions (must stay separate from the customer journey)');
  } else {
    pass('Operator page content has no Call/WhatsApp/Call Me Back actions — kept separate from the customer journey.');
  }
  if (!operatorHtml.includes('data-form-name="operator_interest"')) {
    fail('recovery-driver-work-nottingham.html: operator_interest form not found');
  } else {
    pass('Operator page includes the operator_interest form.');
  }
  const opFieldNames = ['name', 'phone', 'email', 'basePostcode', 'areasCovered', 'ownVehicle', 'experience'];
  const opNotRequired = opFieldNames.filter((n) => {
    const inputMatch = operatorHtml.match(new RegExp(`<(?:input|select|textarea)[^>]*name="${n}"[^>]*>`));
    return !inputMatch || !/required/.test(inputMatch[0]);
  });
  if (opNotRequired.length) {
    fail(`recovery-driver-work-nottingham.html: expected required operator fields not marked required: ${opNotRequired.join(', ')}`);
  } else {
    pass('Operator form required fields (name, phone, email, basePostcode, areasCovered, ownVehicle, experience) are all marked required.');
  }
  const opOptionalFieldNames = ['business', 'vehicleType', 'workingStatus'];
  const opWronglyRequired = opOptionalFieldNames.filter((n) => {
    const inputMatch = operatorHtml.match(new RegExp(`<(?:input|select|textarea)[^>]*name="${n}"[^>]*>`));
    return inputMatch && /required/.test(inputMatch[0]);
  });
  if (opWronglyRequired.length) {
    fail(`recovery-driver-work-nottingham.html: fields expected to be optional are marked required: ${opWronglyRequired.join(', ')}`);
  } else {
    pass('Operator form optional fields (business, vehicleType, workingStatus) are correctly not required.');
  }
  const opCheckboxCount = (operatorHtml.match(/type="checkbox"/g) || []).length;
  const opHasAckCheckbox = /type="checkbox"[^>]*name="operatorAcknowledgement"|name="operatorAcknowledgement"[^>]*type="checkbox"/.test(operatorHtml);
  if (opCheckboxCount !== 1 || !opHasAckCheckbox) {
    fail(`recovery-driver-work-nottingham.html: expected exactly one checkbox named "operatorAcknowledgement", found ${opCheckboxCount} checkbox(es), acknowledgement present: ${opHasAckCheckbox}`);
  } else {
    pass('Operator form has exactly one consolidated required checkbox ("operatorAcknowledgement").');
  }
  if (operatorHtml.includes('name="accuracyConfirmed"') || operatorHtml.includes('name="noGuaranteeAck"') || operatorHtml.includes('name="contactConsent"')) {
    fail('recovery-driver-work-nottingham.html: retired individual checkbox fields (accuracyConfirmed/noGuaranteeAck/contactConsent) are still present');
  } else {
    pass('Retired individual operator checkbox fields are fully removed.');
  }
  if (!operatorHtml.includes('Register My Interest')) {
    fail('recovery-driver-work-nottingham.html: submit button is not "Register My Interest"');
  } else {
    pass('Operator form submit button is "Register My Interest".');
  }
  // Document-upload fields must not exist on the initial form.
  if (/type="file"/.test(operatorHtml)) {
    fail('recovery-driver-work-nottingham.html: contains a file upload field — documents must not be collected at this stage');
  } else {
    pass('Operator form has no file-upload fields.');
  }
  // No JobPosting schema, ever.
  if (operatorHtml.includes('"@type":"JobPosting"')) {
    fail('recovery-driver-work-nottingham.html: JobPosting schema must not be used');
  } else {
    pass('Operator page does not use JobPosting schema.');
  }
}

// No JobPosting schema anywhere in the project
let noJobPostingAnywhere = true;
for (const f of REQUIRED_PAGES) {
  if (pageHtml[f].includes('"@type":"JobPosting"')) {
    fail(`${f}: JobPosting schema must not be used anywhere on this site`);
    noJobPostingAnywhere = false;
  }
}
if (noJobPostingAnywhere) pass('No JobPosting schema found anywhere on the site.');

// No salary/income/guarantee wording anywhere (spirit check, sitewide)
const OPERATOR_FORBIDDEN_TERMS = [
  'salary', 'day rate', 'minimum income', 'guaranteed leads', 'guaranteed jobs',
  'constant work', 'employment benefits', 'paid training', 'police work', 'insurer work'
];
let operatorWordingOk = true;
for (const f of REQUIRED_PAGES) {
  const lower = pageHtml[f].toLowerCase();
  for (const term of OPERATOR_FORBIDDEN_TERMS) {
    if (lower.includes(term)) {
      fail(`${f}: contains forbidden operator-recruitment wording "${term}"`);
      operatorWordingOk = false;
    }
  }
}
if (operatorWordingOk) pass('No salary, day-rate, guaranteed-work or similar forbidden recruitment wording found anywhere.');

// Footer + About page link to the operator page
if (!homeHtml.includes('<a href="/recovery-driver-work-nottingham">Recovery Operator Network</a>')) {
  fail('index.html: footer is missing the "Recovery Operator Network" link');
} else {
  pass('Footer includes the "Recovery Operator Network" link.');
}
if (!pageHtml['about.html'].includes('/recovery-driver-work-nottingham')) {
  fail('about.html: missing a contextual link to the operator network page');
} else {
  pass('About page includes a contextual link to the operator network page.');
}
// Must not sit beside the urgent Call/WhatsApp/Call Me Back row — check
// it is not inside the same .btn-row as those actions anywhere.
const btnRowsWithOperatorLink = [...homeHtml.matchAll(/<div class="btn-row[^"]*">[\s\S]*?<\/div>/g)].filter((m) =>
  m[0].includes('recovery-driver-work-nottingham')
);
if (btnRowsWithOperatorLink.length) {
  fail('index.html: operator network link must not appear inside a Call/WhatsApp/Call Me Back button row');
} else {
  pass('Operator network link does not appear beside Call/WhatsApp/Call Me Back actions.');
}

// Privacy page covers operator applications
if (!pageHtml['privacy.html'].includes('Recovery Operator Network Applications')) {
  fail('privacy.html: missing the "Recovery Operator Network Applications" section');
} else {
  pass('Privacy page includes an operator-network applications section.');
}

// Operator Telegram message is distinct from the other two formats
if (!workerSrc.includes('NEW RECOVERY OPERATOR INTEREST')) {
  fail('worker/index.js: operator Telegram message header "NEW RECOVERY OPERATOR INTEREST" not found');
} else {
  pass('worker/index.js operator Telegram message header is "NEW RECOVERY OPERATOR INTEREST".');
}
const telegramHeaders = ['CALL ME BACK LEAD', 'NEW PLANNED TRANSPORT REQUEST', 'NEW RECOVERY OPERATOR INTEREST'];
const uniqueHeaders = new Set(telegramHeaders.filter((h) => workerSrc.includes(h)));
if (uniqueHeaders.size !== 3) {
  fail('worker/index.js: the three Telegram message headers are not all present and distinct');
} else {
  pass('All three Telegram message formats (callback, planned transport, operator) are present and distinct.');
}

// Operator server-side validation matches the form (required fields)
const operatorValidationFields = ['clean.email', 'clean.basePostcode', 'clean.areasCovered', 'clean.ownVehicle', 'clean.experience', 'clean.operatorAcknowledgement'];
const missingOperatorValidation = operatorValidationFields.filter((f2) => !workerSrc.includes(f2));
if (missingOperatorValidation.length) {
  fail(`worker/index.js: operator form validation appears incomplete, missing checks for: ${missingOperatorValidation.join(', ')}`);
} else {
  pass('worker/index.js validates all required operator_interest fields (including the consolidated acknowledgement checkbox).');
}
if (workerSrc.includes('accuracyConfirmed') || workerSrc.includes('noGuaranteeAck') || workerSrc.includes('contactConsent')) {
  fail('worker/index.js: retired individual checkbox field names (accuracyConfirmed/noGuaranteeAck/contactConsent) are still referenced');
} else {
  pass('worker/index.js has no lingering references to the retired individual checkbox fields.');
}

// ------------------------------------------------------------------
// Strict legacy phone-number check (business phone migration pass)
// ------------------------------------------------------------------
// Scans the whole working project for the retired number. This file
// (gen/validate.js) is excluded from the scan since it must legitimately
// contain the legacy patterns as literal strings in order to check for
// their absence elsewhere — that is not a "live" reference. Binary
// assets, .git internals and .zip archives are also excluded.
const PROJECT_ROOT = path.join(__dirname, '..');
const LEGACY_NUMBER_PATTERNS = [
  '07865 449983',
  '07865449983',
  '447865449983',
  'wa.me/447865449983',
  'tel:07865449983'
];
const BINARY_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.zip', '.woff', '.woff2', '.ttf']);

function walkProjectFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkProjectFiles(full));
    } else if (!BINARY_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

const legacyScanFiles = walkProjectFiles(PROJECT_ROOT).filter((f) => f !== path.join(__dirname, 'validate.js'));
let legacyIssues = [];
for (const filePath of legacyScanFiles) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    continue;
  }
  for (const pattern of LEGACY_NUMBER_PATTERNS) {
    if (content.includes(pattern)) {
      legacyIssues.push(`${path.relative(PROJECT_ROOT, filePath)} contains legacy pattern "${pattern}"`);
    }
  }
}
if (legacyIssues.length) {
  legacyIssues.forEach((m) => fail('Legacy phone number found: ' + m));
} else {
  pass(
    'Strict legacy-number check: zero occurrences of the old number ' +
      '(07865 449983 / 07865449983 / 447865449983 / wa.me/447865449983 / tel:07865449983) ' +
      `found anywhere in the ${legacyScanFiles.length} scanned project files.`
  );
}

// New number present in the expected source and generated locations
if (!configSrc.includes('07488 813738') || !configSrc.includes('tel:07488813738') || !configSrc.includes('447488813738')) {
  fail('config/site-config.js does not contain the new phone/WhatsApp values');
} else {
  pass('config/site-config.js contains the new phone/WhatsApp values.');
}
if (!homeHtml.includes('tel:07488813738') || !homeHtml.includes('https://wa.me/447488813738')) {
  fail('index.html does not contain the new tel:/wa.me links');
} else {
  pass('index.html contains the new tel:/wa.me links.');
}

// ------------------------------------------------------------------
// Strict legacy-domain check (canonical hostname migration pass)
// ------------------------------------------------------------------
// Same exclusion rules as the phone-number scan above: this file is
// excluded because it must legitimately contain the retired hostname
// as a literal string in order to check for its absence elsewhere.
const LEGACY_DOMAIN = 'https://www.nottingham-car-recovery.co.uk';
const legacyDomainIssues = [];
for (const filePath of legacyScanFiles) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    continue;
  }
  if (content.includes(LEGACY_DOMAIN)) {
    legacyDomainIssues.push(`${path.relative(PROJECT_ROOT, filePath)} contains the retired www hostname`);
  }
}
if (legacyDomainIssues.length) {
  legacyDomainIssues.forEach((m) => fail('Legacy domain found: ' + m));
} else {
  pass(
    `Strict legacy-domain check: zero occurrences of "${LEGACY_DOMAIN}" ` +
      `found anywhere in the ${legacyScanFiles.length} scanned project files.`
  );
}

// New root domain present in canonical, og:url, sitemap, robots.txt and JSON-LD
const NEW_DOMAIN = 'https://nottingham-car-recovery.co.uk';
if (!homeHtml.includes(`<link rel="canonical" href="${NEW_DOMAIN}/">`)) {
  fail('index.html canonical does not use the new root domain');
} else {
  pass('index.html canonical uses the new root domain.');
}
if (!homeHtml.includes(`<meta property="og:url" content="${NEW_DOMAIN}/">`)) {
  fail('index.html og:url does not use the new root domain');
} else {
  pass('index.html og:url uses the new root domain.');
}
if (!homeHtml.includes(`"url":"${NEW_DOMAIN}"`) && !homeHtml.includes(`"@id":"${NEW_DOMAIN}/#organization"`)) {
  fail('index.html JSON-LD does not reference the new root domain');
} else {
  pass('index.html JSON-LD (Organization/WebSite) references the new root domain.');
}
if (!robots.includes(`Sitemap: ${NEW_DOMAIN}/sitemap.xml`)) {
  fail('robots.txt does not reference the new root domain sitemap');
} else {
  pass('robots.txt references the new root domain sitemap.');
}
if (!sitemap.includes(`<loc>${NEW_DOMAIN}/</loc>`)) {
  fail('sitemap.xml does not contain the new root domain homepage URL');
} else {
  pass('sitemap.xml contains the new root domain homepage URL.');
}

// ---- Report ----
console.log(`\n=== VALIDATION REPORT ===`);
console.log(`Passed checks: ${passes.length}`);
passes.forEach((p) => console.log('  PASS - ' + p));
console.log(`\nIssues found: ${issues.length}`);
issues.forEach((i) => console.log('  FAIL - ' + i));
console.log('');

process.exitCode = issues.length ? 1 : 0;
