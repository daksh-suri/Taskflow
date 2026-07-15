<template>
  <div :class="['search-bar', { 'search-bar--focused': focused }]" role="search">
    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input
      ref="input"
      class="search-input"
      type="text"
      :value="modelValue"
      @input="onInput"
      @focus="focused = true"
      @blur="focused = false"
      @keydown.escape="onClear"
      placeholder="Search tasks…"
      aria-label="Search tasks"
      autocomplete="off"
    />
    <button
      v-if="modelValue"
      class="search-clear"
      @click="onClear"
      aria-label="Clear search"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  data() {
    return { focused: false, timer: null }
  },
  beforeUnmount() {
    clearTimeout(this.timer)
  },
  methods: {
    onInput(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('update:modelValue', e.target.value)
      }, 250)
    },
    onClear() {
      clearTimeout(this.timer)
      this.$emit('update:modelValue', '')
      this.$refs.input?.focus()
    }
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: 0 var(--spacing-4);
  height: 40px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.search-bar:hover {
  border-color: var(--color-gray-300);
}

.search-bar--focused {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-ring);
  background-color: var(--color-white);
}

.search-icon {
  flex-shrink: 0;
  color: var(--color-gray-400);
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  font-size: var(--text-sm);
  color: var(--color-gray-900);
  outline: none;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--color-gray-400);
}

.search-clear {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-400);
  padding: 2px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.search-clear:hover {
  color: var(--color-gray-700);
}

.search-clear:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}
</style>
