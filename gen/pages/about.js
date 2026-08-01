'use strict';

const C = require('../components');

function build() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' }
  ];

  const hero = C.renderHeroPage({
    eyebrow: 'About',
    title: 'About Nottingham Car Recovery',
    lead:
      'A straightforward vehicle recovery service covering Nottingham and surrounding areas — clear communication, a confirmed quote, and a destination that suits you.',
    breadcrumbs
  });

  const content = `${hero}
<section class="section">
  <div class="container">
    <div class="two-col layout-main-aside">
      <div class="prose-block">
        <h2>What We Offer</h2>
        <p>Nottingham Car Recovery provides breakdown recovery, accident recovery, M1 recovery, car towing and vehicle transport, van recovery, and auction or non-runner collection for cars, vans and suitable light commercial vehicles across Nottingham and surrounding areas.</p>
        <p>Recovery is available as a one-off service, so you do not need an existing breakdown membership to request help.</p>

        <h2>How Jobs Are Assessed</h2>
        <p>Every request starts with a short assessment: your location, the vehicle type, what has happened, and where the vehicle needs to go. This helps confirm whether the job is suitable before anything is dispatched.</p>

        <h2>Vehicle Suitability</h2>
        <p>Standard recovery covers cars, vans and suitable light commercial vehicles, subject to confirmation. Details such as size, weight and condition are checked so the right approach and equipment can be used.</p>

        <h2>Clear Communication</h2>
        <p>You will be kept informed throughout the process, from initial contact through to confirmation of the job and its destination. Questions about vehicle condition, access or timing are asked upfront to avoid surprises.</p>

        <h2>A Quote Before Dispatch</h2>
        <p>A price is confirmed before a vehicle is dispatched. Nothing is booked or charged until the vehicle, collection point, destination and price have been agreed.</p>

        <h2>Destination Options</h2>
        <p>Vehicles can be transported to a garage, repair centre, bodyshop, home address, business premises or another secure location you choose, subject to suitability.</p>

        <h2>Nottingham-Area Coverage</h2>
        <p>Coverage spans Nottingham and the surrounding towns listed on our <a href="/areas">areas page</a>, along with key routes including the M1, A52, A453, A60, A610 and A612.</p>
      </div>
      <aside class="aside-card">
        <h3>Get in touch</h3>
        <ul>
          <li><a href="/contact">Contact page</a></li>
          <li><a href="/booking">Request recovery</a></li>
          <li><a href="/services">All services</a></li>
          <li><a href="/areas">Areas covered</a></li>
        </ul>
      </aside>
    </div>
  </div>
</section>
${C.renderFinalCta({ heading: 'Ready to Get Started?' })}`;

  return {
    path: '/about',
    filename: 'about.html',
    title: 'About Us | Nottingham Car Recovery',
    description:
      'Learn how Nottingham Car Recovery assesses jobs, confirms vehicle suitability and agrees a clear quote before dispatch across Nottingham and surrounding areas.',
    content,
    schemas: [C.breadcrumbSchema(breadcrumbs)]
  };
}

module.exports = { build };
