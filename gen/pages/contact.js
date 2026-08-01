'use strict';

const C = require('../components');

function build() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact' }
  ];

  const hero = C.renderHeroPage({
    eyebrow: 'Contact',
    title: 'Contact Nottingham Car Recovery',
    lead: 'Call, WhatsApp or request a callback — whichever is easiest once you are safely positioned.',
    breadcrumbs
  });

  const contactActions = `<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div>
        <div class="prose-block">
          <h2>Get in Touch</h2>
          <p>Choose whichever contact method suits your situation. If you are dealing with a breakdown or accident, please make sure you are safely positioned away from moving traffic before making contact.</p>
        </div>

        <div class="btn-row" style="margin-top:1.5rem;">
          <a href="${C.SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary">${C.icon('phone')} Call Us</a>
          <a href="${C.SITE_CONFIG.whatsappHref}" target="_blank" rel="noopener noreferrer" data-cta="whatsapp" data-track="whatsapp-click" class="btn btn-outline">${C.icon('messageCircle')} WhatsApp Us</a>
        </div>
        <p style="margin-top:0.75rem;font-size:0.8125rem;color:var(--muted-foreground);">No business email is available yet — please call, WhatsApp or use the callback form below.</p>

        <div class="safety-box" style="margin-top:2rem;">
          <h3>${C.icon('alertTriangle')} If You Are in a Dangerous Position</h3>
          <ol>
            <li>Leave the motorway or main road where possible.</li>
            <li>Move to a service area, emergency area or hard shoulder where possible.</li>
            <li>Switch on your hazard lights.</li>
            <li>Exit the vehicle away from traffic where it is safe to do so.</li>
            <li>Move behind a barrier where safe.</li>
            <li>Call 999 for any live-lane danger or immediate risk.</li>
            <li>Use an emergency roadside telephone where available.</li>
            <li>Contact us for recovery only once you are safely positioned.</li>
          </ol>
        </div>
      </div>
      <aside class="aside-card">
        <h3>Coverage &amp; Hours</h3>
        <ul>
          <li>Serving <span data-config="primaryServiceArea">Nottingham</span> and <span data-config="widerServiceArea">Nottinghamshire and surrounding areas</span></li>
          <li data-config="serviceHours">${C.escapeHtml(C.SITE_CONFIG.serviceHours)}</li>
          <li><a href="/privacy">Privacy Policy</a></li>
        </ul>
      </aside>
    </div>
  </div>
</section>`;

  const contactFormSection = C.renderCallbackForm({
    formId: 'contact-form',
    formName: 'contact',
    showPanel: false,
    heading: 'Request a Callback',
    lead: 'Prefer us to call you back? Leave your details and a short message.'
  });

  const content = `${hero}
${contactActions}
${contactFormSection}`;

  return {
    path: '/contact',
    filename: 'contact.html',
    title: 'Contact Us | Nottingham Car Recovery',
    description:
      'Contact Nottingham Car Recovery by phone, WhatsApp or callback request. Serving Nottingham and surrounding areas for breakdown, accident and vehicle transport.',
    content,
    schemas: [C.breadcrumbSchema(breadcrumbs)]
  };
}

module.exports = { build };
