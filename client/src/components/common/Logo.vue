<template>
  <router-link to="/" class="logo" aria-label="TaskFlow home">
    <svg class="logo-icon" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="currentColor"/>
      <path d="M9 16l5 5 9-9" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="logo-text">TaskFlow</span>
  </router-link>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-3);
  color: var(--color-gray-900);
  text-decoration: none;
  border-radius: var(--radius-sm);
}

.logo:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

.logo-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.logo-text {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  letter-spacing: -0.02em;
}
</style>
