/*!
 * Nottingham Car Recovery — Cloudflare Worker
 * ----------------------------------------------------------------
 * Single architecture, single handler. Serves the static site via
 * the ASSETS binding and exposes exactly one API route:
 *
 *   POST /notify   — receives the callback / booking / contact
 *                    forms and forwards a plain-text summary to a
 *                    Telegram chat via the Bot API.
 *
 * Accepted request bodies (see readPayload() below):
 *   - application/json                  — parsed with JSON.parse
 *   - application/x-www-form-urlencoded — parsed with URLSearchParams
 *   - multipart/form-data               — parsed with request.formData();
 *     only plain string field values are kept, any uploaded files are
 *     ignored (this endpoint does not accept file uploads)
 *
 * Required secrets (set with `wrangler secret put <NAME>`):
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 *
 * No secrets are hard-coded. Internal errors are never exposed to
 * the client — only generic, safe messages are returned.
 * ----------------------------------------------------------------
 */

const MAX_BODY_BYTES = 20_000; // reasonable upper bound for a form submission
const MAX_FIELD_LENGTH = 3000;
const MAX_SHORT_FIELD_LENGTH = 200;

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=()',
  'X-Frame-Options': 'DENY'
};

// Fields we accept from any of the three forms. Unknown fields are ignored.
const KNOWN_FIELDS = [
  'form_name',
  'name',
  'phone',
  'email',
  'help',
  'area',
  'message',
  'vehicle_make_model',
  'registration',
  'collection_address',
  'destination',
  'preferred_date',
  'preferred_time',
  'starts',
  'rolls',
  'steers',
  'brakes',
  'keys_available',
  'damage_notes',
  'access_restrictions',
  'additional_notes',
  'consent',
  'source_page',
  'page_title',
  'page_url',
  'referrer',
  'timestamp',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'msclkid'
];

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}

function jsonResponse(body, status) {
  return withSecurityHeaders(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    })
  );
}

function htmlConfirmation(status, heading, message) {
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${heading} | Nottingham Car Recovery</title>
<meta name="robots" content="noindex, nofollow">
<style>
  body{font-family:system-ui,sans-serif;background:#080e12;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:2rem;}
  main{max-width:32rem;text-align:center;}
  h1{color:#ffb300;font-size:1.5rem;}
  a{color:#ffb300;}
</style>
</head>
<body>
<main>
  <h1>${heading}</h1>
  <p>${message}</p>
  <p><a href="/">Return to the homepage</a></p>
</main>
</body>
</html>`;
  return withSecurityHeaders(
    new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  );
}

function wantsJson(request) {
  const accept = request.headers.get('Accept') || '';
  const contentType = request.headers.get('Content-Type') || '';
  return accept.includes('application/json') || contentType.includes('application/json');
}

function sanitizeText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // strip control chars
    .trim()
    .slice(0, maxLength);
}

function tooLargeError() {
  const err = new Error('Payload too large');
  err.status = 413;
  return err;
}

// multipart/form-data cannot be read as text and re-parsed with
// URLSearchParams — that silently produces garbage for file parts and
// binary-safe fields. request.formData() is the correct, built-in way
// to parse it. Only plain string field values are kept; any File
// entries (uploads) are ignored, since this endpoint does not accept
// file uploads.
async function readMultipart(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch (e) {
    const err = new Error('Invalid multipart form data');
    err.status = 400;
    throw err;
  }

  const data = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      data[key] = value;
    }
    // Non-string entries are File objects (uploads) and are ignored.
  }
  return data;
}

// application/json and application/x-www-form-urlencoded (and any
// unrecognised content type, as a best-effort fallback) are read as
// text once, and the existing size limit is enforced against that
// text before parsing.
async function readTextBody(request, contentType) {
  const raw = await request.text();

  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    throw tooLargeError();
  }

  if (contentType.includes('application/json')) {
    try {
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      const err = new Error('Invalid JSON body');
      err.status = 400;
      throw err;
    }
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(raw).entries());
  }

  // Best-effort fallback for unlabeled bodies: try JSON, then fall
  // back to URL-encoded parsing.
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return Object.fromEntries(new URLSearchParams(raw).entries());
    }
  }

  return {};
}

async function readPayload(request) {
  const contentType = (request.headers.get('Content-Type') || '').toLowerCase();

  if (contentType.includes('multipart/form-data')) {
    return readMultipart(request);
  }

  return readTextBody(request, contentType);
}

function buildCleanFields(data) {
  const clean = {};
  for (const key of KNOWN_FIELDS) {
    const isLong = key === 'message' || key === 'damage_notes' || key === 'additional_notes' || key === 'access_restrictions';
    clean[key] = sanitizeText(data[key], isLong ? MAX_FIELD_LENGTH : MAX_SHORT_FIELD_LENGTH);
  }
  return clean;
}

function validate(clean, honeypotValue) {
  const errors = [];

  if (honeypotValue) {
    // Spam — handled by caller as a silent success, but flag here too.
    return { spam: true, errors: [] };
  }

  if (!clean.name) errors.push('Name is required.');
  if (!clean.phone && !clean.email) errors.push('A phone number or email address is required.');
  if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
    errors.push('Enter a valid email address.');
  }
  if (clean.phone && !/^[0-9+()\s-]{7,20}$/.test(clean.phone)) {
    errors.push('Enter a valid phone number.');
  }

  return { spam: false, errors };
}

function formLabel(formName) {
  const labels = {
    callback: 'Homepage Callback Request',
    booking: 'Booking / Recovery Request',
    contact: 'Contact Form Enquiry'
  };
  return labels[formName] || 'Website Enquiry';
}

function buildTelegramMessage(clean) {
  const lines = [];
  lines.push(`New enquiry: ${formLabel(clean.form_name)}`);
  lines.push('');
  lines.push(`Source page: ${clean.source_page || 'unknown'}`);
  if (clean.page_title) lines.push(`Page title: ${clean.page_title}`);
  lines.push('');
  lines.push('Contact details');
  if (clean.name) lines.push(`Name: ${clean.name}`);
  if (clean.phone) lines.push(`Phone: ${clean.phone}`);
  if (clean.email) lines.push(`Email: ${clean.email}`);

  if (clean.help || clean.area) {
    lines.push('');
    lines.push('Enquiry');
    if (clean.help) lines.push(`Service needed: ${clean.help}`);
    if (clean.area) lines.push(`Collection area: ${clean.area}`);
  }

  if (clean.vehicle_make_model || clean.registration) {
    lines.push('');
    lines.push('Vehicle');
    if (clean.vehicle_make_model) lines.push(`Make/model: ${clean.vehicle_make_model}`);
    if (clean.registration) lines.push(`Registration: ${clean.registration}`);
  }

  if (clean.collection_address || clean.destination) {
    lines.push('');
    lines.push('Locations');
    if (clean.collection_address) lines.push(`Collection point: ${clean.collection_address}`);
    if (clean.destination) lines.push(`Destination: ${clean.destination}`);
  }

  if (clean.preferred_date || clean.preferred_time) {
    lines.push('');
    lines.push('Preferred timing');
    if (clean.preferred_date) lines.push(`Date: ${clean.preferred_date}`);
    if (clean.preferred_time) lines.push(`Time: ${clean.preferred_time}`);
  }

  if (clean.starts || clean.rolls || clean.steers || clean.brakes || clean.keys_available) {
    lines.push('');
    lines.push('Vehicle condition');
    if (clean.starts) lines.push(`Starts: ${clean.starts}`);
    if (clean.rolls) lines.push(`Rolls: ${clean.rolls}`);
    if (clean.steers) lines.push(`Steers: ${clean.steers}`);
    if (clean.brakes) lines.push(`Brakes: ${clean.brakes}`);
    if (clean.keys_available) lines.push(`Keys available: ${clean.keys_available}`);
  }

  if (clean.damage_notes) lines.push(`\nDamage notes: ${clean.damage_notes}`);
  if (clean.access_restrictions) lines.push(`Access restrictions: ${clean.access_restrictions}`);
  if (clean.message) lines.push(`\nMessage: ${clean.message}`);
  if (clean.additional_notes) lines.push(`Additional notes: ${clean.additional_notes}`);

  const tracking = [];
  if (clean.utm_source) tracking.push(`utm_source=${clean.utm_source}`);
  if (clean.utm_medium) tracking.push(`utm_medium=${clean.utm_medium}`);
  if (clean.utm_campaign) tracking.push(`utm_campaign=${clean.utm_campaign}`);
  if (clean.utm_term) tracking.push(`utm_term=${clean.utm_term}`);
  if (clean.utm_content) tracking.push(`utm_content=${clean.utm_content}`);
  if (clean.gclid) tracking.push(`gclid=${clean.gclid}`);
  if (clean.msclkid) tracking.push(`msclkid=${clean.msclkid}`);
  if (clean.referrer) tracking.push(`referrer=${clean.referrer}`);
  if (tracking.length) {
    lines.push('');
    lines.push('Tracking');
    lines.push(tracking.join('\n'));
  }

  lines.push('');
  lines.push(`Submitted: ${clean.timestamp || new Date().toISOString()}`);

  // Plain text — no Markdown/HTML parse mode is used, so no special
  // Telegram formatting characters need to be escaped.
  return lines.join('\n').slice(0, 4096);
}

async function sendTelegramMessage(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    const err = new Error('Notification channel is not configured.');
    err.status = 503;
    throw err;
  }

  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text
    })
  });

  if (!response.ok) {
    const err = new Error('Telegram API request failed.');
    err.status = 502;
    throw err;
  }
}

async function handleNotify(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ success: false, message: 'Method not allowed.' }, 405);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength && contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ success: false, message: 'Request is too large.' }, 413);
  }

  let data;
  try {
    data = await readPayload(request);
  } catch (err) {
    return jsonResponse({ success: false, message: 'Your request could not be read. Please try again.' }, err.status || 400);
  }

  const clean = buildCleanFields(data);
  const honeypotValue = sanitizeText(data.website, MAX_SHORT_FIELD_LENGTH);
  const { spam, errors } = validate(clean, honeypotValue);

  if (spam) {
    // Reject quietly: respond as if successful so bots gain no signal,
    // but never contact Telegram.
    return jsonResponse({ success: true, message: 'Thank you — your request has been received.' }, 200);
  }

  if (errors.length) {
    return jsonResponse({ success: false, message: errors.join(' ') }, 422);
  }

  try {
    await sendTelegramMessage(env, buildTelegramMessage(clean));
  } catch (err) {
    // Never expose internal error detail to the client.
    return jsonResponse(
      { success: false, message: 'We could not send your request right now. Please call or WhatsApp us directly.' },
      err.status && err.status < 500 ? err.status : 502
    );
  }

  if (!wantsJson(request)) {
    return htmlConfirmation(
      200,
      'Thanks — your request has been received',
      'We will contact you shortly. This is a request only and is not confirmed until the vehicle, collection point, destination, availability and price have been agreed.'
    );
  }

  return jsonResponse(
    { success: true, message: 'Thank you — your request has been received.' },
    200
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/notify') {
      try {
        return await handleNotify(request, env);
      } catch (err) {
        return jsonResponse({ success: false, message: 'Something went wrong. Please try again.' }, 500);
      }
    }

    // Everything else is served from the static assets bundle.
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      return withSecurityHeaders(response);
    }

    return jsonResponse({ success: false, message: 'Not found.' }, 404);
  }
};
