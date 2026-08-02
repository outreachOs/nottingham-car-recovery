'use strict';
/*
 * Recovery operator network page — deliberately separate from the
 * stranded-customer journey. No Call/WhatsApp/Call Me Back actions, no
 * urgent hero, no JobPosting schema (this is an expression-of-interest
 * page, not a job advert). Captures interest from independent recovery
 * operators via a dedicated operator_interest form/Telegram format.
 */

const C = require('../components');
const S = require('../schema');

const PATH = '/recovery-driver-work-nottingham';

const FAQS = [
  {
    question: 'Is this a guaranteed job offer?',
    answer:
      'No. This is an expression-of-interest page. Registering does not guarantee work, income, hours or acceptance into the network.'
  },
  {
    question: 'Do I need my own recovery vehicle?',
    answer:
      'Most suitable opportunities involve operating your own suitable vehicle. The form asks whether you do, and this is discussed further if your application progresses.'
  },
  {
    question: 'Will I be employed by Nottingham Car Recovery?',
    answer:
      'No. This is an independent recovery operator network, not an employer or employment agency. Employment and tax status depends on the actual working arrangement, which is not decided by this website.'
  },
  {
    question: 'What happens after I register my interest?',
    answer:
      'Suitable applicants may be contacted to discuss verification and, where appropriate, commercial terms. Registering does not guarantee this will happen or that any opportunity will follow.'
  },
  {
    question: 'Do I need to upload documents now?',
    answer:
      'No. This form does not collect documents such as identity, licence or insurance evidence. Any verification takes place separately and securely if an application progresses.'
  }
];

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

function checkboxField(id, name, labelHtml) {
  return `<div class="field-check">
      <input type="checkbox" id="${id}" name="${name}" value="yes" required>
      <label for="${id}">${labelHtml}</label>
    </div>`;
}

function renderOperatorForm() {
  return `<form id="operator-form" data-notify-form data-form-name="operator_interest" action="/notify" method="post" novalidate>
    <input type="hidden" name="form_name" value="operator_interest">
    ${C.hiddenTrackingFields()}
    ${C.honeypotField()}

    <div class="form-grid cols-2">
      ${field('op-name', 'name', 'Full name', { required: true, extra: 'autocomplete="name"' })}
      ${field('op-mobile', 'phone', 'Mobile number', { required: true, type: 'tel', extra: 'inputmode="tel" autocomplete="tel"' })}
    </div>
    <div class="form-grid cols-2">
      ${field('op-email', 'email', 'Email address', { required: true, type: 'email', extra: 'autocomplete="email"' })}
      ${field('op-business', 'business', 'Business or trading name', {})}
    </div>
    <div class="form-grid cols-2">
      ${field('op-postcode', 'basePostcode', 'Base postcode', { required: true })}
      ${field('op-areas', 'areasCovered', 'Areas covered', { required: true })}
    </div>
    <div class="form-grid cols-2">
      ${selectField('op-own-vehicle', 'ownVehicle', 'Do you operate your own recovery vehicle?', ['', 'Yes', 'No'], true)}
      ${field('op-vehicle-type', 'vehicleType', 'Vehicle type or capacity', {})}
    </div>
    <div style="margin-top:1rem;">
      ${textareaField('op-experience', 'experience', 'Recovery or vehicle-transport experience', true)}
    </div>
    <div style="margin-top:1rem;">
      ${selectField(
        'op-status',
        'workingStatus',
        'Current working status',
        ['', 'Independent recovery business', 'Sole trader', 'Limited company', 'Employed recovery driver exploring opportunities', 'Other'],
        false
      )}
    </div>

    <div style="margin-top:1.5rem;">
      ${checkboxField(
        'op-acknowledgement',
        'operatorAcknowledgement',
        'I confirm the information provided is accurate, understand that registering does not guarantee work or acceptance, and agree to be contacted about suitable operator opportunities.'
      )}
    </div>

    <div style="margin-top:1.5rem;">
      <button type="submit" class="btn btn-primary btn-block btn-block-sm-auto">Register My Interest</button>
    </div>
    <div class="form-banner" role="status"></div>

    <div class="form-legal-notice">
      Submitting this form does not create an employment, worker, agency or subcontracting relationship and does not guarantee work. Suitable applicants may be contacted to discuss verification and commercial terms.
    </div>
  </form>`;
}

function build() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Recovery Driver Work', href: PATH }
  ];

  // Deliberately no Call/WhatsApp/Call Me Back here — this page is kept
  // separate from the stranded-customer conversion journey.
  const hero = `${C.renderBreadcrumbs(breadcrumbs)}
<section class="hero hero--page hero--plain">
  <div class="container">
    <div class="hero__inner">
      <span class="badge-pill">Operator Network</span>
      <h1>Recovery Driver Work in Nottingham</h1>
      <h2 style="margin-top:0.75rem;font-size:1.25rem;color:var(--primary);">Join Our Independent Recovery Operator Network</h2>
      <p class="lead">Register your interest in suitable vehicle recovery and transport opportunities across Nottingham and surrounding areas. This is an expression-of-interest page, not a guaranteed job offer.</p>
    </div>
  </div>
</section>`;

  const positioning = `<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div class="prose-block">
        <h2>What This Page Is</h2>
        <p>This page lets independent recovery operators and experienced recovery drivers register interest in suitable vehicle recovery and transport opportunities. Please read the following before applying:</p>
        ${C.renderChecklist([
          'This is an expression-of-interest page, not a guaranteed job offer',
          'Registering does not guarantee work, income, hours or acceptance into the network',
          'Opportunities may be offered depending on customer demand, location, availability, vehicle suitability and verification',
          'Operators may choose whether to accept any opportunity offered to them',
          'Registering does not create exclusivity in either direction',
          'Final commercial terms must be agreed separately before any work begins',
          'Applicants may need to operate as a genuine independent business',
          'Employment and tax status depends on the actual working arrangement, and is not determined by this website',
          'No operator should attend a customer until approved and explicitly allocated a job'
        ])}

        <h2>Who Should Register</h2>
        <p>Suitable applicants may include:</p>
        ${C.renderChecklist([
          'Independent recovery operators',
          'Recovery businesses with their own suitable vehicles',
          'Experienced recovery drivers working through a legitimate business',
          'Vehicle-transport operators',
          'Operators covering Nottingham, Nottinghamshire or nearby areas'
        ])}

        <h2>Potential Verification</h2>
        <p>Requirements vary depending on the vehicle and type of work involved. Where an application progresses, verification may cover some or all of the following:</p>
        ${C.renderChecklist([
          'Identity',
          'Business details',
          'Driving-licence entitlement',
          'Recovery experience',
          'Vehicle details',
          'Insurance',
          'Relevant operator-licence requirements, where applicable',
          'Driver CPC or tachograph requirements, where applicable',
          'Geographic coverage',
          'Availability',
          'References or evidence of previous work',
          'Agreement to customer-service and safety standards'
        ])}
        <p>Documents such as identity, licence or insurance evidence are not collected through the form below — any such checks take place separately through a secure verification process if an application progresses.</p>
      </div>
      <aside class="aside-card">
        <h3>Looking for vehicle recovery instead?</h3>
        <p style="font-size:0.875rem;color:var(--muted-foreground);margin-top:0.5rem;">This page is for recovery operators and drivers. If you need your own vehicle recovered or transported, visit our <a href="/">homepage</a> or <a href="/contact">contact page</a>.</p>
      </aside>
    </div>
  </div>
</section>`;

  const formSection = `<section id="operator-interest" class="section border-t">
  <div class="container-narrow">
    <div class="section-head center">
      <span class="eyebrow">Register Interest</span>
      <h2>Recovery Operator Interest Form</h2>
      <p>Tell us about your business or experience. This is a request for information only.</p>
    </div>
    <div style="margin-top:2rem;">
      ${renderOperatorForm()}
    </div>
  </div>
</section>`;

  const faq = C.renderFaqSection(FAQS, { heading: 'Operator Network FAQs' });

  const content = `${hero}
${positioning}
${formSection}
${faq.html}`;

  return {
    path: PATH,
    filename: 'recovery-driver-work-nottingham.html',
    title: 'Recovery Driver Work Nottingham | Join Our Operator Network',
    description:
      'Independent recovery operator or experienced recovery driver in Nottingham? Register your interest in suitable vehicle recovery and transport opportunities.',
    content,
    schemas: [
      C.breadcrumbSchema(breadcrumbs),
      S.webPageSchema({
        name: 'Recovery Driver Work Nottingham | Join Our Operator Network',
        description:
          'Independent recovery operator or experienced recovery driver in Nottingham? Register your interest in suitable vehicle recovery and transport opportunities.',
        path: PATH
      }),
      faq.schema
    ]
  };
}

module.exports = { build };
