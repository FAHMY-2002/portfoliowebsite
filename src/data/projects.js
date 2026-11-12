// Every project shown on the site. Edit text here; components never hard-code project content.
// `image` is the base name of the files in src/assets/images (see scripts/optimize-images.mjs).
// `year` is optional: leave it as '' and the field is hidden everywhere.
export const categories = ['All', 'E-commerce', 'Native', 'Other'];

export const projects = [
  {
    slug: 'al-mohandes',
    name: 'Al-Mohandes',
    description: 'WooCommerce E-commerce Platform',
    category: 'E-commerce',
    role: 'WordPress Developer',
    year: '',
    stack: ['WordPress', 'CSS3'],
    url: 'https://al-mohandes.com/',
    image: 'al-mohandes',
    ratio: 2.1636,
  },
  {
    slug: 'megafresh',
    name: 'Megafresh',
    description: 'Online Grocery Store',
    category: 'E-commerce',
    role: 'WordPress Developer',
    year: '',
    stack: ['WordPress', 'WooCommerce'],
    url: 'https://megafresh.ca/',
    image: 'megafresh',
    ratio: 2.1651,
  },
  {
    slug: 'nova-pharmacy',
    name: 'Nova Pharmacy',
    description: 'Medical & Pharmacy Store',
    category: 'E-commerce',
    role: 'WordPress Developer',
    year: '',
    stack: ['HTML', 'Tailwind', 'JavaScript', 'WordPress', 'PHP'],
    url: 'https://novapharmacies.com/',
    image: 'nova-pharmacy',
    ratio: 2.031,
  },
  {
    slug: 'wurx',
    name: 'Wurx.ae',
    description: 'Ecommerce Solutions',
    category: 'Native',
    role: 'WordPress Developer',
    year: '',
    stack: ['HTML', 'Tailwind', 'JavaScript', 'WordPress', 'PHP'],
    url: 'https://wurx.ae/',
    image: 'wurx',
    ratio: 2.1443,
  },
  {
    slug: 'realdealexperts',
    name: 'Realdealexperts',
    description: 'Real Estate Wholesalers & Investors',
    category: 'Native',
    role: 'WordPress Developer',
    year: '',
    stack: ['HTML', 'Tailwind', 'JavaScript'],
    url: 'https://realdealexperts.com/',
    image: 'realdealexperts',
    ratio: 2.1557,
  },
  {
    slug: 'decoandesign',
    name: 'Decoandesign',
    description: 'Custom E-commerce Theme',
    category: 'Native',
    role: 'WordPress Developer',
    year: '',
    stack: ['HTML', 'Tailwind', 'JavaScript', 'WordPress', 'PHP'],
    url: 'https://decoandesign.com/',
    image: 'decoandesign',
    ratio: 2.0365,
  },
  {
    slug: 'archilines',
    name: 'Archilines',
    description: 'Architecture Portfolio',
    category: 'Other',
    role: 'WordPress Developer',
    year: '',
    stack: ['WordPress', 'Design'],
    url: 'https://archilines.net/',
    image: 'archilines',
    ratio: 2.2267,
  },
  {
    slug: 'hm-gallery',
    name: 'H&M Gallery',
    description: 'Interior Design & Decoration',
    category: 'Other',
    role: 'WordPress Developer',
    year: '',
    stack: ['WordPress', 'ACF', 'WooCommerce', 'PHP', 'JavaScript', 'HTML', 'Tailwind'],
    url: 'https://hmdecor.net/',
    image: 'hm-gallery',
    ratio: 2.2158,
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
export const getNextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
