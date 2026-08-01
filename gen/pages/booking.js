'use strict';

const C = require('../components');

function build() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Booking', href: '/booking' }
  ];

  // Booking is the planned-transport route, not the urgent recovery
  // route — so its hero does not use the standard call/WhatsApp/callback
  // ctaButtons() row. It gets its own H1 and a bespoke urgent-notice
  // band directing anyone who needs recovery now to call instead.
  const hero = `<section class="hero hero--page hero--plain">
  <div class="container">
    <div class="hero__inner">
      <span class="badge-pill">Planned Transport</span>
      <h1>Request Planned Vehicle Transport</h1>
      <p class="lead">For planned vehicle transport, auction collection, non-runner collection, garage appointments and advance vehicle collection and delivery across Nottingham and surrounding areas.</p>
    </div>
  </div>
</section>`;

  const urgentNotice = `<section class="section-tight">
  <div class="container">
    <div class="safe-panel__notice" style="max-width:44rem;">
      <p style="font-size:1rem;"><strong>Broken down or need recovery now?</strong><br>Call <a href="${C.SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" style="font-weight:700;">${C.escapeHtml(C.SITE_CONFIG.phoneDisplay)}</a> instead.</p>
      <div class="btn-row" style="margin-top:1rem;">
        <a href="${C.SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary">${C.icon('phone')} Call ${C.escapeHtml(C.SITE_CONFIG.phoneDisplay)}</a>
        <a href="${C.SITE_CONFIG.whatsappHref}" target="_blank" rel="noopener noreferrer" data-cta="whatsapp" data-track="whatsapp-click" class="btn btn-outline">${C.icon('messageCircle')} WhatsApp Us</a>
      </div>
    </div>
  </div>
</section>`;

  const yesNoUnsure = ['', 'Yes', 'No', 'Unsure'];
  const yesNo = ['', 'Yes', 'No'];

  function field(id, name, label, opts) {
    opts = opts || {};
    const required = !!opts.required;
    const type = opts.type || 'text';
    const extra = opts.extra || '';
    return `<div class="field">
      <label for="${id}">${label}${required ? '' : ' <span class="hint" style="display:inline;">(optional)</span>'}</label>
      <input id="${id}" name="${name}" type="${type}" ${extra} ${required ? 'required' : ''}>
      <span class="field__error" role="alert"></span>
    </div>`;
  }

  function selectField(id, name, label, options, required) {
    return `<div class="field">
      <label for="${id}">${label}${required ? '' : ' <span class="hint" style="display:inline;">(optional)</span>'}</label>
      <select id="${id}" name="${name}" ${required ? 'required' : ''}>
        ${options
          .map((o) => (o === '' ? `<option value="" selected>Select an option</option>` : `<option>${o}</option>`))
          .join('\n')}
      </select>
      <span class="field__error" role="alert"></span>
    </div>`;
  }

  function textareaField(id, name, label, required) {
    return `<div class="field">
      <label for="${id}">${label}${required ? '' : ' <span class="hint" style="display:inline;">(optional)</span>'}</label>
      <textarea id="${id}" name="${name}" rows="3" ${required ? 'required' : ''}></textarea>
      <span class="field__error" role="alert"></span>
    </div>`;
  }

  const formHtml = `<form id="planned-transport-form" data-notify-form data-form-name="planned_transport" action="/notify" method="post" novalidate>
    <input type="hidden" name="form_name" value="planned_transport">
    ${C.hiddenTrackingFields()}
    ${C.honeypotField()}

    <div class="form-grid cols-2">
      ${field('pt-name', 'name', 'Name', { required: true, extra: 'autocomplete="name"' })}
      ${field('pt-phone', 'phone', 'Phone number', { required: true, type: 'tel', extra: 'inputmode="tel" autocomplete="tel"' })}
    </div>
    <div class="form-grid cols-2">
      ${field('pt-vehicle', 'vehicle', 'Vehicle make and model', {})}
      ${field('pt-date', 'preferredDate', 'Preferred date', { type: 'date' })}
    </div>
    <div class="form-grid cols-2">
      ${field('pt-collection', 'collection', 'Collection area or postcode', { required: true })}
      ${field('pt-destination', 'destination', 'Destination area or postcode', { required: true })}
    </div>
    <div class="form-grid cols-2">
      ${selectField('pt-starts', 'starts', 'Does the vehicle start?', yesNoUnsure, false)}
      <div></div>
    </div>
    <div style="margin-top:1rem;">
      ${textareaField('pt-notes', 'notes', 'Additional information', false)}
    </div>

    <details class="form-disclosure">
      <summary>Additional loading information</summary>
      <div class="form-disclosure__body">
        <div class="form-grid cols-2">
          ${selectField('pt-rolls', 'rolls', 'Does it roll?', yesNoUnsure, false)}
          ${selectField('pt-steers', 'steers', 'Does it steer?', yesNoUnsure, false)}
        </div>
        <div class="form-grid cols-2">
          ${selectField('pt-brakes', 'brakes', 'Does it brake?', yesNoUnsure, false)}
          ${selectField('pt-keys', 'keys', 'Are the keys available?', yesNo, false)}
        </div>
        <div style="margin-top:1rem;">
          ${textareaField('pt-access', 'access', 'Are there access restrictions?', false)}
        </div>
      </div>
    </details>

    <div style="margin-top:1.5rem;">
      <button type="submit" class="btn btn-primary btn-block btn-block-sm-auto">Request Planned Transport</button>
    </div>
    <div class="form-banner" role="status"></div>

    <div class="form-legal-notice">
      Submitting this form is a request only. The job is not confirmed until the vehicle, collection point, destination, availability and price have been agreed.
    </div>
  </form>`;

  const content = `${hero}
${urgentNotice}
<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div>
        ${formHtml}
      </div>
      <aside class="aside-card">
        <h3>Questions about your transport request?</h3>
        <p style="font-size:0.875rem;color:var(--muted-foreground);margin-top:0.5rem;">Call ${C.SITE_CONFIG.phoneDisplay} or WhatsApp us — we're happy to help.</p>
        <div style="margin-top:1rem;display:flex;flex-direction:column;gap:0.75rem;">
          <a href="${C.SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary btn-block">${C.icon('phone')} Call ${C.escapeHtml(C.SITE_CONFIG.phoneDisplay)}</a>
          <a href="${C.SITE_CONFIG.whatsappHref}" target="_blank" rel="noopener noreferrer" data-cta="whatsapp" data-track="whatsapp-click" class="btn btn-outline btn-block">${C.icon('messageCircle')} WhatsApp Us</a>
        </div>
      </aside>
    </div>
  </div>
</section>`;

  return {
    path: '/booking',
    filename: 'booking.html',
    title: 'Book Vehicle Recovery | Nottingham Car Recovery',
    description:
      'Request breakdown, accident, towing or vehicle transport across Nottingham. Share your vehicle, collection and destination details for a confirmed quote.',
    content,
    schemas: [C.breadcrumbSchema(breadcrumbs)]
  };
}

module.exports = { build };
