<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">Task management, reimagined</div>
          <h1 class="hero-title">Stay organized.<br />Move faster.</h1>
          <p class="hero-subtitle">
            TaskFlow helps teams and individuals track work, manage projects,
            and achieve more with a clean, focused experience.
          </p>
          <div class="hero-actions">
            <AppButton to="/register" size="lg">Get started free</AppButton>
            <AppButton to="/login" variant="secondary" size="lg">Sign in</AppButton>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="features-grid">
          <article class="feature-card">
            <div class="feature-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <path d="M9 14l2 2 4-4"/>
              </svg>
            </div>
            <h3 class="feature-title">Simple task management</h3>
            <p class="feature-text">Create, organize, and track tasks with an intuitive interface designed for focus.</p>
          </article>
          <article class="feature-card">
            <div class="feature-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <h3 class="feature-title">Team collaboration</h3>
            <p class="feature-text">Work together seamlessly. Assign tasks, share updates, and stay aligned.</p>
          </article>
          <article class="feature-card">
            <div class="feature-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
            </div>
            <h3 class="feature-title">Clean dashboard</h3>
            <p class="feature-text">See everything at a glance with a minimal dashboard that puts your work first.</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AppButton from '../../components/ui/Button.vue'

export default {
  name: 'HomePage',
  components: { AppButton }
}
</script>

<style scoped>
.hero {
  padding: var(--spacing-24) 0 var(--spacing-20);
  text-align: center;
}

.hero-content {
  max-width: 680px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-700);
  background-color: var(--color-gray-100);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-6);
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: var(--spacing-6);
  color: var(--color-gray-900);
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-gray-500);
  max-width: 500px;
  margin: 0 auto var(--spacing-10);
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
}

.features {
  padding: var(--spacing-16) 0 var(--spacing-24);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-8);
}

.feature-card {
  padding: var(--spacing-8);
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-100);
  border-radius: var(--radius-xl);
  transition: all var(--transition-base);
}

.feature-card:hover {
  border-color: var(--color-gray-200);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-lg);
  color: var(--color-accent);
  margin-bottom: var(--spacing-5);
}

.feature-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-2);
}

.feature-text {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: var(--text-3xl);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }
}
</style>
