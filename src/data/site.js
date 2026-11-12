// Global site info: name, links, navigation, contact form settings.
export const site = {
  name: 'Mohamed Fahmy',
  brand: 'Mohamed Div',
  role: 'WordPress Developer',
  availability: 'Available for work',
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohamed-fahmy-49a007303/' },
    { label: 'WhatsApp', href: 'https://wa.me/201033525903' },
  ],
  nav: [
    { label: 'Work', to: '/#work' },
    { label: 'About', to: '/#about' },
    { label: 'Stack', to: '/#stack' },
    { label: 'Contact', to: '/contact' },
  ],
  // The form posts to FormSubmit (same service as the previous site).
  // This is the only network request that leaves the site, and only when a visitor presses Send.
  form: {
    action: 'https://formsubmit.co/mohamedkansosy9@gmail.com',
    successPath: '/thanks',
  },
};
