<template>
  <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Create your account</h1>
          <p class="auth-subtitle">Start managing tasks with TaskFlow</p>
        </div>
        <form class="auth-form" @submit.prevent="handleRegister" novalidate>
          <div v-if="error" class="auth-error" role="alert">{{ error }}</div>
          <div class="input-group">
            <label class="input-label" for="name">Full name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="input"
              placeholder="John Doe"
              required
              autocomplete="name"
              :disabled="loading"
              :aria-invalid="!!error && !name"
            />
          </div>
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
            />
          </div>
          <div class="input-group">
            <label class="input-label" for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="input"
              placeholder="Create a password (min. 6 characters)"
              required
              autocomplete="new-password"
              minlength="6"
              :disabled="loading"
              :aria-invalid="!!error && password.length < 6"
            />
          </div>
          <div class="input-group">
            <label class="input-label" for="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="input"
              placeholder="Repeat your password"
              required
              autocomplete="new-password"
              :disabled="loading"
              :aria-invalid="!!error && password !== confirmPassword"
            />
          </div>
          <button type="submit" class="btn btn-primary w-full" :disabled="loading || submitted">
            <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
            <span v-else>Create account</span>
          </button>
        </form>
        <p class="auth-footer">
          Already have an account? <router-link to="/login">Sign in</router-link>
        </p>
      </div>
  </div>
</template>

<script>
import { useAuth } from '../../composables/useAuth'

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      loading: false,
      submitted: false
    }
  },
  created() {
    this.auth = useAuth()
  },
  methods: {
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
    async handleRegister() {
      if (this.loading || this.submitted) return
      this.error = ''
      if (!this.name || !this.email || !this.password || !this.confirmPassword) {
        this.error = 'Please fill in all fields'
        return
      }
      if (!this.validateEmail(this.email)) {
        this.error = 'Please enter a valid email address'
        return
      }
      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters'
        return
      }
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match'
        return
      }
      this.loading = true
      this.submitted = true
      try {
        await this.auth.register(this.name, this.email, this.password)
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
