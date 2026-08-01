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
    breadcrumbs
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
        <div class="callout-link">
          <strong>Not sure which service you need?</strong>
          Request a callback and describe your situation — we will point you to the right option.
        </div>
      </aside>
    </div>
  </div>
</section>`;

  const content = `${hero}
${C.renderServicesGrid({
  heading: 'Choose a Recovery Service',
  lead: 'Every service below covers cars, vans and suitable light commercial vehicles across Nottingham.'
})}
${emergencyVsPlanned}
${C.renderDestinations()}
${C.renderFinalCta({ heading: 'Ready to Request Recovery?' })}`;

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
