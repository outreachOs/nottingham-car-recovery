'use strict';

const C = require('../components');
const S = require('../schema');
const { HOME_FAQS } = require('../data');

function build() {
  const faq = C.renderFaqSection(HOME_FAQS, {});

  const content = `${C.renderHeroHome()}
${C.renderTrustStrip()}
${C.renderServicesGrid()}
${C.renderCallbackForm({ formId: 'callback-form', formName: 'callback' })}
${C.renderRoadCoverage()}
${C.renderWhyChoose()}
${C.renderHowItWorks()}
${C.renderAreasGrid()}
${C.renderDestinations()}
${faq.html}
${C.renderFinalCta()}`;

  return {
    path: '/',
    filename: 'index.html',
    title: 'Car Recovery Nottingham | Breakdown, Towing & Vehicle Recovery',
    description:
      'Need car recovery in Nottingham? Request breakdown recovery, accident recovery, towing, van recovery or vehicle transport across Nottingham and surrounding areas.',
    content,
    schemas: [S.organizationSchema(), S.websiteSchema(), S.localBusinessSchema(), faq.schema]
  };
}

module.exports = { build };
