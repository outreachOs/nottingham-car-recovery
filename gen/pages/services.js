'use strict';

const C = require('../components');
const S = require('../schema');
const { SERVICES, DESTINATIONS } = require('../data');

function build() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' }
  ];

  const hero = C.renderHeroPage({
    eyebrow: 'Recovery Services',
    title: 'Vehicle Recovery Services in Nottingham',
    lead:
      'From a single breakdown to a planned garage-to-garage transport job, this page is an overview of every recovery service available across Nottingham and surrounding areas. Choose a service below for full detail.',
    breadcrumbs,
    callbackHref: '/contact#callback'
  });

  const emergencyVsPlanned = `<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div class="prose-block">
        <h2>Emergency Versus Planned Transport</h2>
        <p>Not every recovery request is urgent. A breakdown at the roadside or an accident scene usually needs an emergency response once you are safely positioned. A garage appointment, an auction collection or moving a non-runner between addresses can usually be booked ahead of time instead.</p>
        <p>Both are treated as genuine recovery jobs — the difference is timing, not vehicle type. Let us know whether your situation is urgent or can be scheduled, and the request will be assessed accordingly.</p>

        <h2>Vehicle Suitability Checks</h2>
        <p>Before a job is confirmed, we check that the vehicle is suitable for standard car and light commercial recovery. This includes vehicle size and weight, whether it starts, rolls, steers and brakes, and any access restrictions at the collection point. This helps make sure the right equipment and a clear quote are in place before dispatch.</p>

        <h2>Destination Choices</h2>
        <p>Vehicles can be transported to a garage, repair centre, bodyshop, home address, business premises or another secure location you choose, subject to suitability and confirmation.</p>

        <h2>One-Off Recovery Without Membership</h2>
        <p>You do not need an annual breakdown membership or existing policy to request recovery. One-off jobs are available for cars, vans and suitable light commercial vehicles across Nottingham.</p>

        <h2>Pricing Factors</h2>
        <p>Price depends on factors such as distance, vehicle type and condition, access at the collection point, and whether the job is an emergency or a planned booking. A quote is always confirmed before dispatch — nothing is booked until the price is agreed.</p>
      </div>
      <aside class="aside-card">
        <h3>Jump to a service</h3>
        <ul>
          ${SERVICES.map((s) => `<li><a href="${s.href}">${s.title}</a></li>`).join('\n')}
        </ul>
        <a href="/contact#callback" class="callout-link">
          <strong>Not sure which service you need?</strong>
          Leave your number and we'll call you back to point you to the right option.
        </a>
      </aside>
    </div>
  </div>
</section>`;

  const moreOptions = `<section class="section surface">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Also Available</span>
      <h2>More Recovery and Transport Options</h2>
      <p>A few more specific situations that fall under the services above.</p>
    </div>
    <div class="grid-cards cols-3">
      ${[
        { href: '/recovery-without-breakdown-cover-nottingham', title: 'Recovery Without Membership', description: 'One-off recovery for anyone without an AA, RAC or other breakdown policy.', icon: 'shieldCheck' },
        { href: '/car-wont-start-recovery-nottingham', title: 'Non-Starting Vehicle Recovery', description: "Vehicle transport when a car or van won't start.", icon: 'wrench' },
        { href: '/car-recovery-from-home-nottingham', title: 'Home Collection', description: 'Collection from a driveway or other suitable residential address.', icon: 'house' },
        { href: '/long-distance-car-transport-nottingham', title: 'Long-Distance Transport', description: 'Planned vehicle transport to or from Nottingham.', icon: 'route' },
        { href: '/garage-vehicle-collection-delivery-nottingham', title: 'Garage Collection & Delivery', description: 'Transport between home, work, garage and bodyshop.', icon: 'building2' }
      ]
        .map(
          (item) => `<a href="${item.href}" class="service-card">
        <span class="service-card__icon">${C.icon(item.icon)}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="service-card__link">Learn more ${C.icon('arrowRight')}</span>
      </a>`
        )
        .join('\n')}
    </div>
  </div>
</section>`;

  const content = `${hero}
${C.renderServicesGrid({
  heading: 'Choose a Recovery Service',
  lead: 'Every service below covers cars, vans and suitable light commercial vehicles across Nottingham.'
})}
${emergencyVsPlanned}
${moreOptions}
${C.renderDestinations()}
${C.renderFinalCta({ callbackHref: '/contact#callback' })}`;

  return {
    path: '/services',
    filename: 'services.html',
    title: 'Recovery Services Nottingham | Breakdown, Towing & Transport',
    description:
      'Explore vehicle recovery services across Nottingham, including breakdown recovery, accident recovery, towing, van recovery and non-runner transport.',
    content,
    schemas: [C.breadcrumbSchema(breadcrumbs)]
  };
}

module.exports = { build };
