'use strict';

const { ICONS } = require('./icons');
const { DOMAIN, SERVICES, ROUTES, AREAS, DESTINATIONS, WHY_CHOOSE, STEPS, NAV_ITEMS } = require('./data');
const { loadSiteConfig } = require('./site-config-loader');

// Single source of truth for contact details: read from the real
// public/config/site-config.js so generated pages never drift out of
// sync with it. Edit that file and run `node gen/build.js` to update
// every page's phone/WhatsApp links and hours wording at once.
const SITE_CONFIG = loadSiteConfig();

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function icon(name) {
  return ICONS[name] || '';
}

function renderChecklist(items) {
  return `<ul>
    ${items.map((item) => `<li>${icon('circleCheck')}<span>${item}</span></li>`).join('\n')}
  </ul>`;
}

function renderCalloutLink(href, label, text) {
  return `<a href="${href}" class="callout-link">
    <strong>${escapeHtml(label)}</strong>
    ${escapeHtml(text)}
  </a>`;
}

function renderSafetyBox(heading, items) {
  return `<div class="safety-box">
    <h3>${icon('alertTriangle')} ${escapeHtml(heading)}</h3>
    <ol>
      ${items.map((item) => `<li>${item}</li>`).join('\n')}
    </ol>
  </div>`;
}

function renderPageHeader(opts) {
  const { heading, lead } = opts;
  return `<div class="section-head">
    <h2>${escapeHtml(heading)}</h2>
    ${lead ? `<p>${lead}</p>` : ''}
  </div>`;
}

/* ------------------------------------------------------------
   <head>
--------------------------------------------------------------- */
function renderHead(opts) {
  const {
    title,
    description,
    canonicalPath,
    ogImage = '/assets/images/hero-recovery.png',
    schemas = []
  } = opts;

  const canonical = DOMAIN + (canonicalPath === '/' ? '/' : canonicalPath);
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : DOMAIN + ogImage;

  const schemaScripts = schemas
    .map((schema) => '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>')
    .join('\n');

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#080e12">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nottingham Car Recovery">
<meta property="og:image" content="${ogImageUrl}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${ogImageUrl}">
<link rel="stylesheet" href="/assets/css/styles.css">
<script src="/config/site-config.js"></script>
${schemaScripts}`;
}

/* ------------------------------------------------------------
   Header + mobile menu
--------------------------------------------------------------- */
function renderBrand() {
  return `<a href="/" class="brand" aria-label="Nottingham Car Recovery — homepage">
  <span class="brand__mark">${icon('car')}</span>
  <span class="brand__text">
    <span class="brand__eyebrow">Nottingham</span>
    <span class="brand__name">Car Recovery</span>
  </span>
</a>`;
}

function renderServiceLinks(extraClass) {
  return SERVICES.map(
    (s) => `<a href="${s.href}" class="${extraClass || ''}">${escapeHtml(s.title)}</a>`
  ).join('\n');
}

function renderHeader() {
  const navLinks = NAV_ITEMS.map((item) => {
    if (item.label === 'Services') {
      return `<li class="nav-has-menu">
  <details class="nav-dropdown">
    <summary>Services ${icon('chevronDown')}</summary>
    <div class="nav-dropdown__panel">
      <a href="/services">All Services</a>
      ${renderServiceLinks()}
    </div>
  </details>
</li>`;
    }
    return `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`;
  }).join('\n');

  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="container site-header__inner">
    ${renderBrand()}
    <nav aria-label="Primary" class="primary-nav">
      <ul>
        ${navLinks}
      </ul>
    </nav>
    <div class="header-call">
      <a href="${SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary" style="padding:0.625rem 1rem;font-size:0.875rem;">
        ${icon('phone')} Call for Recovery
      </a>
    </div>
    <button type="button" class="menu-toggle" aria-haspopup="dialog" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu">
      ${icon('menu')}
    </button>
  </div>
  <noscript>
    <div class="container" style="padding-block:0.75rem;border-top:1px solid var(--border);font-size:0.875rem;display:flex;flex-wrap:wrap;gap:0.25rem 1rem;">
      ${NAV_ITEMS.map((i) => `<a href="${i.href}">${escapeHtml(i.label)}</a>`).join('\n')}
      ${renderServiceLinks()}
    </div>
  </noscript>
</header>

<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="mobile-menu__backdrop"></div>
  <div class="mobile-menu__panel">
    <div class="mobile-menu__head">
      ${renderBrand()}
      <button type="button" class="menu-toggle mobile-menu__close" aria-label="Close menu">
        ${icon('close')}
      </button>
    </div>
    <nav aria-label="Mobile" class="mobile-menu__nav">
      ${NAV_ITEMS.map((i) => `<a href="${i.href}">${escapeHtml(i.label)}</a>`).join('\n')}
      <details class="nav-dropdown nav-dropdown--mobile">
        <summary>More Services ${icon('chevronDown')}</summary>
        <div class="nav-dropdown__panel">
          ${renderServiceLinks()}
        </div>
      </details>
    </nav>
    <div class="mobile-menu__actions">
      <a href="${SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary btn-block">${icon('phone')} Call for Recovery</a>
      <a href="/booking" class="btn btn-outline btn-block">${icon('calendarClock')} Request a Callback</a>
    </div>
  </div>
</div>`;
}

/* ------------------------------------------------------------
   Breadcrumbs (visual)
--------------------------------------------------------------- */
function renderBreadcrumbs(items) {
  if (!items || !items.length) return '';
  const li = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      if (isLast) {
        return `<li aria-current="page">${escapeHtml(item.label)}</li>`;
      }
      return `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`;
    })
    .join('\n');
  return `<div class="breadcrumbs">
  <div class="container">
    <ol>${li}</ol>
  </div>
</div>`;
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: DOMAIN + (item.href === '/' ? '/' : item.href)
    }))
  };
}

/* ------------------------------------------------------------
   Hero variants
--------------------------------------------------------------- */
function renderHeroHome() {
  const bullets = [
    'One-off recovery available — no annual membership',
    'Garage, home or chosen suitable destination',
    'Emergency and planned vehicle transport'
  ];
  const badgeText = SITE_CONFIG.isTwentyFourSeven
    ? '24/7 Vehicle Recovery — Nottingham &amp; Surrounding Areas'
    : 'Serving Nottingham &amp; Surrounding Areas';
  return `<section class="hero">
  <div class="hero__media">
    <img src="/assets/images/hero-recovery.png" alt="Recovery truck with amber warning lights loading a car on a wet Nottingham road at night" width="1024" height="1024" fetchpriority="high">
  </div>
  <div class="container">
    <div class="hero__inner">
      <span class="badge-pill">${badgeText}</span>
      <h1>Car Recovery<span class="accent">in Nottingham</span></h1>
      <p class="lead">Breakdown, accident, towing and vehicle transport for cars, vans and suitable light commercial vehicles across Nottingham and surrounding areas.</p>
      <ul class="hero__bullets">
        ${bullets.map((b) => `<li>${icon('circleCheck')}<span>${escapeHtml(b)}</span></li>`).join('\n')}
      </ul>
      <div class="btn-row">
        ${ctaButtons()}
      </div>
    </div>
  </div>
</section>`;
}

function ctaButtons(opts) {
  opts = opts || {};
  const callLabel = opts.callLabel || 'Call for Vehicle Recovery';
  const whatsappLabel = opts.whatsappLabel || 'WhatsApp Us';
  const callbackLabel = opts.callbackLabel || 'Request a Callback';
  const callbackHref = opts.callbackHref || '/booking';
  return `<a href="${SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary">${icon('phone')} ${escapeHtml(callLabel)}</a>
<a href="${SITE_CONFIG.whatsappHref}" target="_blank" rel="noopener noreferrer" data-cta="whatsapp" data-track="whatsapp-click" class="btn btn-outline">${icon('messageCircle')} ${escapeHtml(whatsappLabel)}</a>
<a href="${callbackHref}" class="btn btn-outline">${icon('calendarClock')} ${escapeHtml(callbackLabel)}</a>`;
}

function renderHeroPage(opts) {
  const { eyebrow, title, titleAccent, lead, breadcrumbs = [] } = opts;
  return `${renderBreadcrumbs(breadcrumbs)}
<section class="hero hero--page hero--plain">
  <div class="container">
    <div class="hero__inner">
      ${eyebrow ? `<span class="badge-pill">${escapeHtml(eyebrow)}</span>` : ''}
      <h1>${escapeHtml(title)}${titleAccent ? `<span class="accent">${escapeHtml(titleAccent)}</span>` : ''}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      <div class="btn-row">
        ${ctaButtons()}
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   Trust strip
--------------------------------------------------------------- */
function renderTrustStrip() {
  const items = [
    {
      icon: 'mapPin',
      title: 'Local Coverage',
      description: SITE_CONFIG.isTwentyFourSeven
        ? '24-hour recovery across Nottingham and surrounding areas.'
        : 'Serving Nottingham and surrounding areas.'
    },
    { icon: 'car', title: 'Suitable Vehicles', description: 'Cars, vans and suitable light commercial vehicles.' },
    { icon: 'navigation', title: 'Clear Destination', description: 'Transport to a garage, home or agreed destination.' }
  ];
  return `<section class="trust-strip">
  <div class="container">
    <div class="trust-strip__grid">
      ${items
        .map(
          (item) => `<div class="trust-strip__item">
        <span class="trust-strip__icon">${icon(item.icon)}</span>
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
      </div>`
        )
        .join('\n')}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   Services grid
--------------------------------------------------------------- */
function renderServicesGrid(opts) {
  opts = opts || {};
  const heading = opts.heading || 'How Can We Help?';
  const lead = opts.lead || 'Choose the recovery service that matches your situation.';
  const items = opts.items || SERVICES;
  const id = opts.id || 'services';
  return `<section id="${id}" class="section surface">
  <div class="container">
    <div class="section-head center">
      <h2>${escapeHtml(heading)}</h2>
      <p>${escapeHtml(lead)}</p>
    </div>
    <div class="grid-cards cols-3">
      ${items
        .map(
          (s) => `<a href="${s.href}" class="service-card">
        <span class="service-card__icon">${icon(s.icon)}</span>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.description)}</p>
        <span class="service-card__link">Learn more ${icon('arrowRight')}</span>
      </a>`
        )
        .join('\n')}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   Callback / request form section
--------------------------------------------------------------- */
function hiddenTrackingFields() {
  const names = [
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
  return names.map((n) => `<input type="hidden" name="${n}" value="">`).join('\n');
}

function honeypotField() {
  return `<div class="honeypot-field" aria-hidden="true">
  <label for="website">Leave this field blank</label>
  <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
</div>`;
}

function renderCallbackForm(opts) {
  opts = opts || {};
  const formId = opts.formId || 'callback-form';
  const formName = opts.formName || 'callback';
  const showPanel = opts.showPanel !== false;
  const heading = opts.heading || 'Quick Callback Request';
  const lead = opts.lead || "Leave your details and we'll contact you about your recovery request.";

  const checklist = [
    'Share your location',
    'Tell us about the vehicle',
    'Confirm the intended destination',
    'We will assess whether the job is suitable'
  ];

  const formHtml = `<div>
      <h2>${escapeHtml(heading)}</h2>
      <p style="margin-top:0.75rem;color:var(--muted-foreground);max-width:32rem;">${escapeHtml(lead)}</p>
      <form id="${formId}" data-notify-form data-form-name="${formName}" action="/notify" method="post" novalidate>
        <input type="hidden" name="form_name" value="${formName}">
        ${hiddenTrackingFields()}
        ${honeypotField()}
        <div class="form-grid cols-2">
          <div class="field">
            <label for="${formId}-name">Name</label>
            <input id="${formId}-name" name="name" type="text" placeholder="Your name" required>
            <span class="field__error" role="alert"></span>
          </div>
          <div class="field">
            <label for="${formId}-phone">Phone number</label>
            <input id="${formId}-phone" name="phone" type="tel" placeholder="Best contact number" required>
            <span class="field__error" role="alert"></span>
          </div>
        </div>
        <div class="form-grid cols-2">
          <div class="field">
            <label for="${formId}-help">What do you need help with?</label>
            <select id="${formId}-help" name="help">
              <option value="" selected>Select a service</option>
              ${SERVICES.map((s) => `<option>${escapeHtml(s.title)}</option>`).join('\n')}
            </select>
          </div>
          <div class="field">
            <label for="${formId}-area">Collection area</label>
            <input id="${formId}-area" name="area" type="text" placeholder="e.g. West Bridgford">
          </div>
        </div>
        <div class="field" style="margin-top:1rem;">
          <label for="${formId}-message">Short message</label>
          <textarea id="${formId}-message" name="message" rows="4" placeholder="Tell us about the vehicle and your situation"></textarea>
        </div>
        <div style="margin-top:1.5rem;">
          <button type="submit" class="btn btn-primary btn-block btn-block-sm-auto">Request Callback</button>
        </div>
        <div class="form-banner" role="status"></div>
        <p class="form-note">${icon('shieldCheck')} Your details are only used to respond to your recovery request. See our <a href="/privacy">Privacy Policy</a>.</p>
      </form>
    </div>`;

  const panelHtml = `<div class="safe-panel">
      <h3>In a Safe Place? Now You Can Call Us.</h3>
      <ul>
        ${checklist.map((c) => `<li>${icon('circleCheck')}<span>${escapeHtml(c)}</span></li>`).join('\n')}
      </ul>
      <div class="safe-panel__notice">
        <p>Only make contact once you are safely positioned away from moving traffic. If you are in immediate danger, call <strong>999</strong> first.</p>
      </div>
    </div>`;

  return `<section id="callback" class="section">
  <div class="container">
    <div class="${showPanel ? 'split-panel' : ''}">
      ${formHtml}
      ${showPanel ? panelHtml : ''}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   Road coverage
--------------------------------------------------------------- */
function renderRoadCoverage(opts) {
  opts = opts || {};
  const heading = opts.heading || "Recovery Across Nottingham's Main Routes";
  const lead =
    opts.lead ||
    'Covering key routes in and around Nottingham, connecting the city with surrounding towns and the wider motorway network, without claiming a fixed physical address.';
  const routes = opts.routes || ROUTES;
  return `<section class="road-coverage">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">${icon('route')} Coverage</span>
      <h2>${escapeHtml(heading)}</h2>
      <p>${escapeHtml(lead)}</p>
    </div>
    <div class="road-coverage__grid">
      ${routes.map((r) => `<div class="road-badge"><strong>${escapeHtml(r)}</strong><span>Route</span></div>`).join('\n')}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   Why choose
--------------------------------------------------------------- */
function renderWhyChoose(opts) {
  opts = opts || {};
  const heading = opts.heading || 'A recovery service built around clarity';
  const lead =
    opts.lead ||
    'No membership, no surprises. Just a straightforward recovery service with a clear quote and a destination that suits you.';
  const items = opts.items || WHY_CHOOSE;
  return `<section id="why" class="section">
  <div class="container">
    <div class="why-grid">
      <div>
        <span class="eyebrow">Why choose us</span>
        <h2 style="margin-top:0.75rem;font-size:1.875rem;">${escapeHtml(heading)}</h2>
        <p style="margin-top:1rem;color:var(--muted-foreground);">${escapeHtml(lead)}</p>
      </div>
      <ul class="numbered-list">
        ${items
          .map(
            (reason, i) => `<li>
          <span class="num">${String(i + 1).padStart(2, '0')}</span>
          <span class="txt">${icon('badgeCheck')} ${escapeHtml(reason)}</span>
        </li>`
          )
          .join('\n')}
      </ul>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   How it works
--------------------------------------------------------------- */
function renderHowItWorks() {
  return `<section class="section bg-card border-y">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">How it works</span>
      <h2>A simple four-step process</h2>
    </div>
    <ol class="steps">
      ${STEPS.map(
        (step) => `<li class="step">
        <span class="step__num">${step.number}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.description)}</p>
      </li>`
      ).join('\n')}
    </ol>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   Areas grid
--------------------------------------------------------------- */
function renderAreasGrid(opts) {
  opts = opts || {};
  const heading = opts.heading || 'Recovery across Nottingham &amp; nearby towns';
  const showViewAll = opts.showViewAll !== false;
  const areas = opts.areas || AREAS;
  return `<section id="areas" class="section">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Areas covered</span>
      <h2>${heading}</h2>
    </div>
    <div class="areas-grid">
      ${areas
        .map(
          (a) => `<a href="${a.href}" class="area-chip">${icon('mapPin')}<span>${escapeHtml(a.name)}</span></a>`
        )
        .join('\n')}
    </div>
    ${
      showViewAll
        ? `<div style="margin-top:2rem;"><a href="/areas" class="btn btn-outline">View All Recovery Areas ${icon('arrowRight')}</a></div>`
        : ''
    }
  </div>
</section>`;
}

/* ------------------------------------------------------------
   Destinations
--------------------------------------------------------------- */
function renderDestinations() {
  return `<section class="section surface">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Destinations</span>
      <h2>Where Can Your Vehicle Be Taken?</h2>
      <p>Your vehicle can be transported to whichever suitable destination works best for you.</p>
    </div>
    <div class="grid-cards cols-3">
      ${DESTINATIONS.map(
        (d) => `<div class="info-card">
        <span class="info-card__icon">${icon(d.icon)}</span>
        <div>
          <h3>${escapeHtml(d.title)}</h3>
          <p>${escapeHtml(d.description)}</p>
        </div>
      </div>`
      ).join('\n')}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   FAQ accordion + schema
--------------------------------------------------------------- */
function renderFaqSection(faqs, opts) {
  opts = opts || {};
  const heading = opts.heading || 'Frequently Asked Questions';
  const html = `<section class="section border-t" id="faq">
  <div class="container-narrow">
    <div class="section-head center">
      <span class="eyebrow">FAQs</span>
      <h2>${escapeHtml(heading)}</h2>
    </div>
    <div class="faq-list">
      ${faqs
        .map(
          (faq, i) => `<div class="faq-item" data-default-open="${i === 0 ? 'true' : 'false'}">
        <h3>
          <button type="button" class="faq-item__trigger" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="faq-panel-${i}" id="faq-trigger-${i}">
            <span>${escapeHtml(faq.question)}</span>
            ${icon('chevronDown')}
          </button>
        </h3>
        <div id="faq-panel-${i}" class="faq-item__panel" role="region" aria-labelledby="faq-trigger-${i}">
          <p>${escapeHtml(faq.answer)}</p>
        </div>
      </div>`
        )
        .join('\n')}
    </div>
  </div>
</section>`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  };

  return { html, schema };
}

/* ------------------------------------------------------------
   Final CTA
--------------------------------------------------------------- */
function renderFinalCta(opts) {
  opts = opts || {};
  const heading = opts.heading || 'Need Vehicle Recovery in Nottingham?';
  const lead =
    opts.lead ||
    'Share your location, vehicle details and preferred destination so the recovery request can be assessed.';
  return `<section class="final-cta section">
  <div class="container">
    <div class="final-cta__inner">
      <h2>${escapeHtml(heading)}</h2>
      <p>${escapeHtml(lead)}</p>
      <div class="btn-row center">
        ${ctaButtons({ whatsappLabel: 'Request on WhatsApp' })}
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------
   Footer
--------------------------------------------------------------- */
function renderFooter() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-about">
        ${renderBrand()}
        <p>Professional car recovery, breakdown assistance and vehicle transport across Nottingham and surrounding areas.</p>
        <p class="footer-contact">
          <span>Phone: <a href="${SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" data-config="phoneDisplay">${escapeHtml(SITE_CONFIG.phoneDisplay)}</a></span>
          <span data-config="serviceHours">${escapeHtml(SITE_CONFIG.serviceHours)}</span>
        </p>
      </div>
      <div class="footer-col">
        <h3>Services</h3>
        <ul>
          ${SERVICES.map((s) => `<li><a href="${s.href}">${escapeHtml(s.title)}</a></li>`).join('\n')}
        </ul>
      </div>
      <div class="footer-col">
        <h3>Areas</h3>
        <ul>
          ${AREAS.map((a) => `<li><a href="${a.href}">${escapeHtml(a.name)}</a></li>`).join('\n')}
          <li><a href="/areas">All Areas</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Company</h3>
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/booking">Book Recovery</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms &amp; Conditions</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${year} Nottingham Car Recovery. All rights reserved.</p>
      <p>nottingham-car-recovery.co.uk</p>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------
   Sticky mobile actions
--------------------------------------------------------------- */
function renderStickyBar() {
  return `<div class="sticky-actions">
  <div class="sticky-actions__inner">
    <a href="${SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary">${icon('phone')} Call for Recovery</a>
    <a href="${SITE_CONFIG.whatsappHref}" target="_blank" rel="noopener noreferrer" data-cta="whatsapp" data-track="whatsapp-click" class="btn btn-outline" aria-label="Message us on WhatsApp">${icon('messageCircle')} WhatsApp</a>
  </div>
</div>`;
}

/* ------------------------------------------------------------
   Full document assembly
--------------------------------------------------------------- */
function renderDocument(opts) {
  const { headExtra = '', bodyContent, stickyBar = true } = opts;
  return `<!doctype html>
<html lang="en-GB">
<head>
${renderHead(opts)}
${headExtra}
</head>
<body>
${renderHeader()}
<main id="main">
${bodyContent}
</main>
${renderFooter()}
${stickyBar ? renderStickyBar() : ''}
<script src="/assets/js/site.js" defer></script>
<script src="/assets/js/forms.js" defer></script>
<script src="/assets/js/tracking.js" defer></script>
</body>
</html>`;
}

module.exports = {
  SITE_CONFIG,
  escapeHtml,
  icon,
  renderHead,
  renderHeader,
  renderBreadcrumbs,
  breadcrumbSchema,
  renderHeroHome,
  renderHeroPage,
  ctaButtons,
  renderTrustStrip,
  renderServicesGrid,
  renderCallbackForm,
  hiddenTrackingFields,
  honeypotField,
  renderRoadCoverage,
  renderWhyChoose,
  renderHowItWorks,
  renderAreasGrid,
  renderDestinations,
  renderFaqSection,
  renderFinalCta,
  renderFooter,
  renderStickyBar,
  renderDocument,
  renderChecklist,
  renderCalloutLink,
  renderSafetyBox,
  renderPageHeader
};
