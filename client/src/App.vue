<template>
  <div class="page-wrapper">
    <AppNavbar />
    <main class="page-main">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppNavbar from './components/layout/Navbar.vue'

export default {
  name: 'App',
  components: { AppNavbar }
}
</script>
