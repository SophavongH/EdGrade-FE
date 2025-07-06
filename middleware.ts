import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/locales';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // or 'always' if you want /en/ everywhere
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|kh)/:path*']
};