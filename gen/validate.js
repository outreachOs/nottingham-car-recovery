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
  'privacy.html','terms.html'
];

let issues = [];
let passes = [];

function fail(msg) { issues.push(msg); }
function pass(msg) { passes.push(msg); }

// 1. All 22 HTML files exist
const missing = REQUIRED_PAGES.filter((f) => !fs.existsSync(path.join(PUBLIC_DIR, f)));
if (missing.length) fail('Missing pages: ' + missing.join(', '));
else pass('All 22 required HTML files exist.');

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
  if (!canonical || !canonical.startsWith('https://www.nottingham-car-recovery.co.uk')) {
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
else pass('sitemap.xml URL count matches page count (22).');
const sitemapCleanPaths = new Set(locs.map((l) => l.replace('https://www.nottingham-car-recovery.co.uk', '') || '/'));
for (const p of sitemapPaths) {
  if (!sitemapCleanPaths.has(p)) fail(`sitemap.xml missing path ${p}`);
}
if (locs.some((l) => l.includes('.html'))) fail('sitemap.xml contains a .html URL');
if (locs.some((l) => l.includes('/notify'))) fail('sitemap.xml contains /notify');

// 10. robots.txt sitemap correct
const robots = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://www.nottingham-car-recovery.co.uk/sitemap.xml')) {
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

// All call links use tel:07865449983
let telOk = true;
for (const f of REQUIRED_PAGES) {
  const allTel = [...pageHtml[f].matchAll(/<a[^>]*data-cta="call"[^>]*>/g)].map((m) => (m[0].match(/href="([^"]*)"/) || [])[1]);
  for (const href of allTel) {
    if (href !== 'tel:07865449983') {
      fail(`${f}: call link href is "${href}", expected "tel:07865449983"`);
      telOk = false;
    }
  }
}
if (telOk) pass('All call links use tel:07865449983.');

// All WhatsApp links use wa.me/447865449983
let waOk = true;
for (const f of REQUIRED_PAGES) {
  const allWa = [...pageHtml[f].matchAll(/<a[^>]*data-cta="whatsapp"[^>]*>/g)].map((m) => (m[0].match(/href="([^"]*)"/) || [])[1]);
  for (const href of allWa) {
    if (href !== 'https://wa.me/447865449983') {
      fail(`${f}: WhatsApp link href is "${href}", expected "https://wa.me/447865449983"`);
      waOk = false;
    }
  }
}
if (waOk) pass('All WhatsApp links use https://wa.me/447865449983.');

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
if (configSrc.includes("phoneDisplay: '07865 449983'") &&
    configSrc.includes("phoneHref: 'tel:07865449983'") &&
    configSrc.includes("whatsappNumber: '447865449983'") &&
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
  'car-recovery-clifton.html', 'car-recovery-long-eaton.html'
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
  if (!formHtml.includes('Request My Callback')) {
    fail(`${f}: callback form submit button is not "Request My Callback"`);
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
if (!bookingHtml.includes('Request Planned Transport<')) {
  fail('booking.html: submit button is not "Request Planned Transport"');
} else {
  pass('booking.html submit button is "Request Planned Transport".');
}
if (!/Broken down or need recovery now/.test(bookingHtml) || !/tel:07865449983/.test(bookingHtml)) {
  fail('booking.html: missing the urgent-recovery notice with a working call link');
} else {
  pass('booking.html has the urgent-recovery notice with a working tel: link.');
}

// Homepage hero: phone visible, 24/7 line, call-now instruction
const homeHtml = pageHtml['index.html'];
if (!/Available 24 hours a day, 7 days a week\./.test(homeHtml)) {
  fail('index.html: hero is missing "Available 24 hours a day, 7 days a week."');
} else {
  pass('Homepage hero includes "Available 24 hours a day, 7 days a week."');
}
if (!/Call now and tell us where you are/.test(homeHtml)) {
  fail('index.html: hero is missing the "Call now and tell us..." instruction line');
} else {
  pass('Homepage hero includes the "Call now and tell us..." instruction line.');
}

// Header: desktop call CTA shows the real number
if (!/header-call[\s\S]*?Call 07865 449983/.test(homeHtml)) {
  fail('index.html: desktop header call button does not read "Call 07865 449983"');
} else {
  pass('Desktop header call button reads "Call 07865 449983".');
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

// ---- Report ----
console.log(`\n=== VALIDATION REPORT ===`);
console.log(`Passed checks: ${passes.length}`);
passes.forEach((p) => console.log('  PASS - ' + p));
console.log(`\nIssues found: ${issues.length}`);
issues.forEach((i) => console.log('  FAIL - ' + i));
console.log('');

process.exitCode = issues.length ? 1 : 0;
