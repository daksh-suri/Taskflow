<template>
  <div :class="['task-card', { 'task-card--done': task.completed }]">
    <button
      class="task-check"
      @click="$emit('toggle', task._id)"
      :aria-label="task.completed ? 'Mark task as pending' : 'Mark task as complete'"
    >
      <span v-if="task.completed" class="task-check-icon task-check-icon--done" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span v-else class="task-check-icon" aria-hidden="true"></span>
    </button>
    <div
      class="task-body"
      @click="$emit('edit', task)"
      @keydown.enter="$emit('edit', task)"
      role="button"
      :tabindex="0"
      :aria-label="'Edit task: ' + task.title"
    >
      <div class="task-row">
        <h3 :class="['task-title', { 'task-title--done': task.completed }]">{{ task.title }}</h3>
        <span v-if="task.priority && task.priority !== 'medium'" :class="['task-priority', `task-priority--${task.priority}`]">
          {{ task.priority }}
        </span>
      </div>
      <p v-if="task.description" class="task-description">{{ task.description }}</p>
      <div v-if="task.dueDate || task.priority" class="task-meta">
        <span v-if="task.dueDate" :class="['task-due', { 'task-due--overdue': isOverdue, 'task-due--today': isToday }]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ formattedDate }}
        </span>
      </div>
    </div>
    <button
      class="task-delete"
      @click.stop="$emit('delete', task)"
      :aria-label="'Delete task: ' + task.title"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'TaskCard',
  props: {
    task: { type: Object, required: true }
  },
  emits: ['toggle', 'edit', 'delete'],
  computed: {
    isOverdue() {
      if (!this.task.dueDate || this.task.completed) return false
      return new Date(this.task.dueDate) < new Date()
    },
    isToday() {
      if (!this.task.dueDate) return false
      const due = new Date(this.task.dueDate)
      const now = new Date()
      return due.toDateString() === now.toDateString()
    },
    formattedDate() {
      const d = new Date(this.task.dueDate)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }
}
</script>

<style scoped>
.task-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-5);
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-100);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.task-card:hover {
  border-color: var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.task-card:focus-within {
  border-color: var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.task-card--done {
  background-color: var(--color-gray-50);
}

.task-check {
  flex-shrink: 0;
  margin-top: 2px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: var(--radius-full);
}

.task-check:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.task-check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.task-check:hover .task-check-icon {
  border-color: var(--color-accent);
}

.task-check-icon--done {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-white);
}

.task-body {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.task-body:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.task-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.task-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-900);
  line-height: 1.5;
  word-break: break-word;
}

.task-title--done {
  text-decoration: line-through;
  color: var(--color-gray-400);
}

.task-priority {
  flex-shrink: 0;
  font-size: 0.625rem;
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.task-priority--high {
  color: var(--color-gray-900);
  background-color: var(--color-accent-bg);
}

.task-priority--low {
  color: var(--color-gray-500);
  background-color: var(--color-gray-100);
}

.task-description {
  font-size: var(--text-xs);
  color: var(--color-gray-500);
  margin-top: var(--spacing-1);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-top: var(--spacing-2);
}

.task-due {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.6875rem;
  font-weight: var(--font-medium);
  color: var(--color-gray-500);
}

.task-due--overdue {
  color: var(--color-gray-900);
  font-weight: var(--font-semibold);
}

.task-due--today {
  color: var(--color-gray-700);
  font-weight: var(--font-semibold);
}

.task-delete {
  flex-shrink: 0;
  margin-top: 2px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-300);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  opacity: 0.6;
}

.task-card:hover .task-delete,
.task-card:focus-within .task-delete,
.task-delete:focus-visible {
  opacity: 1;
}

.task-delete:hover {
  color: var(--color-danger);
  background-color: var(--color-danger-bg);
}

.task-delete:focus-visible {
  outline: 2px solid var(--color-danger);
  outline-offset: 1px;
  opacity: 1;
}
</style>
