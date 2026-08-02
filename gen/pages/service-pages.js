'use strict';

const C = require('../components');
const S = require('../schema');

function buildServicePage(opts) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: opts.breadcrumbLabel, href: opts.path }
  ];

  const hero = C.renderHeroPage({
    eyebrow: opts.eyebrow,
    title: opts.h1,
    lead: opts.lead,
    breadcrumbs
  });

  const faq = C.renderFaqSection(opts.faqs, {});

  const needRecoveryBand = C.renderNeedRecoveryBand({});
  const callbackForm = C.renderCallbackForm({ showPanel: false });

  const coverageSection = `<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div class="prose-block">
        ${opts.bodyHtml}
      </div>
      <aside class="aside-card">
        <h3>Other recovery services</h3>
        <ul>
          ${opts.otherServices
            .map((s) => `<li><a href="${s.href}">${s.title}</a></li>`)
            .join('\n')}
          ${(opts.extraAsideLinks || [])
            .map((l) => `<li><a href="${l.href}">${l.title}</a></li>`)
            .join('\n')}
        </ul>
        ${opts.contextualLink ? C.renderCalloutLink(opts.contextualLink.href, opts.contextualLink.label, opts.contextualLink.text) : ''}
      </aside>
    </div>
  </div>
</section>`;

  const content = `${hero}
${needRecoveryBand}
${callbackForm}
${coverageSection}
${faq.html}
${C.renderFinalCta()}`;

  return {
    path: opts.path,
    filename: opts.path.replace(/^\//, '') + '.html',
    title: opts.title,
    description: opts.description,
    content,
    schemas: [
      C.breadcrumbSchema(breadcrumbs),
      S.serviceSchema({ name: opts.serviceName, description: opts.description, path: opts.path, serviceType: opts.serviceType }),
      faq.schema
    ]
  };
}

const { SERVICES } = require('../data');
function others(exceptHref) {
  return SERVICES.filter((s) => s.href !== exceptHref);
}

/* ---------------------------- Breakdown ---------------------------- */
function breakdown() {
  return buildServicePage({
    path: '/breakdown-recovery-nottingham',
    breadcrumbLabel: 'Breakdown Recovery',
    eyebrow: 'Breakdown Recovery',
    h1: 'Breakdown Recovery in Nottingham',
    lead:
      'One-off breakdown recovery for cars, vans and suitable light commercial vehicles across Nottingham — no annual membership required.',
    title: 'Breakdown Recovery Nottingham | Car & Van Recovery',
    description:
      'Broken down in Nottingham? Request recovery for a car, van or suitable light commercial vehicle to a garage, home or another agreed destination.',
    serviceName: 'Breakdown Recovery',
    serviceType: 'Breakdown recovery',
    otherServices: others('/breakdown-recovery-nottingham'),
    extraAsideLinks: [
      { href: '/recovery-without-breakdown-cover-nottingham', title: 'Recovery Without Breakdown Cover' },
      { href: '/car-wont-start-recovery-nottingham', title: "Car Won't Start Recovery" }
    ],
    ctaHeading: 'Broken Down in Nottingham?',
    bodyHtml: `
      <h2>What This Service Covers</h2>
      <p>Breakdown recovery is a one-off collection service for cars, vans and suitable light commercial vehicles that cannot safely continue their journey. It is available whether or not you hold an existing breakdown membership.</p>
      ${C.renderChecklist([
        'Non-starting vehicles',
        'Mechanical faults that prevent the vehicle from being driven',
        'Punctures where the vehicle cannot continue safely',
        'Vehicles that are otherwise unsafe to drive'
      ])}

      <h2>Collection From Home, Work or the Roadside</h2>
      <p>Vehicles can be collected from a home address, a workplace car park or the roadside, subject to access and a safe collection point being available. Let us know exactly where the vehicle is and any access restrictions, such as narrow driveways, gated car parks or restricted-hours car parks.</p>

      <h2>Recovery Without Membership</h2>
      <p>You do not need an annual breakdown policy to request help. A one-off recovery job can be arranged with a clear quote confirmed before dispatch.</p>

      <h2>Garage, Home or Agreed Destination</h2>
      <p>Once collected, your vehicle can be transported to a garage, your home address, or another agreed suitable destination. Destination options are discussed and confirmed as part of the request.</p>

      <h2>What We Do Not Provide</h2>
      <p>This service covers collection and transport only. Roadside mechanical repair is not provided — if your vehicle cannot be made driveable at the roadside, it will be recovered to a suitable destination instead.</p>

      <h2>Details Needed Before Dispatch</h2>
      <p>To assess and confirm your request, please have the following ready: your current location, the vehicle make and type, a brief description of the fault, and your intended destination.</p>
    `,
    faqs: [
      {
        question: 'Can I request breakdown recovery without membership?',
        answer: 'Yes. Breakdown recovery is available as a one-off service and does not require an annual membership or existing breakdown policy.'
      },
      {
        question: 'Can you recover a vehicle from home?',
        answer: 'Yes, subject to access. Please describe the collection point, including anything that might restrict access such as a narrow driveway or gated car park.'
      },
      {
        question: 'Can you take the vehicle to my chosen garage?',
        answer: 'In most cases, yes. Destination options include your chosen garage, home address or another agreed suitable location, subject to confirmation.'
      },
      {
        question: 'What details do you need?',
        answer: 'Your location, the vehicle make and type, a description of the fault, and your intended destination, so the request can be assessed accurately.'
      },
      {
        question: 'Can you recover a van?',
        answer: 'Yes. Work vans and suitable light commercial vehicles can be recovered, provided they fall within the suitable size and weight range.'
      }
    ]
  });
}

/* ---------------------------- Accident ---------------------------- */
function accident() {
  return buildServicePage({
    path: '/accident-recovery-nottingham',
    breadcrumbLabel: 'Accident Recovery',
    eyebrow: 'Accident Recovery',
    h1: 'Accident Recovery in Nottingham',
    lead:
      'Careful recovery and transport for accident-damaged or non-drivable cars and vans across Nottingham, once the scene is safe.',
    title: 'Accident Recovery Nottingham | Damaged Vehicle Recovery',
    description:
      'Request accident recovery in Nottingham for damaged or non-drivable cars and vans, with careful transport to a garage, bodyshop or agreed destination.',
    serviceName: 'Accident Recovery',
    serviceType: 'Accident-damaged vehicle recovery',
    otherServices: others('/accident-recovery-nottingham'),
    ctaHeading: 'Need Accident Recovery?',
    contextualLink: {
      href: '/car-towing-vehicle-transport-nottingham',
      label: 'Planning ahead instead?',
      text: 'For scheduled transport rather than an emergency, see our car towing and vehicle transport page.'
    },
    bodyHtml: `
      <h2>Safety First</h2>
      <p>If anyone is injured or the scene is dangerous, contact emergency services first by calling 999. Vehicle recovery should only be arranged once the scene has been made safe and, where relevant, emergency services have finished attending.</p>

      <h2>What This Service Covers</h2>
      ${C.renderChecklist([
        'Collision-damaged vehicles',
        'Vehicles that still start but are unsafe to drive further',
        'Concerns with steering, wheels, tyres, suspension or bodywork',
        'Roadside, home or safe-location collection once the scene is clear'
      ])}

      <h2>Non-Drivable Vehicle Recovery</h2>
      <p>Where a vehicle cannot be driven safely, it is loaded and transported rather than towed on its wheels, protecting the vehicle and other road users.</p>

      <h2>Where Your Vehicle Can Be Taken</h2>
      <p>Accident-damaged vehicles are commonly transported to a garage, bodyshop, home address or another secure destination you choose, subject to suitability and confirmation.</p>

      <h2>After Emergency Services Clear the Scene</h2>
      <p>If police, fire or ambulance services have attended, recovery is arranged once they confirm the scene is clear and it is safe to move the vehicle.</p>
    `,
    faqs: [
      {
        question: 'Can you recover a damaged vehicle that still starts?',
        answer: 'Yes. Even if a vehicle starts, it may not be safe to drive if there is damage to steering, wheels, tyres, suspension or bodywork. It can still be recovered and transported.'
      },
      {
        question: 'Where can an accident-damaged vehicle be taken?',
        answer: 'Common destinations include a garage, bodyshop, home address or another secure location you choose, subject to suitability and confirmation.'
      },
      {
        question: 'What details are needed?',
        answer: 'Your location, a description of the damage, whether the vehicle can be started or moved, and your intended destination.'
      },
      {
        question: 'Can collection happen after emergency services clear the scene?',
        answer: 'Yes. Recovery is arranged once the scene has been made safe and any attending emergency services confirm it is clear to proceed.'
      }
    ]
  });
}

/* ------------------------------- M1 --------------------------------- */
function m1() {
  return buildServicePage({
    path: '/m1-breakdown-recovery-nottingham',
    breadcrumbLabel: 'M1 Recovery',
    eyebrow: 'M1 Recovery',
    h1: 'Breakdown Recovery on the M1 Near Nottingham',
    lead:
      'Car and van recovery around M1 junctions 24, 25 and 26 near Nottingham, arranged once you are safely positioned.',
    title: 'M1 Breakdown Recovery Nottingham | Junctions 24, 25 & 26',
    description:
      'Broken down on the M1 near Nottingham? Request car or van recovery around junctions 24, 25 and 26 once you are in a safe location.',
    serviceName: 'M1 Breakdown Recovery',
    serviceType: 'Motorway breakdown recovery',
    otherServices: others('/m1-breakdown-recovery-nottingham'),
    ctaHeading: 'Broken Down Near the M1?',
    contextualLink: {
      href: '/car-towing-vehicle-transport-nottingham',
      label: 'Need onward transport?',
      text: 'Once recovered from the motorway, your vehicle can be transported on to a garage or other destination.'
    },
    bodyHtml: `
      <h2>Coverage Around Junctions 24, 25 and 26</h2>
      <p>Recovery requests are covered around M1 junctions 24, 25 and 26 near Nottingham, along with connecting routes including the A453, A52 and A610. Please share your direction of travel and any junction or marker post information visible near you, as this helps locate you accurately.</p>

      <h2>What We Can Assist With</h2>
      ${C.renderChecklist([
        'Cars, vans and suitable light commercial vehicles',
        'Collection once you are safely positioned in a service area, emergency area or on the hard shoulder where present',
        'Onward transport to a garage or another agreed destination'
      ])}

      <h2>What This Service Does Not Cover</h2>
      <p>Recovery cannot be arranged for a vehicle stopped in a live traffic lane — this is a matter for the emergency services and the motorway operator. We do not hold detailed knowledge of each individual lay-by or emergency refuge area on the network, and arrival times cannot be guaranteed. This service is not affiliated with or approved by National Highways.</p>

      ${C.renderSafetyBox('If You Break Down on the M1', [
        'Where possible, leave the motorway at the next junction or services.',
        'If you cannot leave the motorway, aim for a service area, emergency area or the hard shoulder where present.',
        'Switch on your hazard lights.',
        'If it is safe to do so, exit the vehicle away from moving traffic and move behind a barrier.',
        'Call 999 immediately if you are in a live lane or in danger.',
        'Where available, use a roadside emergency telephone to contact the road operator.',
        'Only contact us for recovery once you are safely positioned.'
      ])}
    `,
    faqs: [
      {
        question: 'Can you recover a vehicle stopped in a live lane?',
        answer: 'No. A vehicle stopped in a live lane is a matter for the emergency services and the motorway operator. Please call 999 and only contact us once you are safely positioned away from moving traffic.'
      },
      {
        question: 'Which junctions do you cover on the M1?',
        answer: 'Requests are covered around junctions 24, 25 and 26 near Nottingham, along with connecting routes such as the A453, A52 and A610.'
      },
      {
        question: 'What if I do not know my exact location?',
        answer: 'Look for the nearest junction number, a marker post, or any visible road signs, and share these along with your direction of travel so your position can be identified.'
      },
      {
        question: 'Can vans be recovered from the M1?',
        answer: 'Yes, suitable vans and light commercial vehicles can be recovered from the M1 near Nottingham, subject to confirmation.'
      }
    ]
  });
}

/* ---------------------------- Transport ---------------------------- */
function transport() {
  return buildServicePage({
    path: '/car-towing-vehicle-transport-nottingham',
    breadcrumbLabel: 'Car Towing & Transport',
    eyebrow: 'Towing & Transport',
    h1: 'Car Towing and Vehicle Transport in Nottingham',
    lead:
      'Planned collection and delivery for non-runners, garage appointments, purchased vehicles and general vehicle transport across Nottingham.',
    title: 'Car Towing & Vehicle Transport Nottingham | Collection & Delivery',
    description:
      'Car towing and vehicle transport across Nottingham for non-runners, garage appointments, purchased vehicles and planned collection or delivery.',
    serviceName: 'Car Towing & Vehicle Transport',
    serviceType: 'Vehicle transport',
    otherServices: others('/car-towing-vehicle-transport-nottingham'),
    extraAsideLinks: [
      { href: '/long-distance-car-transport-nottingham', title: 'Long-Distance Car Transport' },
      { href: '/garage-vehicle-collection-delivery-nottingham', title: 'Garage Collection & Delivery' }
    ],
    ctaHeading: 'Need Vehicle Transport?',
    contextualLink: {
      href: '/auction-non-runner-collection-nottingham',
      label: 'Collecting an auction purchase?',
      text: 'See our auction and non-runner collection page for details specific to purchased vehicles.'
    },
    bodyHtml: `
      <h2>Planned Collection and Delivery</h2>
      <p>This service covers scheduled vehicle transport rather than emergency breakdown response — useful whenever you know in advance that a vehicle needs to move from one place to another.</p>
      ${C.renderChecklist([
        'Non-runners that cannot be driven',
        'Home-to-garage and garage-to-garage transport',
        'Bodyshop transport for repair work',
        'Purchased vehicle delivery',
        'Unsafe-to-drive vehicles'
      ])}

      <h2>Advance Booking</h2>
      <p>Transport can be booked ahead of time, which helps with planning around garage appointments, moving day timings or auction collection windows.</p>

      <h2>Access and Loading</h2>
      <p>Please let us know about anything that could affect collection or delivery, such as narrow access roads, low bridges, gated sites, or restricted opening hours at either address.</p>

      <h2>Vehicle Condition Checks</h2>
      <p>Before dispatch, we ask whether the vehicle starts, rolls, steers and brakes. This helps confirm the right approach for loading and unloading safely.</p>
    `,
    faqs: [
      {
        question: 'Can you transport a car that does not start?',
        answer: 'Yes. Non-runners can be transported using suitable loading equipment, provided the vehicle can be safely moved onto the transport.'
      },
      {
        question: 'Can you take my vehicle to a chosen garage?',
        answer: 'Yes, garage-to-garage and home-to-garage transport can be arranged to a destination of your choice, subject to confirmation.'
      },
      {
        question: 'Can transport be booked in advance?',
        answer: 'Yes. Planned transport can be scheduled ahead of time to suit garage appointments, moving dates or collection windows.'
      },
      {
        question: 'What information is needed for a quote?',
        answer: 'The collection and destination addresses, the vehicle make and type, whether it starts, rolls, steers and brakes, and any access restrictions at either location.'
      }
    ]
  });
}

/* ------------------------------- Van ---------------------------------- */
function van() {
  return buildServicePage({
    path: '/van-commercial-recovery-nottingham',
    breadcrumbLabel: 'Van Recovery',
    eyebrow: 'Van Recovery',
    h1: 'Van and Light Commercial Vehicle Recovery in Nottingham',
    lead:
      'Recovery and transport for work vans and suitable light commercial vehicles across Nottingham, with size and weight confirmed before dispatch.',
    title: 'Van Recovery Nottingham | Work Vans & Light Commercial Vehicles',
    description:
      'Request van recovery across Nottingham for suitable work vans and light commercial vehicles, with transport to a garage or agreed destination.',
    serviceName: 'Van & Light Commercial Vehicle Recovery',
    serviceType: 'Van recovery',
    otherServices: others('/van-commercial-recovery-nottingham'),
    ctaHeading: 'Need Van Recovery?',
    contextualLink: {
      href: '/car-towing-vehicle-transport-nottingham',
      label: 'Planning a scheduled move?',
      text: 'For advance-booked transport rather than a breakdown, see our car towing and vehicle transport page.'
    },
    bodyHtml: `
      <h2>What This Service Covers</h2>
      <p>Work vans and suitable light commercial vehicles can be recovered and transported, provided they fall within a suitable size and weight range.</p>
      ${C.renderChecklist([
        'Non-starting vans',
        'Mechanical faults',
        'Punctures',
        'Accident damage',
        'Delivery to a garage or business premises'
      ])}

      <h2>Size and Weight Confirmation</h2>
      <p>Before a job is confirmed, we ask for the van's make and model, and whether it is loaded, so size and weight can be checked against what is suitable for standard van recovery equipment.</p>

      <h2>Loaded Vehicle Assessment</h2>
      <p>If the van is carrying tools, stock or equipment, please mention this when requesting recovery, as it may affect suitability and how the vehicle is loaded and secured.</p>

      <h2>What This Service Does Not Cover</h2>
      <p>This service is for suitable vans and light commercial vehicles only. We do not claim to cover every commercial vehicle, unlimited weights, fleet contracts or priority business accounts. Suitability is confirmed on a job-by-job basis.</p>
    `,
    faqs: [
      {
        question: 'What types of vans can you recover?',
        answer: "The service covers suitable work vans and light commercial vehicles, subject to confirmation of the vehicle's size, weight, condition, load and location before dispatch."
      },
      {
        question: 'Can a loaded van be recovered?',
        answer: 'In many cases, yes, subject to confirmation of size and weight. Please mention if the van is carrying tools, stock or equipment when you make your request.'
      },
      {
        question: 'Is the size and weight checked before dispatch?',
        answer: 'Yes. The van make, model and load are checked against suitable recovery equipment before the job is confirmed.'
      },
      {
        question: 'Can you deliver to a business address?',
        answer: 'Yes, business premises are a common destination option, subject to access and confirmation.'
      }
    ]
  });
}

/* ------------------------------ Auction --------------------------------- */
function auction() {
  return buildServicePage({
    path: '/auction-non-runner-collection-nottingham',
    breadcrumbLabel: 'Auction & Non-Runner Collection',
    eyebrow: 'Auction & Non-Runner Collection',
    h1: 'Auction and Non-Runner Vehicle Collection in Nottingham',
    lead:
      'Planned collection and delivery for auction purchases, non-runners and project vehicles across Nottingham.',
    title: 'Auction & Non-Runner Vehicle Collection Nottingham',
    description:
      'Auction and non-runner vehicle collection across Nottingham for purchased, damaged and non-driving vehicles requiring planned transport.',
    serviceName: 'Auction & Non-Runner Vehicle Collection',
    serviceType: 'Non-runner vehicle collection',
    otherServices: others('/auction-non-runner-collection-nottingham'),
    extraAsideLinks: [
      { href: '/long-distance-car-transport-nottingham', title: 'Long-Distance Car Transport' }
    ],
    ctaHeading: 'Need a Vehicle Collected?',
    contextualLink: {
      href: '/car-towing-vehicle-transport-nottingham',
      label: 'Moving a vehicle you already own?',
      text: 'See our car towing and vehicle transport page for garage-to-garage and home moves.'
    },
    bodyHtml: `
      <h2>Collection Points</h2>
      ${C.renderChecklist([
        'Auction sites',
        'Storage sites',
        'Garages',
        'Private addresses'
      ])}
      <p>This service arranges transport based on your instructions — it is not a formal partnership with, or endorsed by, any auction company.</p>

      <h2>Vehicle Types Covered</h2>
      <p>Purchased vehicles, vehicles without a current MOT, non-running vehicles and damaged vehicles can typically be collected, subject to suitability and confirmation.</p>

      <h2>Before Collection</h2>
      <p>Please let us know whether keys are available, and whether the vehicle starts, rolls, steers and brakes. This affects the equipment and approach needed for a safe collection.</p>

      <h2>Release Documents and Access</h2>
      <p>You are responsible for arranging any release documentation and payment required by the auction site or seller. Please also flag any access restrictions at the collection point, such as site opening hours or entry requirements, so a collection appointment can be arranged.</p>
    `,
    faqs: [
      {
        question: 'Do you work directly with auction houses?',
        answer: 'No. There is no formal partnership with any auction company. Collection is arranged based on your instructions and any release documentation you provide.'
      },
      {
        question: 'Can you collect a vehicle without an MOT?',
        answer: 'Yes, vehicles without a current MOT can typically be collected for transport, subject to confirmation.'
      },
      {
        question: 'What details do you need for a collection?',
        answer: 'The collection address, whether keys are available, whether the vehicle starts, rolls, steers and brakes, and your intended destination.'
      },
      {
        question: 'Do you handle payment or release paperwork at the auction site?',
        answer: 'No. Release documentation and any payment due to the auction site or seller remain your responsibility. We arrange transport once the vehicle is ready for collection.'
      }
    ]
  });
}

module.exports = {
  build: () => [breakdown(), accident(), m1(), transport(), van(), auction()]
};
