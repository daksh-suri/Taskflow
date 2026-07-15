<template>
  <aside class="sidebar" aria-label="Workspace filters">
    <div class="sidebar-section">
      <h3 class="sidebar-label">Workspace</h3>
      <button
        :class="['sidebar-item', { active: !activeFilter }]"
        @click="$emit('filter', {})"
        :aria-current="!activeFilter ? 'page' : undefined"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="1"/>
          <path d="M9 14l2 2 4-4"/>
        </svg>
        All Tasks
      </button>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-label">Quick filters</h3>
      <button
        :class="['sidebar-item', { active: activeFilter === 'today' }]"
        @click="$emit('filter', { due: 'today' })"
        :aria-current="activeFilter === 'today' ? 'page' : undefined"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Due Today
      </button>
      <button
        :class="['sidebar-item', { active: activeFilter === 'overdue' }]"
        @click="$emit('filter', { due: 'overdue' })"
        :aria-current="activeFilter === 'overdue' ? 'page' : undefined"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Overdue
      </button>
      <button
        :class="['sidebar-item', { active: activeFilter === 'high' }]"
        @click="$emit('filter', { priority: 'high' })"
        :aria-current="activeFilter === 'high' ? 'page' : undefined"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
        </svg>
        High Priority
      </button>
      <button
        :class="['sidebar-item', { active: activeFilter === 'completed' }]"
        @click="$emit('filter', { status: 'completed' })"
        :aria-current="activeFilter === 'completed' ? 'page' : undefined"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Completed
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    activeFilter: { type: String, default: '' }
  },
  emits: ['filter']
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: var(--spacing-8) var(--spacing-4);
  background-color: var(--color-white);
  border-right: 1px solid var(--color-gray-100);
  min-height: calc(100vh - var(--navbar-height));
}

.sidebar-section {
  margin-bottom: var(--spacing-6);
}

.sidebar-label {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400);
  padding: 0 var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-700);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.sidebar-item:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.sidebar-item:active {
  background-color: var(--color-gray-200);
}

.sidebar-item.active {
  background-color: var(--color-accent-bg);
  color: var(--color-accent);
}

.sidebar-item:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
