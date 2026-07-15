<template>
  <Teleport to="body">
    <div
      class="modal-overlay"
      @click.self="$emit('close')"
      @keydown.escape="$emit('close')"
      role="dialog"
      aria-modal="true"
      :aria-label="isEditing ? 'Edit task' : 'Create task'"
    >
      <div class="modal" ref="modalEl">
        <div class="modal-header">
          <h2 class="modal-title" :id="titleId">{{ isEditing ? 'Edit task' : 'Create task' }}</h2>
          <button class="modal-close" @click="$emit('close')" aria-label="Close dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form class="modal-body" @submit.prevent="handleSubmit" novalidate>
          <div v-if="error" class="form-error" role="alert">{{ error }}</div>
          <div class="input-group">
            <label class="input-label" for="task-title">Task title</label>
            <input
              id="task-title"
              ref="titleInput"
              v-model="title"
              type="text"
              class="input"
              placeholder="What needs to be done?"
              maxlength="200"
              :disabled="submitting"
              :aria-invalid="!!error && !title.trim()"
              aria-required="true"
            />
          </div>
          <div class="input-group">
            <label class="input-label" for="task-desc">Description <span class="input-label-optional">(optional)</span></label>
            <textarea
              id="task-desc"
              v-model="description"
              class="input input-textarea"
              placeholder="Add more detail..."
              rows="3"
              maxlength="1000"
              :disabled="submitting"
            ></textarea>
          </div>
          <div class="form-row">
            <div class="input-group">
              <label class="input-label" for="task-priority">Priority</label>
              <select id="task-priority" v-model="priority" class="input" :disabled="submitting">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="input-group">
              <label class="input-label" for="task-due">Due date <span class="input-label-optional">(optional)</span></label>
              <input
                id="task-due"
                v-model="dueDate"
                type="date"
                class="input"
                :disabled="submitting"
              />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="$emit('close')" :disabled="submitting">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting || submitted || !title.trim()">
              <span v-if="submitting" class="btn-spinner" aria-hidden="true"></span>
              <span v-else>{{ isEditing ? 'Save changes' : 'Create task' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script>
let uid = 0

export default {
  name: 'TaskForm',
  props: {
    task: { type: Object, default: null }
  },
  emits: ['close', 'save'],
  data() {
    return {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      error: '',
      submitting: false,
      submitted: false
    }
  },
  computed: {
    isEditing() { return !!this.task },
    titleId() { return 'task-form-title-' + this._uid }
  },
  created() {
    this._uid = ++uid
    if (this.task) {
      this.title = this.task.title
      this.description = this.task.description || ''
      this.priority = this.task.priority || 'medium'
      this.dueDate = this.task.dueDate ? this.task.dueDate.slice(0, 10) : ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.titleInput?.focus()
    })
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    onKeyDown(e) {
      if (e.key === 'Escape') this.$emit('close')
    },
    async handleSubmit() {
      if (this.submitting || this.submitted) return
      this.error = ''
      if (!this.title.trim()) {
        this.error = 'Task title is required'
        return
      }
      this.submitting = true
      this.submitted = true
      try {
        this.$emit('save', {
          id: this.task?._id,
          title: this.title.trim(),
          description: this.description.trim(),
          priority: this.priority,
          dueDate: this.dueDate || null
        })
      } catch {
        this.error = 'Something went wrong'
        this.submitted = false
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.modal {
  width: 100%;
  max-width: 480px;
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  animation: modal-in 200ms ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6) var(--spacing-6) 0;
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-400);
  padding: var(--spacing-1);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  color: var(--color-gray-700);
  background-color: var(--color-gray-100);
}

.modal-close:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.modal-body {
  padding: var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
}

.form-error {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-sm);
  color: var(--color-danger);
  background-color: var(--color-danger-bg);
  border-radius: var(--radius-md);
}

.input-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.6;
}

.input-label-optional {
  font-weight: var(--font-normal);
  color: var(--color-gray-400);
}

.form-row {
  display: flex;
  gap: var(--spacing-4);
}

.form-row .input-group {
  flex: 1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding-top: var(--spacing-2);
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

@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
  }
}
</style>
