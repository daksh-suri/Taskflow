import { reactive } from 'vue'
import api from '../services/api'

export function useTasks() {
  const state = reactive({
    tasks: [],
    loading: false,
    error: '',
    stats: null,
    statsLoading: false,
    query: {
      search: '',
      status: '',
      priority: '',
      due: '',
      sort: ''
    }
  })

  let abortController = null

  async function fetchTasks() {
    if (abortController) abortController.abort()
    abortController = new AbortController()

    state.loading = true
    state.error = ''
    try {
      const params = {}
      if (state.query.search) params.search = state.query.search
      if (state.query.status) params.status = state.query.status
      if (state.query.priority) params.priority = state.query.priority
      if (state.query.due) params.due = state.query.due
      if (state.query.sort) params.sort = state.query.sort

      const { data } = await api.get('/tasks', {
        params,
        signal: abortController.signal
      })
      state.tasks = data.tasks
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return
      state.error = 'Failed to load tasks'
    } finally {
      state.loading = false
    }
  }

  async function fetchStats() {
    state.statsLoading = true
    try {
      const { data } = await api.get('/tasks/stats')
      state.stats = data.stats
    } catch {
      // silently fail
    } finally {
      state.statsLoading = false
    }
  }

  async function createTask(title, description, priority = 'medium', dueDate = null) {
    const { data } = await api.post('/tasks', { title, description, priority, dueDate })
    state.tasks.unshift(data.task)
    return data.task
  }

  async function updateTask(id, fields) {
    const { data } = await api.put(`/tasks/${id}`, fields)
    const idx = state.tasks.findIndex(t => t._id === id)
    if (idx !== -1) state.tasks[idx] = data.task
    return data.task
  }

  async function deleteTask(id) {
    await api.delete(`/tasks/${id}`)
    state.tasks = state.tasks.filter(t => t._id !== id)
  }

  async function toggleTask(id) {
    const { data } = await api.patch(`/tasks/${id}/toggle`)
    const idx = state.tasks.findIndex(t => t._id === id)
    if (idx !== -1) state.tasks[idx] = data.task
    return data.task
  }

  function setQuery(updates) {
    Object.assign(state.query, updates)
    fetchTasks()
  }

  function clearFilters() {
    state.query.search = ''
    state.query.status = ''
    state.query.priority = ''
    state.query.due = ''
    state.query.sort = ''
    fetchTasks()
  }

  function activeFilters() {
    const active = []
    if (state.query.status) active.push({ key: 'status', label: `Status: ${state.query.status}` })
    if (state.query.priority) active.push({ key: 'priority', label: `Priority: ${state.query.priority}` })
    if (state.query.due) active.push({ key: 'due', label: `Due: ${state.query.due}` })
    if (state.query.search) active.push({ key: 'search', label: `Search: "${state.query.search}"` })
    return active
  }

  function removeFilter(key) {
    state.query[key] = ''
    fetchTasks()
  }

  return {
    state, fetchTasks, fetchStats, createTask, updateTask, deleteTask, toggleTask,
    setQuery, clearFilters, activeFilters, removeFilter
  }
}
