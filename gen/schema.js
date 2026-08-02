'use strict';

const { DOMAIN, SERVICES } = require('./data');

const ORG_ID = DOMAIN + '/#organization';
const WEBSITE_ID = DOMAIN + '/#website';

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Nottingham Car Recovery',
    url: DOMAIN,
    logo: DOMAIN + '/assets/images/logo.svg',
    areaServed: [
      { '@type': 'City', name: 'Nottingham' },
      { '@type': 'AdministrativeArea', name: 'Nottinghamshire' }
    ]
  };
}

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Nottingham Car Recovery',
    url: DOMAIN,
    publisher: { '@id': ORG_ID }
  };
}

// Homepage only — AutomotiveBusiness (LocalBusiness subtype). No fake
// address, phone, rating, review or opening hours are included since
// none of that information is confirmed yet.
function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': DOMAIN + '/#localbusiness',
    name: 'Nottingham Car Recovery',
    url: DOMAIN,
    areaServed: [
      { '@type': 'City', name: 'Nottingham' },
      { '@type': 'AdministrativeArea', name: 'Nottinghamshire' }
    ],
    makesOffer: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        url: DOMAIN + s.href
      }
    }))
  };
}

// Used for the operator-network page — deliberately WebPage, not
// JobPosting. This page is an expression-of-interest page, not a job
// advert, so JobPosting schema (which implies a defined vacancy, salary
// range, employer address, etc.) would misrepresent what it is.
function webPageSchema(opts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: DOMAIN + opts.path,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID }
  };
}

function serviceSchema(opts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    provider: { '@id': ORG_ID },
    areaServed: opts.areaServed || [
      { '@type': 'City', name: 'Nottingham' },
      { '@type': 'AdministrativeArea', name: 'Nottinghamshire' }
    ],
    serviceType: opts.serviceType || opts.name,
    url: DOMAIN + opts.path
  };
}

module.exports = {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
  serviceSchema,
  webPageSchema
};
