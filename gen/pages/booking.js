'use strict';

const C = require('../components');

function build() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Booking', href: '/booking' }
  ];

  const hero = C.renderHeroPage({
    eyebrow: 'Booking',
    title: 'Request Vehicle Recovery',
    lead:
      'Complete the form below with as much detail as possible. This is a request only — the job is not confirmed until the vehicle, collection point, destination, availability and price have been agreed.',
    breadcrumbs
  });

  const yesNoUnsure = ['', 'Yes', 'No', 'Unsure'];
  const yesNo = ['', 'Yes', 'No'];

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

  function textField(id, name, label, type, placeholder, required) {
    return `<div class="field">
      <label for="${id}">${label}${required ? '' : ' <span class="hint" style="display:inline;">(optional)</span>'}</label>
      <input id="${id}" name="${name}" type="${type}" placeholder="${placeholder || ''}" ${required ? 'required' : ''}>
      <span class="field__error" role="alert"></span>
    </div>`;
  }

  function textareaField(id, name, label, placeholder) {
    return `<div class="field">
      <label for="${id}">${label} <span class="hint" style="display:inline;">(optional)</span></label>
      <textarea id="${id}" name="${name}" rows="3" placeholder="${placeholder || ''}"></textarea>
    </div>`;
  }

  const formHtml = `<form id="booking-form" data-notify-form data-form-name="booking" action="/notify" method="post" novalidate>
    <input type="hidden" name="form_name" value="booking">
    ${C.hiddenTrackingFields()}
    ${C.honeypotField()}

    <h2 style="font-size:1.125rem;margin-top:0;">Your Details</h2>
    <div class="form-grid cols-2">
      ${textField('bk-name', 'name', 'Name', 'text', 'Your full name', true)}
      ${textField('bk-phone', 'phone', 'Phone number', 'tel', 'Best contact number', true)}
    </div>
    <div class="form-grid cols-2">
      ${textField('bk-email', 'email', 'Email', 'email', 'Your email address', false)}
      <div></div>
    </div>

    <h2 style="font-size:1.125rem;">Vehicle Details</h2>
    <div class="form-grid cols-2">
      ${textField('bk-vehicle', 'vehicle_make_model', 'Vehicle make and model', 'text', 'e.g. Ford Focus', true)}
      ${textField('bk-reg', 'registration', 'Registration', 'text', 'Where available', false)}
    </div>

    <h2 style="font-size:1.125rem;">Collection &amp; Destination</h2>
    <div class="form-grid cols-2">
      ${textField('bk-collection', 'collection_address', 'Collection address', 'text', 'Where is the vehicle now?', true)}
      ${textField('bk-destination', 'destination', 'Destination', 'text', 'Garage, home or agreed location', true)}
    </div>

    <h2 style="font-size:1.125rem;">Preferred Timing</h2>
    <div class="form-grid cols-2">
      ${textField('bk-date', 'preferred_date', 'Preferred date', 'date', '', false)}
      ${textField('bk-time', 'preferred_time', 'Preferred time', 'time', '', false)}
    </div>

    <h2 style="font-size:1.125rem;">Vehicle Condition</h2>
    <div class="form-grid cols-2">
      ${selectField('bk-starts', 'starts', 'Does the vehicle start?', yesNoUnsure, false)}
      ${selectField('bk-rolls', 'rolls', 'Does it roll?', yesNoUnsure, false)}
    </div>
    <div class="form-grid cols-2">
      ${selectField('bk-steers', 'steers', 'Does it steer?', yesNoUnsure, false)}
      ${selectField('bk-brakes', 'brakes', 'Does it brake?', yesNoUnsure, false)}
    </div>
    <div class="form-grid cols-2">
      ${selectField('bk-keys', 'keys_available', 'Are keys available?', yesNo, false)}
      <div></div>
    </div>

    <h2 style="font-size:1.125rem;">Additional Information</h2>
    ${textareaField('bk-damage', 'damage_notes', 'Damage notes', 'Any visible damage or known issues')}
    ${textareaField('bk-access', 'access_restrictions', 'Access restrictions', 'Narrow roads, gated sites, height restrictions, etc.')}
    ${textareaField('bk-notes', 'additional_notes', 'Additional notes', 'Anything else that would help')}

    <div class="field-check" style="margin-top:1.5rem;">
      <input type="checkbox" id="bk-consent" name="consent" value="yes" required>
      <label for="bk-consent">I understand this is a request only and that the job is not confirmed until the vehicle, collection point, destination, availability and price have been agreed. I consent to being contacted about this request.</label>
    </div>

    <div style="margin-top:1.5rem;">
      <button type="submit" class="btn btn-primary btn-block btn-block-sm-auto">Submit Recovery Request</button>
    </div>
    <div class="form-banner" role="status"></div>

    <div class="form-legal-notice">
      Submitting this form is a request only. The job is not confirmed until the vehicle, collection point, destination, availability and price have been agreed.
    </div>
  </form>`;

  const content = `${hero}
<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div>
        ${formHtml}
      </div>
      <aside class="aside-card">
        <h3>Prefer to talk it through?</h3>
        <p style="font-size:0.875rem;color:var(--muted-foreground);margin-top:0.5rem;">You can also reach us directly.</p>
        <div style="margin-top:1rem;display:flex;flex-direction:column;gap:0.75rem;">
          <a href="${C.SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary btn-block">${C.icon('phone')} Call Us</a>
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
