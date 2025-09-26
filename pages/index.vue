<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">{{ settings?.title || 'Nuxt CMS POC' }}</h1>

        <!-- Language Switcher -->
        <div class="mt-2">
          <button
            @click="switchLocale('en')"
            :class="{ 'font-bold': $i18n.locale.value === 'en' }"
            class="mr-2 text-blue-600 hover:text-blue-800"
          >
            English
          </button>
          <button
            @click="switchLocale('fr')"
            :class="{ 'font-bold': $i18n.locale.value === 'fr' }"
            class="text-blue-600 hover:text-blue-800"
          >
            Français
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Display current page content -->
      <div v-if="currentPage" class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          {{ currentPage.title }}
        </h2>

        <!-- Hero Image -->
        <div v-if="currentPage.image" class="mb-6">
          <img
            :src="currentPage.image"
            :alt="currentPage.title"
            class="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        <!-- Description -->
        <div v-if="currentPage.description" class="mb-6">
          <p class="text-lg text-gray-600 italic">
            {{ currentPage.description }}
          </p>
        </div>

        <!-- Main Content -->
        <div class="prose max-w-none">
          <ContentRenderer :value="currentPage" />
        </div>
      </div>

      <!-- Default content if no CMS content exists -->
      <div v-else class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Nuxt + Decap CMS POC
        </h2>

        <div class="mb-6">
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Default image"
            class="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        <p class="text-lg text-gray-600 italic mb-6">
          This is the default content. Use the CMS to edit this page!
        </p>

        <div class="prose max-w-none">
          <p>
            This is a proof of concept demonstrating Nuxt 3 with Decap CMS integration.
            You can edit this content through the admin panel once it's deployed to Netlify.
          </p>

          <h3>Features demonstrated:</h3>
          <ul>
            <li>Editable text content</li>
            <li>Image uploads</li>
            <li>Markdown content</li>
            <li>Multi-language support</li>
            <li>Responsive design</li>
          </ul>

          <p>
            To access the CMS, navigate to <code>/admin</code> after deployment.
          </p>
        </div>
      </div>

      <!-- All available pages -->
      <div v-if="allPages.length > 0" class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">All Pages</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="page in allPages"
            :key="page._path"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h4 class="font-semibold text-lg mb-2">{{ page.title }}</h4>
            <p class="text-gray-600 text-sm mb-2">Language: {{ page.lang }}</p>
            <p v-if="page.description" class="text-gray-700">{{ page.description }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>{{ settings?.footer || 'Built with Nuxt 3 and Decap CMS' }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { $i18n } = useNuxtApp()

// Get current locale content
const currentLocale = computed(() => $i18n.locale.value)

// Fetch content based on current locale
const { data: currentPage } = await useAsyncData('current-page', async () => {
  try {
    const content = await queryContent('pages')
      .where({ lang: currentLocale.value })
      .first()
    return content
  } catch (error) {
    return null
  }
})

// Fetch all pages
const { data: allPages } = await useAsyncData('all-pages', async () => {
  try {
    const pages = await queryContent('pages').find()
    return pages || []
  } catch (error) {
    return []
  }
})

// Fetch site settings
const { data: settings } = await useAsyncData('settings', async () => {
  try {
    const settingsData = await queryContent('settings/general').findOne()
    return settingsData
  } catch (error) {
    return null
  }
})

// Language switching
const switchLocale = async (locale) => {
  await $i18n.setLocale(locale)
  await refreshCookie('i18n_redirected', locale)
  await navigateTo(useLocalePath()('/'))
}
</script>