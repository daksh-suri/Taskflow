import { reactive, computed } from 'vue'
import api from '../services/api'

const state = reactive({
  user: null,
  loading: true
})

let pendingFetch = null
let fetchVersion = 0

export function useAuth() {
  const isAuthenticated = computed(() => !!state.user)

  function fetchCurrentUser() {
    if (pendingFetch) return pendingFetch
    const myVersion = ++fetchVersion
    state.loading = true
    pendingFetch = (async () => {
      try {
        const res = await api.get('/auth/me', {
          validateStatus: status => status === 200 || status === 401
        })
        if (myVersion !== fetchVersion) return
        if (res.status === 200) {
          state.user = res.data.user
        } else {
          state.user = null
        }
      } catch {
        if (myVersion !== fetchVersion) return
        state.user = null
      } finally {
        if (myVersion === fetchVersion) {
          state.loading = false
          pendingFetch = null
        }
      }
    })()
    return pendingFetch
  }

  async function login(email, password) {
    fetchVersion++
    pendingFetch = null
    const { data } = await api.post('/auth/login', { email, password })
    state.user = data.user
  }

  async function register(name, email, password) {
    fetchVersion++
    pendingFetch = null
    const { data } = await api.post('/auth/register', { name, email, password })
    state.user = data.user
  }

  async function logout() {
    fetchVersion++
    pendingFetch = null
    state.user = null
    await api.post('/auth/logout')
  }

  return {
    user: computed(() => state.user),
    loading: computed(() => state.loading),
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser
  }
}
