import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arditore.github.io',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } } })],
  build: { inlineStylesheets: 'always' },
  prefetch: false,
});
