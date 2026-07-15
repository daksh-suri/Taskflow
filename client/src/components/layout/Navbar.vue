<template>
  <nav class="navbar" aria-label="Main navigation">
    <div class="container navbar-inner">
      <Logo />
      <div v-if="!auth.loading.value" class="navbar-links">
        <template v-if="auth.isAuthenticated.value">
          <router-link to="/dashboard" class="navbar-link">Dashboard</router-link>
          <button class="navbar-link navbar-link-btn" @click="handleLogout" aria-label="Sign out of your account">Sign out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="navbar-link">Sign in</router-link>
          <AppButton to="/register" size="sm">Get started</AppButton>
        </template>
      </div>
      <div v-else class="navbar-links" aria-hidden="true">
        <span class="navbar-link navbar-link--placeholder">Sign in</span>
        <span class="navbar-link navbar-link--placeholder">Get started</span>
      </div>
    </div>
  </nav>
</template>

<script>
import Logo from '../common/Logo.vue'
import AppButton from '../ui/Button.vue'
import { useAuth } from '../../composables/useAuth'

export default {
  name: 'AppNavbar',
  components: { Logo, AppButton },
  created() {
    const auth = useAuth()
    this.auth = auth
    if (!auth.user.value) {
      auth.fetchCurrentUser()
    }
  },
  methods: {
    async handleLogout() {
      try {
        await this.auth.logout()
        this.$router.push('/')
      } catch {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--navbar-height);
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-gray-100);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.navbar-link {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-600);
  transition: color var(--transition-fast);
  border-radius: var(--radius-sm);
}

.navbar-link:hover {
  color: var(--color-gray-900);
}

.navbar-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

.navbar-link-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
}

.navbar-link--placeholder {
  color: var(--color-gray-300);
  cursor: default;
}
</style>
