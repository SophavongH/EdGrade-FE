export const locales = ['en', 'kh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';