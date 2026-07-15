<template>
  <div class="empty-state">
    <div class="empty-icon" aria-hidden="true">
      <template v-if="type === 'empty'">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="1"/>
          <line x1="9" y1="12" x2="15" y2="12"/>
          <line x1="9" y1="16" x2="13" y2="16"/>
        </svg>
      </template>
      <template v-else-if="type === 'search'">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </template>
      <template v-else-if="type === 'filter'">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="12" x2="14" y2="12"/>
          <line x1="18" y1="16" x2="22" y2="16"/>
        </svg>
      </template>
      <template v-else>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </template>
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-text">{{ text }}</p>
    <button v-if="action" class="btn btn-primary" @click="$emit('create')">{{ action }}</button>
    <button v-else-if="type === 'done'" class="btn btn-secondary" @click="$emit('create')">Create another task</button>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    type: { type: String, default: 'empty' }
  },
  emits: ['create'],
  computed: {
    title() {
      switch (this.type) {
        case 'search': return 'No results found'
        case 'filter': return 'No tasks match these filters'
        case 'done': return 'Everything is done'
        default: return 'No tasks yet'
      }
    },
    text() {
      switch (this.type) {
        case 'search': return 'Try a different search term or clear the search.'
        case 'filter': return 'Try adjusting your filters or clear them to see all tasks.'
        case 'done': return 'Great work! You have completed all your tasks.'
        default: return 'Create your first task and start getting things done.'
      }
    },
    action() {
      return this.type === 'empty' ? 'Create your first task' : ''
    }
  }
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--spacing-16) var(--spacing-4);
  max-width: 360px;
  margin: 0 auto;
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-xl);
  color: var(--color-gray-400);
  margin-bottom: var(--spacing-5);
}

.empty-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-2);
}

.empty-text {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  margin-bottom: var(--spacing-6);
  line-height: 1.6;
}
</style>
