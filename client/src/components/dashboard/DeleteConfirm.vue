<template>
  <Teleport to="body">
    <div
      class="modal-overlay"
      @click.self="$emit('cancel')"
      @keydown.escape="$emit('cancel')"
      role="dialog"
      aria-modal="true"
      aria-label="Delete task"
    >
      <div class="modal modal-sm" ref="modalEl">
        <div class="modal-header">
          <h2 class="modal-title">Delete task</h2>
        </div>
        <div class="modal-body">
          <p class="delete-text">Are you sure you want to delete <strong>"{{ task.title }}"</strong>? This cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="$emit('cancel')" :disabled="deleting">Cancel</button>
            <button class="btn btn-danger" @click="handleDelete" :disabled="deleting">
              <span v-if="deleting" class="btn-spinner" aria-hidden="true"></span>
              <span v-else>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'DeleteConfirm',
  props: {
    task: { type: Object, required: true }
  },
  emits: ['cancel', 'confirm'],
  data() {
    return {
      deleting: false
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    onKeyDown(e) {
      if (e.key === 'Escape') this.$emit('cancel')
    },
    async handleDelete() {
      if (this.deleting) return
      this.deleting = true
      try {
        this.$emit('confirm', this.task._id)
      } finally {
        this.deleting = false
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
  max-width: 400px;
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
  padding: var(--spacing-6) var(--spacing-6) 0;
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.modal-body {
  padding: var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
}

.delete-text {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
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
