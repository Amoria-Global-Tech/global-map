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
    // Shortened from the CMS's "Amoria Connekyt" — the brand stands alone.
    name: 'Connekyt',
    description:
      'Create the moment. Capture it. Share it live. Keep it forever.',
    category: '',
    price: 0,
    imageUrl: '/connektylogo.png',
    isAvailable: true,
    siteUrl: 'https://connekyt.com/',
  },
  {
    id: 4,
    name: 'JamboLush',
    description:
      'Book Unique. Stay Inspired. Premium stays, tours and monthly rentals across East Africa.',
    category: '',
    price: 0.99,
    imageUrl: '/jambolush-logo.jpg',
    isAvailable: true,
    siteUrl: 'https://jambolush.com',
  },
  {
    id: 'schedule',
    name: 'Schedule',
    description:
      'Simplify bookings. Save time. Serve clients better with instant scheduling and no account required.',
    category: '',
    price: null,
    imageUrl: '/schedule-logo.png',
    isAvailable: true,
    siteUrl: 'https://appointment.jambolush.com/',
  },
];
