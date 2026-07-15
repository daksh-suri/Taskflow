<template>
  <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-subtitle">Sign in to your TaskFlow account</p>
        </div>
        <form class="auth-form" @submit.prevent="handleLogin" novalidate>
          <div v-if="error" class="auth-error" role="alert">{{ error }}</div>
          <div class="input-group">
            <label class="input-label" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input"
              placeholder="you@example.com"
              required
              autocomplete="email"
              :disabled="loading"
              :aria-invalid="!!error && !email"
              aria-describedby="email-error"
            />
          </div>
          <div class="input-group">
            <label class="input-label" for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="input"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
              :disabled="loading"
              :aria-invalid="!!error && !password"
              aria-describedby="password-error"
            />
          </div>
          <button type="submit" class="btn btn-primary w-full" :disabled="loading || submitted">
            <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
            <span v-else>Sign in</span>
          </button>
        </form>
        <p class="auth-footer">
          Don't have an account? <router-link to="/register">Create one</router-link>
        </p>
      </div>
  </div>
</template>

<script>
import { useAuth } from '../../composables/useAuth'

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
      submitted: false
    }
  },
  created() {
    this.auth = useAuth()
  },
  methods: {
    async handleLogin() {
      if (this.loading || this.submitted) return
      this.error = ''
      if (!this.email || !this.password) {
        this.error = 'Please fill in all fields'
        return
      }
      this.loading = true
      this.submitted = true
      try {
        await this.auth.login(this.email, this.password)
        this.$router.push('/dashboard')
      } catch (err) {
        this.error = err.response?.data?.message || 'Something went wrong'
        this.submitted = false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--navbar-height));
  padding: var(--spacing-8) 0;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-100);
  border-radius: var(--radius-xl);
  padding: var(--spacing-10);
  box-shadow: var(--shadow-sm);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.auth-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-2);
}

.auth-subtitle {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
  margin-bottom: var(--spacing-6);
}

.auth-error {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-sm);
  color: var(--color-danger);
  background-color: var(--color-danger-bg);
  border-radius: var(--radius-md);
}

.auth-footer {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-gray-500);
}

.auth-footer a {
  font-weight: var(--font-semibold);
  text-decoration: underline;
  text-underline-offset: 2px;
  color: var(--color-gray-900);
}

.auth-footer a:hover {
  color: var(--color-black);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
