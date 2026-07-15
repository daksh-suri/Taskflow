<template>
  <component
    :is="tag"
    :to="to"
    :class="['btn', `btn-${variant}`, size === 'lg' ? 'btn-lg' : '', className]"
    :disabled="disabled"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <span v-else><slot /></span>
  </component>
</template>

<script>
export default {
  name: 'AppButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (v) => ['primary', 'secondary', 'danger'].includes(v)
    },
    size: {
      type: String,
      default: 'md'
    },
    to: {
      type: [String, Object],
      default: null
    },
    className: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tag() {
      return this.to ? 'router-link' : 'button'
    }
  }
}
</script>

<style scoped>
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
