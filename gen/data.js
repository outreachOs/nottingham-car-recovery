'use strict';

const DOMAIN = 'https://nottingham-car-recovery.co.uk';

const SERVICES = [
  {
    title: 'Breakdown Recovery',
    description: 'Broken down? Your vehicle recovered to a garage, home or another suitable location.',
    icon: 'wrench',
    href: '/breakdown-recovery-nottingham'
  },
  {
    title: 'Accident Recovery',
    description: 'Damaged or non-drivable vehicles collected and transported with care.',
    icon: 'car',
    href: '/accident-recovery-nottingham'
  },
  {
    title: 'M1 Recovery',
    description: 'Recovery on the M1 near junctions 24, 25 and 26 once you are safely positioned.',
    icon: 'route',
    href: '/m1-breakdown-recovery-nottingham'
  },
  {
    title: 'Car Towing & Transport',
    description: 'Planned transport for cars from one location to another, when it suits you.',
    icon: 'truck',
    href: '/car-towing-vehicle-transport-nottingham'
  },
  {
    title: 'Van Recovery',
    description: 'Work vans and suitable light commercial vehicles recovered and transported.',
    icon: 'warehouse',
    href: '/van-commercial-recovery-nottingham'
  },
  {
    title: 'Auction & Non-Runner Collection',
    description: 'Auction purchases, non-runners and project vehicles collected and delivered.',
    icon: 'gavel',
    href: '/auction-non-runner-collection-nottingham'
  }
];

const ROUTES = ['M1', 'A52', 'A453', 'A60', 'A610', 'A612'];

const AREAS = [
  { name: 'West Bridgford', href: '/car-recovery-west-bridgford' },
  { name: 'Beeston', href: '/car-recovery-beeston' },
  { name: 'Arnold', href: '/car-recovery-arnold' },
  { name: 'Hucknall', href: '/car-recovery-hucknall' },
  { name: 'Carlton & Gedling', href: '/car-recovery-carlton-gedling' },
  { name: 'Bulwell', href: '/car-recovery-bulwell' },
  { name: 'Clifton', href: '/car-recovery-clifton' },
  { name: 'Long Eaton', href: '/car-recovery-long-eaton' }
];

const DESTINATIONS = [
  { title: 'Garage', description: 'Your usual mechanic or preferred garage.', icon: 'wrench' },
  { title: 'Repair Centre', description: 'An approved repair or accident centre.', icon: 'building2' },
  { title: 'Bodyshop', description: 'A bodyshop for panel and paint work.', icon: 'car' },
  { title: 'Home Address', description: 'Delivered safely to your home.', icon: 'house' },
  { title: 'Business Premises', description: 'A yard, unit or place of work.', icon: 'warehouse' },
  { title: 'Secure Location', description: 'A secure holding location you choose.', icon: 'shieldCheck' }
];

const WHY_CHOOSE = [
  'One-off recovery without annual membership',
  'A clear quote before any dispatch',
  'Delivery to your chosen suitable destination',
  'Emergency and planned vehicle transport',
  'Vehicle suitability confirmed before collection'
];

const STEPS = [
  { number: '01', title: 'Call or request contact', description: 'Reach out by phone, WhatsApp or callback request.' },
  { number: '02', title: 'Share vehicle & location', description: 'Tell us the vehicle type and where it is.' },
  { number: '03', title: 'Confirm destination & quote', description: 'Agree the destination and a clear price.' },
  { number: '04', title: 'Recovery is arranged', description: 'We arrange collection and transport for you.' }
];

const HOME_FAQS = [
  {
    question: 'Can I request recovery without breakdown cover?',
    answer:
      'Yes. Recovery is available as a one-off service, so you do not need an annual membership or existing breakdown policy to request help.'
  },
  {
    question: 'Where can you take my vehicle?',
    answer:
      'Your vehicle can be transported to a garage, repair centre, bodyshop, home address, business premises or another secure location you choose, subject to suitability.'
  },
  {
    question: 'What information should I provide?',
    answer:
      'Please share your location, the make and type of vehicle, what has happened, and your intended destination so the request can be assessed accurately.'
  },
  {
    question: 'Can you recover vans?',
    answer:
      'Yes. Work vans and suitable light commercial vehicles can be recovered and transported, provided they fall within the suitable size and weight range.'
  },
  {
    question: 'Can vehicle transport be booked in advance?',
    answer:
      'Yes. Planned transport can be arranged ahead of time for auction collections, project vehicles or moving a car between locations.'
  },
  {
    question: 'What should I do if I break down on a motorway?',
    answer:
      'Where possible, leave the motorway or move to a service area, emergency area or the hard shoulder and switch on your hazard lights. Exit the vehicle away from traffic when it is safe and move behind a barrier where possible. Call 999 immediately if you are in danger or stopped in a live lane. Where available, an emergency roadside telephone can be used to reach the road operator. Only contact recovery once you are safely positioned.'
  }
];

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Areas', href: '/areas' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

module.exports = {
  DOMAIN,
  SERVICES,
  ROUTES,
  AREAS,
  DESTINATIONS,
  WHY_CHOOSE,
  STEPS,
  HOME_FAQS,
  NAV_ITEMS
};
