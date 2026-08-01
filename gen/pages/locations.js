'use strict';

const C = require('../components');
const S = require('../schema');
const { SERVICES } = require('../data');

function serviceByHref(href) {
  return SERVICES.find((s) => s.href === href);
}

function buildLocationPage(opts) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Areas', href: '/areas' },
    { label: opts.name, href: opts.path }
  ];

  const hero = C.renderHeroPage({
    eyebrow: 'Local Coverage',
    title: `Car Recovery in ${opts.name}`,
    lead: opts.leadHtml,
    breadcrumbs
  });

  const mainServices = opts.mainServiceHrefs.map(serviceByHref).filter(Boolean);

  const needRecoveryBand = C.renderNeedRecoveryBand({
    heading: `Need Vehicle Recovery in ${opts.name}?`,
    leadHtml: `Call <a href="${C.SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click">${C.escapeHtml(C.SITE_CONFIG.phoneDisplay)}</a> — available 24 hours a day.`
  });
  const callbackForm = C.renderCallbackForm({ showPanel: false });

  const body = `<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div class="prose-block">
        <h2>Recovery Around ${opts.name}</h2>
        ${opts.introHtml}

        <h2>Local Roads Covered</h2>
        <p>Requests around ${opts.name} commonly involve the following routes: ${opts.roads.join(', ')}. Sharing the nearest road or junction helps a recovery request be assessed accurately.</p>

        <h2>Nearby Areas</h2>
        <p>${opts.name} sits close to ${opts.nearbyAreas.join(', ')}. Coverage may extend to these nearby areas subject to confirmation.</p>

        <h2>Destination Examples</h2>
        <p>${opts.destinationHtml}</p>

        <h2>Road Safety Guidance</h2>
        <p>${opts.safetyHtml}</p>

        <h2>What Information to Provide</h2>
        ${C.renderChecklist(opts.infoNeeded)}
      </div>
      <aside class="aside-card">
        <h3>Main services in this area</h3>
        <ul>
          ${mainServices.map((s) => `<li><a href="${s.href}">${s.title}</a></li>`).join('\n')}
          <li><a href="/services">All Services</a></li>
        </ul>
        <div class="callout-link">
          <strong>Looking for another area?</strong>
          <a href="/areas">View all recovery areas</a> across Nottingham and surrounding towns.
        </div>
      </aside>
    </div>
  </div>
</section>`;

  const faq = C.renderFaqSection(opts.faqs, {});

  const content = `${hero}
${needRecoveryBand}
${callbackForm}
${body}
${faq.html}
${C.renderFinalCta({ heading: `Need Recovery in ${opts.name}?` })}`;

  return {
    path: opts.path,
    filename: opts.path.replace(/^\//, '') + '.html',
    title: opts.title,
    description: opts.description,
    content,
    schemas: [
      C.breadcrumbSchema(breadcrumbs),
      S.serviceSchema({
        name: `Vehicle Recovery in ${opts.name}`,
        description: opts.description,
        path: opts.path,
        serviceType: 'Vehicle recovery',
        areaServed: [{ '@type': 'Place', name: opts.name }]
      }),
      faq.schema
    ]
  };
}

/* ------------------------------------------------------------ */

function westBridgford() {
  return buildLocationPage({
    path: '/car-recovery-west-bridgford',
    name: 'West Bridgford',
    title: 'Car Recovery West Bridgford | Vehicle Recovery Nottingham',
    description:
      'Car and vehicle recovery covering West Bridgford, Trent Bridge, Edwalton, Gamston and Wilford, with transport to a garage or agreed destination.',
    leadHtml:
      'Breakdown, accident and vehicle transport requests covering West Bridgford and the area south of Trent Bridge.',
    introHtml: `<p>West Bridgford sits directly south of the River Trent, connected to the city centre by Trent Bridge and served by the A52 and A60. It is one of the busier suburbs for through-traffic, particularly around match days and events near the river, which can add to the time it takes to reach a broken-down vehicle in the area.</p>
      <p>Recovery requests here range from vehicles that will not start on residential streets near Edwalton and Gamston, to vehicles that need collecting from retail or leisure car parks closer to the town centre.</p>`,
    roads: ['the A52', 'the A60', 'Trent Bridge'],
    nearbyAreas: ['Edwalton', 'Gamston', 'Wilford'],
    destinationHtml:
      'Common destinations include a local garage in West Bridgford, a bodyshop closer to the city centre, or a home address in Edwalton, Gamston or Wilford.',
    safetyHtml:
      'If you break down near Trent Bridge or on the approach roads, move as far from moving traffic as possible, switch on your hazard lights, and wait somewhere visible and safe before contacting recovery.',
    infoNeeded: [
      'Your exact location, including the nearest road or junction',
      'The vehicle make and type',
      'A brief description of the problem',
      'Your intended destination'
    ],
    mainServiceHrefs: ['/breakdown-recovery-nottingham', '/accident-recovery-nottingham'],
    faqs: [
      {
        question: 'Do you cover all of West Bridgford?',
        answer: 'Requests across West Bridgford, including areas towards Edwalton and Gamston, can be assessed. Coverage is confirmed based on your specific location.'
      },
      {
        question: 'Can you collect a vehicle from a car park in West Bridgford?',
        answer: 'Yes, subject to access. Please mention any barriers, height restrictions or opening hours that may apply.'
      },
      {
        question: 'Is recovery available across Trent Bridge into the city centre?',
        answer: 'Yes, vehicles can be transported between West Bridgford and the city centre, or to another agreed destination.'
      },
      {
        question: 'What if my vehicle broke down near a match or event?',
        answer: 'Let us know if there is an event nearby, as this can affect access and timing. Please stay somewhere safe while the request is assessed.'
      }
    ]
  });
}

function beeston() {
  return buildLocationPage({
    path: '/car-recovery-beeston',
    name: 'Beeston',
    title: 'Car Recovery Beeston | Vehicle Recovery Nottingham',
    description:
      'Car and vehicle recovery covering Beeston, University Boulevard, Chilwell, Attenborough and Stapleford, with transport to a garage or agreed destination.',
    leadHtml:
      'Breakdown, accident and vehicle transport requests covering Beeston and the surrounding university and retail areas.',
    introHtml: `<p>Beeston lies west of Nottingham city centre, close to University Boulevard and the University of Nottingham's Jubilee Campus, with the A52 and A6005 carrying much of the through-traffic. The area combines residential streets, student housing and the retail park around Chilwell, all of which can affect where a vehicle is found and how it is best collected.</p>
      <p>Requests here often involve vehicles parked on tighter residential roads near the town centre, as well as breakdowns on the busier approach roads towards Chilwell and Stapleford.</p>`,
    roads: ['the A52', 'the A6005', 'University Boulevard'],
    nearbyAreas: ['Chilwell', 'Attenborough', 'Stapleford'],
    destinationHtml:
      'Vehicles are commonly transported to a garage in Beeston or Chilwell, a home address, or another agreed destination such as a bodyshop.',
    safetyHtml:
      'On busier roads such as University Boulevard, pull onto a side road or safe parking area where possible, use hazard lights, and avoid standing near moving traffic while you wait.',
    infoNeeded: [
      'Your location, including the nearest road, junction or landmark',
      'The vehicle make and type',
      'Whether the vehicle can be moved safely',
      'Your intended destination'
    ],
    mainServiceHrefs: ['/breakdown-recovery-nottingham', '/car-towing-vehicle-transport-nottingham'],
    faqs: [
      {
        question: 'Do you cover Beeston town centre and Chilwell?',
        answer: 'Yes, requests across Beeston and neighbouring Chilwell can be assessed and confirmed based on your exact location.'
      },
      {
        question: 'Can you collect a vehicle from a student residential street?',
        answer: 'Yes, subject to access such as parking restrictions or narrow streets, which is helpful to mention when requesting recovery.'
      },
      {
        question: 'Do you cover breakdowns near the retail park?',
        answer: 'Yes, vehicles that break down near the Chilwell retail area can be assessed for collection and transport.'
      },
      {
        question: 'Can a vehicle be taken from Beeston to a garage elsewhere in Nottingham?',
        answer: 'Yes, transport across Nottingham and surrounding areas can be arranged to your chosen suitable destination.'
      }
    ]
  });
}

function arnold() {
  return buildLocationPage({
    path: '/car-recovery-arnold',
    name: 'Arnold',
    title: 'Car Recovery Arnold | Vehicle Recovery Nottingham',
    description:
      'Car and vehicle recovery covering Arnold, Mapperley, Daybrook, Redhill and Bestwood, with transport to a garage or agreed destination.',
    leadHtml:
      'Breakdown, accident and vehicle transport requests covering Arnold and the northern suburbs of Nottingham.',
    introHtml: `<p>Arnold is a residential suburb to the north of Nottingham, linked to the city by the A60 and connected locally by the A6211. The area covers a mix of housing estates around Daybrook and Redhill, with Mapperley and Bestwood close by, meaning recovery requests can range from quiet cul-de-sacs to the busier stretch of the A60 itself.</p>
      <p>Vehicles here are often collected from home driveways or nearby side streets, as well as from the main road corridors connecting Arnold to the rest of the city.</p>`,
    roads: ['the A60', 'the A6211'],
    nearbyAreas: ['Mapperley', 'Daybrook', 'Redhill', 'Bestwood'],
    destinationHtml:
      'Destinations typically include a garage in or around Arnold, a home address in Daybrook or Redhill, or another suitable location you choose.',
    safetyHtml:
      'If you break down on the A60, try to reach a side road or safe pull-in where possible, keep hazard lights on, and stay well away from passing traffic until help arrives.',
    infoNeeded: [
      'Your location, including the nearest road or estate',
      'The vehicle make and type',
      'What has happened to the vehicle',
      'Your intended destination'
    ],
    mainServiceHrefs: ['/breakdown-recovery-nottingham', '/van-commercial-recovery-nottingham'],
    faqs: [
      {
        question: 'Do you cover Arnold and the surrounding estates?',
        answer: 'Yes, Arnold and nearby areas including Daybrook and Redhill can be assessed for recovery requests.'
      },
      {
        question: 'Can you recover a vehicle from a residential driveway in Arnold?',
        answer: 'Yes, subject to access. Please describe the driveway or parking area when making your request.'
      },
      {
        question: 'Do you cover breakdowns on the A60 near Arnold?',
        answer: 'Yes, breakdowns along the A60 corridor near Arnold can be assessed and recovered once you are in a safe position.'
      },
      {
        question: 'Can vans be recovered in Arnold?',
        answer: 'Yes, suitable work vans and light commercial vehicles can be recovered from the Arnold area.'
      }
    ]
  });
}

function hucknall() {
  return buildLocationPage({
    path: '/car-recovery-hucknall',
    name: 'Hucknall',
    title: 'Car Recovery Hucknall | Vehicle Recovery Nottingham',
    description:
      'Car and vehicle recovery covering Hucknall, Linby, Papplewick and Bulwell, with transport to a garage or agreed destination.',
    leadHtml: 'Breakdown, accident and vehicle transport requests covering Hucknall and the northern edge of Nottingham.',
    introHtml: `<p>Hucknall sits on the northern edge of the Nottingham urban area, reached via the A611 and A6002, with the smaller villages of Linby and Papplewick close by and Bulwell forming the link back towards the city. The tram terminus and town centre create a busy hub, while surrounding roads tend to be quieter, which affects how a vehicle is best located and collected.</p>
      <p>Requests in Hucknall range from town centre car parks to more rural stretches of road towards Linby and Papplewick.</p>`,
    roads: ['the A611', 'the A6002'],
    nearbyAreas: ['Linby', 'Papplewick', 'Bulwell', 'Arnold'],
    destinationHtml:
      'Vehicles can be transported to a garage in Hucknall, a home address in the surrounding villages, or another agreed suitable destination.',
    safetyHtml:
      'On quieter rural roads near Linby and Papplewick, pull as far off the carriageway as possible, use hazard lights, and be visible to approaching traffic while you wait.',
    infoNeeded: [
      'Your location, including the nearest road or village',
      'The vehicle make and type',
      'A description of the fault or damage',
      'Your intended destination'
    ],
    mainServiceHrefs: ['/breakdown-recovery-nottingham', '/car-towing-vehicle-transport-nottingham'],
    faqs: [
      {
        question: 'Do you cover Hucknall town centre and the surrounding villages?',
        answer: 'Yes, Hucknall along with nearby Linby and Papplewick can be assessed for recovery requests.'
      },
      {
        question: 'Can you collect from a rural road near Hucknall?',
        answer: 'Yes, subject to a safe collection point being available. Please describe the road and any nearby landmarks.'
      },
      {
        question: 'Do you cover the route between Hucknall and Bulwell?',
        answer: 'Yes, this corridor is within the area covered for recovery and transport requests.'
      },
      {
        question: 'Can transport be booked in advance from Hucknall?',
        answer: 'Yes, planned collection and delivery can be arranged ahead of time for non-runners or scheduled garage visits.'
      }
    ]
  });
}

function carltonGedling() {
  return buildLocationPage({
    path: '/car-recovery-carlton-gedling',
    name: 'Carlton & Gedling',
    title: 'Car Recovery Carlton & Gedling | Vehicle Recovery Nottingham',
    description:
      'Car and vehicle recovery covering Carlton, Gedling, Netherfield, Mapperley and Burton Joyce, with transport to a garage or agreed destination.',
    leadHtml: 'Breakdown, accident and vehicle transport requests covering Carlton, Gedling and the eastern suburbs.',
    introHtml: `<p>Carlton and Gedling form a connected stretch of suburbs to the east of Nottingham, served by the A612 and the Colwick Loop Road. The area takes in Netherfield and reaches out towards Burton Joyce and Mapperley, with a mix of residential streets and busier link roads feeding traffic towards the city.</p>
      <p>Recovery requests here often involve vehicles on residential roads in Carlton or Netherfield, as well as breakdowns along the Colwick Loop Road itself.</p>`,
    roads: ['the A612', 'Colwick Loop Road'],
    nearbyAreas: ['Netherfield', 'Mapperley', 'Burton Joyce'],
    destinationHtml:
      'Destinations typically include a garage in Carlton or Gedling, a home address nearby, or another suitable location you choose.',
    safetyHtml:
      'If you break down on the Colwick Loop Road or the A612, move to the verge or a safe side road where possible, switch on hazard lights, and stay clear of passing traffic.',
    infoNeeded: [
      'Your location, including the nearest road or landmark',
      'The vehicle make and type',
      'What has happened to the vehicle',
      'Your intended destination'
    ],
    mainServiceHrefs: ['/breakdown-recovery-nottingham', '/accident-recovery-nottingham'],
    faqs: [
      {
        question: 'Do you cover both Carlton and Gedling?',
        answer: 'Yes, both areas and the connecting roads between them are covered for recovery requests.'
      },
      {
        question: 'Can you recover a vehicle on the Colwick Loop Road?',
        answer: 'Yes, once you are safely positioned away from moving traffic, a recovery request can be arranged.'
      },
      {
        question: 'Do you cover Netherfield and Burton Joyce?',
        answer: 'Yes, these nearby areas fall within the coverage for Carlton and Gedling requests, subject to confirmation.'
      },
      {
        question: 'Can an accident-damaged vehicle be collected from this area?',
        answer: 'Yes, once the scene is safe, accident recovery can be arranged to a garage, bodyshop or another agreed destination.'
      }
    ]
  });
}

function bulwell() {
  return buildLocationPage({
    path: '/car-recovery-bulwell',
    name: 'Bulwell',
    title: 'Car Recovery Bulwell | Vehicle Recovery Nottingham',
    description:
      'Car and vehicle recovery covering Bulwell, Basford, Bestwood, Hucknall and the M1 junction 26 area, with transport to a garage or agreed destination.',
    leadHtml: 'Breakdown, accident and vehicle transport requests covering Bulwell and the connecting routes to the M1.',
    introHtml: `<p>Bulwell sits to the north-west of Nottingham city centre, connected by the A610 and A6002 and within easy reach of the M1 via junction 26. The area combines a busy local high street with residential streets stretching towards Basford and Bestwood, and its position on the A610 corridor means it also sees a good deal of through-traffic heading to and from the motorway.</p>
      <p>Requests here range from breakdowns on residential roads to vehicles that need recovering from the A610 itself on the approach to the motorway.</p>`,
    roads: ['the A610', 'the A6002', 'the M1 junction 26 approach roads'],
    nearbyAreas: ['Basford', 'Bestwood', 'Hucknall'],
    destinationHtml:
      'Vehicles can be transported to a garage in Bulwell or Basford, a home address, or another agreed destination, including onward transport towards the M1.',
    safetyHtml:
      'On the A610 or the approach to M1 junction 26, move as far from moving traffic as possible, use hazard lights, and stay in a safe position until recovery arrives.',
    infoNeeded: [
      'Your location, including the nearest road or junction',
      'The vehicle make and type',
      'A description of the fault or damage',
      'Your intended destination'
    ],
    mainServiceHrefs: ['/breakdown-recovery-nottingham', '/m1-breakdown-recovery-nottingham'],
    faqs: [
      {
        question: 'Do you cover Bulwell and the A610?',
        answer: 'Yes, Bulwell and the surrounding A610 corridor are covered for recovery requests.'
      },
      {
        question: 'Can you recover a vehicle near M1 junction 26?',
        answer: 'Yes, the approach roads around junction 26 fall within the area covered — see our M1 recovery page for motorway-specific guidance.'
      },
      {
        question: 'Do you cover Basford and Bestwood?',
        answer: 'Yes, these neighbouring areas are covered subject to confirmation of your exact location.'
      },
      {
        question: 'Can a van be recovered from Bulwell?',
        answer: 'Yes, suitable work vans and light commercial vehicles can be recovered from the Bulwell area.'
      }
    ]
  });
}

function clifton() {
  return buildLocationPage({
    path: '/car-recovery-clifton',
    name: 'Clifton',
    title: 'Car Recovery Clifton | Vehicle Recovery Nottingham',
    description:
      'Car and vehicle recovery covering Clifton, Clifton Boulevard, M1 junction 24, Wilford and Ruddington, with transport to a garage or agreed destination.',
    leadHtml: 'Breakdown, accident and vehicle transport requests covering Clifton and the M1 junction 24 area.',
    introHtml: `<p>Clifton is one of Nottingham's largest residential estates, south of the River Trent and close to M1 junction 24, with Clifton Boulevard forming a key route through the area and on towards the A453. Its size and proximity to the motorway mean requests here range from quiet residential closes to breakdowns close to the M1 itself.</p>
      <p>Recovery is arranged whether your vehicle is parked at home in Clifton or has broken down on one of the busier roads linking the estate to the wider network.</p>`,
    roads: ['the A453', 'M1 junction 24', 'Clifton Boulevard'],
    nearbyAreas: ['Wilford', 'Ruddington'],
    destinationHtml:
      'Destinations commonly include a garage in Clifton or nearby, a home address, or onward transport towards the motorway network.',
    safetyHtml:
      'Near M1 junction 24, treat the motorway with particular care — see our dedicated M1 recovery guidance. On Clifton Boulevard, pull into a safe side road where possible and keep hazard lights on.',
    infoNeeded: [
      'Your location, including the nearest road or junction',
      'The vehicle make and type',
      'Whether you are on a residential street or a main road',
      'Your intended destination'
    ],
    mainServiceHrefs: ['/m1-breakdown-recovery-nottingham', '/breakdown-recovery-nottingham'],
    faqs: [
      {
        question: 'Do you cover Clifton and the M1 junction 24 area?',
        answer: 'Yes, Clifton and the approach roads to M1 junction 24 are covered — see our M1 recovery page for motorway-specific guidance.'
      },
      {
        question: 'Can you collect a vehicle from a residential street in Clifton?',
        answer: 'Yes, subject to access. Please describe the street and any parking restrictions when requesting recovery.'
      },
      {
        question: 'Do you cover Wilford and Ruddington as well?',
        answer: 'Yes, these nearby areas are covered subject to confirmation of your exact location.'
      },
      {
        question: 'Can onward transport be arranged from Clifton towards the motorway?',
        answer: 'Yes, vehicles can be transported towards the M1 network or another agreed destination as needed.'
      }
    ]
  });
}

function longEaton() {
  return buildLocationPage({
    path: '/car-recovery-long-eaton',
    name: 'Long Eaton',
    title: 'Car Recovery Long Eaton | Vehicle Recovery Nottingham',
    description:
      'Car and vehicle recovery covering Long Eaton, Sawley, Toton, Stapleford and M1 junctions 24 and 25, with transport to a garage or agreed destination.',
    leadHtml: 'Breakdown, accident and vehicle transport requests covering Long Eaton and the M1 corridor towards Nottingham.',
    introHtml: `<p>Long Eaton lies on the western edge of the wider Nottingham area, close to M1 junctions 24 and 25 and served locally by the A52. It sits alongside Sawley and Toton, with Stapleford and Beeston forming the link back towards Nottingham itself, making it a common point for both local breakdowns and motorway-adjacent recovery requests.</p>
      <p>Vehicles here are recovered from residential streets, retail areas and the busier roads feeding traffic on and off the motorway network.</p>`,
    roads: ['the A52', 'M1 junction 24', 'M1 junction 25'],
    nearbyAreas: ['Sawley', 'Toton', 'Stapleford', 'Beeston'],
    destinationHtml:
      'Vehicles can be transported to a garage in Long Eaton, a home address in Sawley or Toton, or another agreed destination, including onward transport towards Nottingham.',
    safetyHtml:
      'Close to M1 junctions 24 and 25, follow our motorway safety guidance if you break down on the motorway itself. On local roads, pull over safely, use hazard lights, and stay clear of moving traffic.',
    infoNeeded: [
      'Your location, including the nearest road or junction',
      'The vehicle make and type',
      'A description of the fault or damage',
      'Your intended destination'
    ],
    mainServiceHrefs: ['/m1-breakdown-recovery-nottingham', '/car-towing-vehicle-transport-nottingham'],
    faqs: [
      {
        question: 'Do you cover Long Eaton and the M1 junctions 24 and 25 area?',
        answer: 'Yes, Long Eaton and the surrounding motorway junctions are covered — see our M1 recovery page for motorway-specific guidance.'
      },
      {
        question: 'Can you collect a vehicle from Sawley or Toton?',
        answer: 'Yes, these neighbouring areas are covered subject to confirmation of your exact location.'
      },
      {
        question: 'Can you transport a vehicle from Long Eaton towards Nottingham?',
        answer: 'Yes, onward transport towards Nottingham, Stapleford or Beeston can be arranged as part of your request.'
      },
      {
        question: 'Is planned transport available for Long Eaton addresses?',
        answer: 'Yes, planned collection and delivery can be booked in advance for non-runners or scheduled garage visits.'
      }
    ]
  });
}

module.exports = {
  build: () => [
    westBridgford(),
    beeston(),
    arnold(),
    hucknall(),
    carltonGedling(),
    bulwell(),
    clifton(),
    longEaton()
  ]
};
