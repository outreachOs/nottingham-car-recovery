'use strict';

const C = require('../components');
const S = require('../schema');
const { AREAS } = require('../data');

function build() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Areas', href: '/areas' }
  ];

  const hero = C.renderHeroPage({
    eyebrow: 'Coverage',
    title: 'Vehicle Recovery Areas Across Nottingham',
    lead:
      'Local recovery coverage across Nottingham and the surrounding towns listed below. Broader coverage may be available further afield, subject to confirmation.',
    breadcrumbs
  });

  const intro = `<section class="section">
  <div class="container">
    <div class="prose-block">
      <p>Each area below has its own page covering local roads, nearby towns, typical destination options and the main recovery services relevant to that area. If your location is not listed, requests from elsewhere in Nottinghamshire and surrounding areas can still be assessed — broader coverage may be available subject to confirmation.</p>
    </div>
  </div>
</section>`;

  const content = `${hero}
${intro}
${C.renderAreasGrid({ heading: 'Choose Your Area', showViewAll: false, areas: AREAS })}
${C.renderFinalCta({ heading: "Can't See Your Area?" , lead: 'Request a callback and let us know your location — coverage may still be available.'})}`;

  return {
    path: '/areas',
    filename: 'areas.html',
    title: 'Car Recovery Areas Across Nottingham | Local Coverage',
    description:
      'View car and vehicle recovery coverage across Nottingham, including West Bridgford, Beeston, Arnold, Hucknall, Carlton, Bulwell and Clifton.',
    content,
    schemas: [C.breadcrumbSchema(breadcrumbs)]
  };
}

module.exports = { build };
