'use strict';
/*
 * Phase 1 organic lead-expansion cluster — five long-tail customer
 * lead-generation pages. Four keep the standard urgent conversion
 * hierarchy (Call / WhatsApp / Call Me Back) with the compact two-field
 * callback form; the long-distance transport page is planned-transport
 * work, so it uses Call / WhatsApp / Plan Transport and links to
 * /booking instead of embedding a callback form.
 */

const C = require('../components');
const S = require('../schema');

/* ------------------------------------------------------------
   Shared builder for the four urgent-journey lead pages
--------------------------------------------------------------- */
function buildLeadPage(opts) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: opts.breadcrumbLabel, href: opts.path }
  ];

  const hero = C.renderHeroPage({
    eyebrow: opts.eyebrow,
    title: opts.h1,
    lead: opts.lead,
    breadcrumbs
  });

  const needRecoveryBand = C.renderNeedRecoveryBand({});
  const callbackForm = C.renderCallbackForm({});

  const faq = C.renderFaqSection(opts.faqs, {});

  const coverageSection = `<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div class="prose-block">
        ${opts.bodyHtml}
      </div>
      <aside class="aside-card">
        <h3>Related pages</h3>
        <ul>
          ${opts.relatedLinks.map((l) => `<li><a href="${l.href}">${l.title}</a></li>`).join('\n')}
        </ul>
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

/* -------------------- 1. Recovery Without Breakdown Cover -------------------- */
function withoutCover() {
  return buildLeadPage({
    path: '/recovery-without-breakdown-cover-nottingham',
    breadcrumbLabel: 'Recovery Without Breakdown Cover',
    eyebrow: 'No Membership Needed',
    h1: 'Recovery Without Breakdown Cover in Nottingham',
    lead:
      "Broken down without an AA, RAC or other recovery policy? One-off car and van recovery is available across Nottingham without an annual breakdown membership.",
    title: 'Recovery Without Breakdown Cover Nottingham | One-Off Vehicle Recovery',
    description:
      'Broken down without AA, RAC or another recovery policy? Request one-off car or van recovery across Nottingham without an annual breakdown membership.',
    serviceName: 'Recovery Without Breakdown Cover',
    serviceType: 'One-off vehicle recovery',
    relatedLinks: [
      { href: '/breakdown-recovery-nottingham', title: 'Breakdown Recovery' },
      { href: '/car-towing-vehicle-transport-nottingham', title: 'Car Towing & Vehicle Transport' },
      { href: '/car-recovery-from-home-nottingham', title: 'Car Recovery From Home' },
      { href: '/contact', title: 'Contact Us' }
    ],
    bodyHtml: `
      <h2>No Annual Membership Required</h2>
      <p>You do not need to join a breakdown or recovery plan to request help. Recovery is available as a genuine one-off, pay-per-use service, whether or not you already hold a policy with another provider.</p>

      <h2>How a One-Off Request Works</h2>
      <p>Call and explain your situation — where you are, what vehicle you have, and where it needs to go. This is discussed by phone rather than through a long online form, so the request can be assessed quickly and accurately.</p>
      ${C.renderChecklist([
        'The vehicle, your location and your intended destination are discussed by phone',
        'A quote is agreed before anything is dispatched',
        'Suitable cars, vans and light commercial vehicles are covered, subject to confirmation',
        'Recovery can be arranged to a garage, home or another agreed suitable destination'
      ])}

      <h2>Not an Insurance Product</h2>
      <p>This is a one-off recovery and transport service, not an insurance policy or breakdown membership product. There is no ongoing plan to join or cancel — each request is arranged and priced individually.</p>

      <h2>How Pricing Works</h2>
      <p>Price depends on factors such as distance, vehicle type, access at the collection point and the destination chosen. A clear price is confirmed by phone before dispatch, so you know what to expect before anything is booked.</p>
    `,
    faqs: [
      {
        question: 'Can I request recovery without breakdown membership?',
        answer: 'Yes. Recovery is available as a genuine one-off service. You do not need an existing breakdown policy or annual membership to request help.'
      },
      {
        question: 'Do I need to join a recovery plan?',
        answer: 'No. There is no plan or membership to join. Each request is treated as a standalone, pay-per-use job.'
      },
      {
        question: 'Where can my vehicle be taken?',
        answer: 'Your vehicle can be transported to a garage, your home address, or another agreed suitable destination, subject to confirmation.'
      },
      {
        question: 'How is the price worked out?',
        answer: 'Price depends on factors such as distance, vehicle type and condition, and access at the collection point. A quote is confirmed by phone before dispatch.'
      },
      {
        question: 'Can you recover a van without breakdown cover?',
        answer: 'Yes. Suitable vans and light commercial vehicles can be recovered as a one-off job, in the same way as cars.'
      }
    ]
  });
}

/* -------------------- 2. Car Won't Start -------------------- */
function wontStart() {
  return buildLeadPage({
    path: '/car-wont-start-recovery-nottingham',
    breadcrumbLabel: "Car Won't Start Recovery",
    eyebrow: "Won't Start",
    h1: "Car Won't Start in Nottingham?",
    lead:
      'A car that will not start can have several possible causes. Call for vehicle recovery from your home, workplace or another suitable location to a garage or agreed destination.',
    title: "Car Won't Start Recovery Nottingham | Vehicle Transport to a Garage",
    description:
      "Car won't start in Nottingham? Call for vehicle recovery from your home, workplace or another suitable location to a garage or agreed destination.",
    serviceName: "Car Won't Start Recovery",
    serviceType: 'Non-starting vehicle recovery',
    relatedLinks: [
      { href: '/breakdown-recovery-nottingham', title: 'Breakdown Recovery' },
      { href: '/car-recovery-from-home-nottingham', title: 'Car Recovery From Home' },
      { href: '/garage-vehicle-collection-delivery-nottingham', title: 'Garage Collection & Delivery' },
      { href: '/recovery-without-breakdown-cover-nottingham', title: 'Recovery Without Breakdown Cover' }
    ],
    bodyHtml: `
      <h2>A Non-Starting Vehicle Can Have Several Causes</h2>
      <p>There are many possible reasons a vehicle will not start. This service does not diagnose the cause or promise a repair — it arranges collection and transport so the vehicle can be assessed properly at a garage.</p>

      <h2>What to Do</h2>
      <p>Call and explain where the vehicle is and what you have noticed. During the call, we may ask about access at the collection point, and whether the vehicle rolls, steers and brakes, as this affects how it is safely loaded.</p>
      ${C.renderChecklist([
        'The vehicle is collected without attempting roadside diagnosis or repair',
        'Access, steering, rolling and braking condition may be confirmed during the call',
        'Transport can be arranged to a garage, your home or another agreed destination',
        'Home, workplace and other suitable private locations may be possible for collection'
      ])}

      <h2>What This Service Does Not Do</h2>
      <p>This is a collection and transport service, not a mobile mechanic. Jump starts and roadside repairs are not promised, and we do not diagnose battery, starter, immobiliser or other mechanical faults. If the vehicle cannot be safely loaded, this will be discussed with you.</p>
    `,
    faqs: [
      {
        question: 'Can you recover a car that will not start?',
        answer: 'Yes. The vehicle can be collected and transported to a garage or another suitable destination once the details are discussed by phone.'
      },
      {
        question: 'Can you collect it from my driveway?',
        answer: 'In most cases, yes, subject to access. Please describe the driveway and any restrictions when you call.'
      },
      {
        question: 'Can it be taken to my chosen garage?',
        answer: 'In most cases, yes. Destination options include your chosen garage, your home address, or another agreed suitable location.'
      },
      {
        question: 'What if the steering or brakes are affected?',
        answer: 'Please mention this when you call. It affects how the vehicle is safely loaded and may change the equipment used.'
      },
      {
        question: 'Do I need breakdown-cover membership?',
        answer: 'No. Recovery is available as a one-off service, so no existing breakdown policy or annual membership is required.'
      }
    ]
  });
}

/* -------------------- 3. Car Recovery From Home -------------------- */
function fromHome() {
  return buildLeadPage({
    path: '/car-recovery-from-home-nottingham',
    breadcrumbLabel: 'Car Recovery From Home',
    eyebrow: 'Home Collection',
    h1: 'Car Recovery From Home in Nottingham',
    lead:
      'Need a non-running or unsafe vehicle collected from home in Nottingham? Request transport from a driveway or suitable residential location to a garage or agreed destination.',
    title: 'Car Recovery From Home Nottingham | Driveway to Garage Transport',
    description:
      'Need a non-running or unsafe vehicle collected from home in Nottingham? Request transport from a driveway or suitable residential location to a garage or agreed destination.',
    serviceName: 'Car Recovery From Home',
    serviceType: 'Residential vehicle collection',
    relatedLinks: [
      { href: '/car-wont-start-recovery-nottingham', title: "Car Won't Start Recovery" },
      { href: '/garage-vehicle-collection-delivery-nottingham', title: 'Garage Collection & Delivery' },
      { href: '/car-towing-vehicle-transport-nottingham', title: 'Car Towing & Vehicle Transport' },
      { href: '/booking', title: 'Plan Vehicle Transport' }
    ],
    bodyHtml: `
      <h2>Driveway and Residential Collection</h2>
      <p>Vehicles stuck on a driveway, in front of a house, or parked at another suitable residential address can be collected and transported, subject to access.</p>
      ${C.renderChecklist([
        'Driveway width and any parked vehicles that could restrict access',
        'Whether keys are available and the general condition of the vehicle',
        'Whether the vehicle rolls, steers and brakes',
        'Your intended destination — a garage, bodyshop, home or another agreed location'
      ])}

      <h2>Urgent and Advance Requests</h2>
      <p>This covers both urgent, non-starting cases and collection arranged a little ahead of time. If your situation is not urgent, planned collection can also be arranged in advance through our <a href="/booking">planned transport request form</a>.</p>

      <h2>Restricted-Access Locations</h2>
      <p>Apartments, underground parking, multi-storey car parks and other restricted-access locations require individual assessment before a job can be confirmed — access at these locations cannot be guaranteed in every case, so please describe the location as fully as possible when you get in touch.</p>
    `,
    faqs: [
      {
        question: 'Can you collect a car from my driveway?',
        answer: 'In most cases, yes, subject to access. Please describe the driveway, including width and anything that might restrict access.'
      },
      {
        question: 'What access information do you need?',
        answer: 'Details such as driveway width, nearby parked vehicles, gates, and whether the location is underground, multi-storey or otherwise restricted.'
      },
      {
        question: 'Can you take it directly to a garage?',
        answer: 'In most cases, yes. Destination options include your chosen garage, a bodyshop, your home, or another agreed suitable location.'
      },
      {
        question: 'Can a vehicle without MOT be transported?',
        answer: 'Yes, vehicles without a current MOT can typically be transported, subject to confirmation.'
      },
      {
        question: 'What if it does not roll or steer?',
        answer: 'Please mention this when requesting collection, as it affects the equipment and approach needed for a safe collection.'
      }
    ]
  });
}

/* -------------------- 4. Long-Distance Car Transport -------------------- */
// This page is primarily planned transport, not urgent recovery, so it
// deliberately does not use buildLeadPage(): no Call Me Back action, no
// embedded two-field callback form. Its third action is "Plan Transport"
// and the primary route through is /booking.
function longDistance() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Long-Distance Car Transport', href: '/long-distance-car-transport-nottingham' }
  ];

  const hero = C.renderHeroPage({
    eyebrow: 'Long-Distance Transport',
    title: 'Long-Distance Car Transport From Nottingham',
    lead:
      'Planned vehicle transport to or from Nottingham for purchased cars, non-runners, garage movements and other collection or delivery jobs, arranged in advance.',
    breadcrumbs,
    callbackHref: '/booking',
    callbackLabel: 'Plan Transport'
  });

  const faq = C.renderFaqSection(
    [
      {
        question: 'Can you collect a vehicle outside Nottingham?',
        answer: 'In many cases, yes, subject to confirmation. Share both the collection and destination locations and this can be assessed.'
      },
      {
        question: 'Can you deliver a purchased car to Nottingham?',
        answer: 'Yes, purchased-vehicle delivery to a Nottingham address can be arranged, subject to confirmation of collection point and access.'
      },
      {
        question: 'Can a non-running vehicle be transported long distance?',
        answer: 'Yes, non-runners can typically be transported using suitable loading equipment, subject to confirmation of the vehicle and access at both ends.'
      },
      {
        question: 'What affects the transport quote?',
        answer: 'Factors include mileage, access at collection and delivery, vehicle size and condition, and whether the vehicle can be driven onto the transport.'
      },
      {
        question: 'Is the booking confirmed when I submit the form?',
        answer: 'No. Submitting the planned transport form is a request only. The job is not confirmed until the vehicle, collection point, destination, availability and price have all been agreed.'
      }
    ],
    {}
  );

  const body = `<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div class="prose-block">
        <h2>What This Covers</h2>
        ${C.renderChecklist([
          'Vehicle collection to or from Nottingham',
          'Purchased-car transport',
          'Non-runner transport',
          'Specialist-garage journeys',
          'Moving-house vehicle transport',
          'Dealer, garage and private-address collection'
        ])}
        <p>UK destinations are covered subject to confirmation — coverage is not guaranteed for every route without checking your specific collection and delivery points first.</p>

        <h2>Collection and Delivery Access</h2>
        <p>Please let us know about keys, vehicle condition, and anything that could affect access at either end, such as narrow roads, restricted opening hours or gated sites.</p>

        <h2>What Affects the Quote</h2>
        <p>Mileage, access, vehicle size and condition are all taken into account. A price is confirmed before the job is booked — this page does not display fixed per-mile pricing, as every job is assessed individually.</p>

        <h2>Planned, Not Same-Day</h2>
        <p>This is planned transport rather than an emergency response, and is generally arranged a little ahead of time. Same-day availability cannot be guaranteed. If you have broken down and need recovery right now, see our <a href="/breakdown-recovery-nottingham">breakdown recovery page</a> instead.</p>
      </div>
      <aside class="aside-card">
        <h3>Related pages</h3>
        <ul>
          <li><a href="/booking">Plan Vehicle Transport</a></li>
          <li><a href="/car-towing-vehicle-transport-nottingham">Car Towing &amp; Vehicle Transport</a></li>
          <li><a href="/auction-non-runner-collection-nottingham">Auction &amp; Non-Runner Collection</a></li>
          <li><a href="/garage-vehicle-collection-delivery-nottingham">Garage Collection &amp; Delivery</a></li>
        </ul>
      </aside>
    </div>
  </div>
</section>`;

  const content = `${hero}
${body}
${faq.html}
${C.renderFinalCta({
    heading: 'Arrange Long-Distance Transport',
    lead: 'Call now, message us or plan your transport.',
    callbackHref: '/booking',
    callbackLabel: 'Plan Transport'
  })}`;

  return {
    path: '/long-distance-car-transport-nottingham',
    filename: 'long-distance-car-transport-nottingham.html',
    title: 'Long-Distance Car Transport Nottingham | UK Vehicle Collection',
    description:
      'Arrange long-distance vehicle transport to or from Nottingham for purchased cars, non-runners, garage movements and planned collection or delivery.',
    content,
    schemas: [
      C.breadcrumbSchema(breadcrumbs),
      S.serviceSchema({
        name: 'Long-Distance Car Transport',
        description:
          'Arrange long-distance vehicle transport to or from Nottingham for purchased cars, non-runners, garage movements and planned collection or delivery.',
        path: '/long-distance-car-transport-nottingham',
        serviceType: 'Long-distance vehicle transport'
      }),
      faq.schema
    ]
  };
}

/* -------------------- 5. Garage Vehicle Collection & Delivery -------------------- */
function garageCollection() {
  return buildLeadPage({
    path: '/garage-vehicle-collection-delivery-nottingham',
    breadcrumbLabel: 'Garage Vehicle Collection & Delivery',
    eyebrow: 'Garage & Repairer Transport',
    h1: 'Garage Vehicle Collection and Delivery in Nottingham',
    lead:
      'Arrange car or van collection and delivery between your home, workplace, garage, bodyshop or repair centre across Nottingham and surrounding areas.',
    title: 'Garage Vehicle Collection Nottingham | Car Delivery to Repairers',
    description:
      'Arrange car or van collection and delivery between your home, workplace, garage, bodyshop or repair centre across Nottingham and surrounding areas.',
    serviceName: 'Garage Vehicle Collection and Delivery',
    serviceType: 'Garage and repairer vehicle transport',
    relatedLinks: [
      { href: '/car-towing-vehicle-transport-nottingham', title: 'Car Towing & Vehicle Transport' },
      { href: '/car-recovery-from-home-nottingham', title: 'Car Recovery From Home' },
      { href: '/car-wont-start-recovery-nottingham', title: "Car Won't Start Recovery" },
      { href: '/booking', title: 'Plan Vehicle Transport' }
    ],
    bodyHtml: `
      <h2>Collection and Delivery Routes</h2>
      ${C.renderChecklist([
        'Home-to-garage and workplace-to-garage transport',
        'Garage-to-garage movement',
        'Bodyshop delivery for repair work',
        'Collection after repairs where this has been agreed with the garage',
        'MOT-failure vehicle transport',
        'Non-runner and unsafe-to-drive vehicles'
      ])}

      <h2>Coordinating Times and Access</h2>
      <p>We coordinate collection and delivery around the garage's opening hours where possible. Please have keys available and let us know about any access or release-authorisation requirements at either end, such as needing a specific contact to release or accept the vehicle.</p>

      <div class="safe-panel" style="margin-top:2rem;">
        <h3 style="font-size:1.125rem;">Need an Overflow Vehicle-Transport Contact?</h3>
        <p style="margin-top:0.5rem;color:var(--muted-foreground);">If you run a garage, bodyshop, MOT centre or repair business and need a contact for suitable recurring collection and delivery work, call to discuss whether this fits what we cover.</p>
        <p style="margin-top:0.75rem;font-size:0.8125rem;color:var(--muted-foreground);">This is a general enquiry route, not a trade account, priority attendance, credit terms, fixed trade pricing, storage or repair service.</p>
        <div class="btn-row">
          <a href="${C.SITE_CONFIG.phoneHref}" data-cta="call" data-track="phone-click" class="btn btn-primary">${C.icon('phone')} Call ${C.escapeHtml(C.SITE_CONFIG.phoneDisplay)}</a>
        </div>
      </div>
    `,
    faqs: [
      {
        question: 'Can you take my car to my chosen garage?',
        answer: 'In most cases, yes. Let us know the garage and any relevant access or opening-hours details when you get in touch.'
      },
      {
        question: 'Can a garage arrange collection for a customer?',
        answer: "Yes, subject to confirmation. Please provide the customer's details and the collection and destination points so the request can be assessed."
      },
      {
        question: 'Can you move a vehicle between garages?',
        answer: 'Yes, garage-to-garage transport can be arranged, subject to confirmation of both locations and access.'
      },
      {
        question: 'Can you collect after repairs are complete?',
        answer: 'Yes, where this has been agreed with the garage in advance, collection after repair can be arranged.'
      },
      {
        question: 'What details are needed?',
        answer: 'The collection and destination addresses, the vehicle make and type, whether keys are available, and any access or timing requirements.'
      }
    ]
  });
}

module.exports = {
  build: () => [withoutCover(), wontStart(), fromHome(), longDistance(), garageCollection()]
};
