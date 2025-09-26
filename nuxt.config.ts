export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],

  // Content module configuration
  content: {
    // Add valid content module options here if needed
  },

  // i18n configuration for multilingual support
  i18n: {
    locales: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' }
    ],
    defaultLocale: 'en'
  },

  // Static site generation
  nitro: {
      preset: 'static', // ✅ This is the missing piece
    prerender: {
      routes: ['/']
    }
  }
})