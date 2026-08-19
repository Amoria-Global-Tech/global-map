/**
 * Static product catalogue.
 *
 * Products used to be loaded from the admin CMS at runtime (`/api/products` ->
 * `ADMIN_API_URL`). They are now hardcoded here instead, so this file is the
 * single source of truth for the products page: edit it and redeploy to change
 * what the site shows.
 *
 * Connekyt and JamboLush were captured from
 * https://www.amoriaglobal.com/api/products; `id` and `price` are kept as the
 * CMS returned them so the records stay recognisable, even though the products
 * page renders neither. Schedule is new here and has no CMS record.
 */

export interface Product {
  id: string | number;
  name: string;
  description: string;
  category: string;
  price?: number | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  siteUrl?: string | null;
}

export const PRODUCTS: Product[] = [
  {
    id: 5,
    name: 'Amoria Connekyt',
    description:
      'Connect  Stream  Capture  Grow A digital platform connecting verified photographers and creative professionals with audiences through smart booking tools, livestreaming, secure payments, enhanced visibility, and permanent digital archiving.',
    category: '',
    price: 0,
    imageUrl: '/connektylogo.png',
    isAvailable: true,
    siteUrl: 'https://connekyt.com/',
  },
  {
    id: 'schedule',
    name: 'Schedule',
    // Drawn from appointment.jambolush.com: the footer's own one-line
    // description of the product, plus its "how it works" steps.
    description:
      "An appointment scheduling platform for organizations that value their clients' time. Clients pick a service, choose a time and get confirmed instantly, with no account needed. They can then meet in person, by call, or on WhatsApp.",
    category: '',
    price: null,
    // The logo Connekyt used to carry: the CMS had `logo-schedule.png` assigned
    // to it. Signed Supabase URL — the token runs to 2126, but it dies early if
    // that bucket's signing key is rotated.
    imageUrl:
      'https://zxqlfpvozfgcrsbcaqxz.supabase.co/storage/v1/object/sign/app-releases/logos/logo-schedule.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zY2ZmYzhmOC05MzBkLTRiZjgtYTMwNy1jOWZiZTE4ZmM2ZGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcHAtcmVsZWFzZXMvbG9nb3MvbG9nby1zY2hlZHVsZS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2NzAzOTYyLCJleHAiOjQ5NDAzMDM5NjJ9.YgUVymw4ZuSSqaKVF_XniR3izr3UyuxZrWQ0vXUjeWk',
    isAvailable: true,
    siteUrl: 'https://appointment.jambolush.com/',
  },
  {
    id: 4,
    name: 'JamboLush',
    description:
      'We connect people to unique tours and flexible spaces for living, working, and creating. Our goal is to make booking simple, safe, and inspiring - so you can focus on experiences, not logistics.',
    category: '',
    price: 0.99,
    imageUrl:
      'https://ftihjzudufdjjabnpaqv.supabase.co/storage/v1/object/public/faxon-bucket/products/1759218944024-product-jambolush-1759218943459.jpg',
    isAvailable: true,
    siteUrl: 'https://jambolush.com',
  },
];
