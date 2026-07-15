<template>
  <div class="workspace">
    <Sidebar :activeFilter="activeFilter" @filter="handleSidebarFilter" />
    <main class="workspace-main">
      <div class="workspace-topbar">
        <div class="workspace-greeting">
          <h1 class="workspace-title" v-if="auth.user.value">{{ greeting }}, {{ auth.user.value.name.split(' ')[0] }}</h1>
          <div v-else class="workspace-title-skeleton" aria-hidden="true"></div>
          <p class="workspace-subtitle">{{ insightText }}</p>
        </div>
        <button class="btn btn-primary" @click="openCreate" aria-label="Create a new task">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New task
        </button>
      </div>

      <div v-if="tasksState.stats" class="insights">
        <div class="insight-card">
          <span class="insight-value">{{ tasksState.stats.overdue }}</span>
          <span class="insight-label">Overdue</span>
        </div>
        <div class="insight-card">
          <span class="insight-value">{{ tasksState.stats.dueToday }}</span>
          <span class="insight-label">Due today</span>
        </div>
        <div class="insight-card">
          <span class="insight-value">{{ tasksState.stats.highPriority }}</span>
          <span class="insight-label">High priority</span>
        </div>
        <div class="insight-card insight-card--progress">
          <div class="insight-progress-bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100" :aria-label="`${progressPercent}% of tasks completed`">
            <div class="insight-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="insight-label">{{ tasksState.stats.completed }} / {{ tasksState.stats.total }} done</span>
        </div>
      </div>
      <div v-else class="insights-skeleton" aria-hidden="true">
        <div class="insight-skeleton-card"></div>
        <div class="insight-skeleton-card"></div>
        <div class="insight-skeleton-card"></div>
        <div class="insight-skeleton-card insight-skeleton-card--wide"></div>
      </div>

      <div class="workspace-controls">
        <SearchBar v-model="searchQuery" />
        <div class="controls-right">
          <div class="select-wrapper">
            <select v-model="filterStatus" class="select" aria-label="Filter by status">
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div class="select-wrapper">
            <select v-model="filterPriority" class="select" aria-label="Filter by priority">
              <option value="">All priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div class="select-wrapper">
            <select v-model="filterDue" class="select" aria-label="Filter by due date">
              <option value="">All dates</option>
              <option value="today">Due today</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div class="select-wrapper">
            <select v-model="filterSort" class="select" aria-label="Sort tasks">
              <option value="">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="hasActiveFilters" class="active-filters">
        <span
          v-for="f in activeFilterList"
          :key="f.key"
          class="active-filter-tag"
        >
          {{ f.label }}
          <button class="active-filter-remove" @click="removeFilterTag(f.key)" :aria-label="'Remove ' + f.label + ' filter'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </span>
        <button class="active-filter-clear" @click="clearAllFilters">Clear all</button>
      </div>

      <div aria-live="polite" aria-atomic="true">
        <div v-if="tasksState.loading && !tasksState.tasks.length" class="workspace-loading">
          <div class="skeleton-list">
            <div class="skeleton-card" v-for="n in 4" :key="n"></div>
          </div>
        </div>

        <div v-else-if="tasksState.error" class="workspace-error" role="alert">
          <div class="error-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p class="error-text">{{ tasksState.error }}</p>
          <button class="btn btn-secondary" @click="fetchData">Try again</button>
        </div>

        <div v-else-if="tasksState.tasks.length === 0 && !tasksState.loading" class="workspace-content">
          <EmptyState :type="emptyStateType" @create="openCreate" />
        </div>

        <div v-else class="workspace-content">
          <div class="task-list">
            <TaskCard
              v-for="task in tasksState.tasks"
              :key="task._id"
              :task="task"
              @toggle="handleToggle"
              @edit="openEdit"
              @delete="confirmDelete"
            />
          </div>
        </div>
      </div>
    </main>

    <TaskForm
      v-if="showForm"
      :task="editingTask"
      @close="closeForm"
      @save="handleSave"
    />

    <DeleteConfirm
      v-if="deletingTask"
      :task="deletingTask"
      @cancel="deletingTask = null"
      @confirm="handleDelete"
    />
  </div>
</template>

<script>
import { useAuth } from '../../composables/useAuth'
import { useTasks } from '../../composables/useTasks'
import Sidebar from '../../components/dashboard/Sidebar.vue'
import SearchBar from '../../components/dashboard/SearchBar.vue'
import TaskCard from '../../components/dashboard/TaskCard.vue'
import TaskForm from '../../components/dashboard/TaskForm.vue'
import DeleteConfirm from '../../components/dashboard/DeleteConfirm.vue'
import EmptyState from '../../components/dashboard/EmptyState.vue'

export default {
  name: 'DashboardPage',
  components: { Sidebar, SearchBar, TaskCard, TaskForm, DeleteConfirm, EmptyState },
  data() {
    return {
      showForm: false,
      editingTask: null,
      deletingTask: null,
      searchQuery: '',
      filterStatus: '',
      filterPriority: '',
      filterDue: '',
      filterSort: '',
      sidebarFilter: '',
      greeting: ''
    }
  },
  created() {
    this.auth = useAuth()
    this.tasks = useTasks()
    const greetings = ['Welcome back', 'Good to see you', 'Hey', 'Hello', 'Back at it']
    this.greeting = greetings[Math.floor(Math.random() * greetings.length)]
    this.fetchData()
  },
  watch: {
    searchQuery(val) {
      this.tasks.setQuery({ search: val })
    },
    filterStatus(val) {
      this.tasks.setQuery({ status: val })
    },
    filterPriority(val) {
      this.tasks.setQuery({ priority: val })
    },
    filterDue(val) {
      this.tasks.setQuery({ due: val })
    },
    filterSort(val) {
      this.tasks.setQuery({ sort: val })
    }
  },
  computed: {
    tasksState() { return this.tasks.state },
    activeFilter() { return this.sidebarFilter },
    hasActiveFilters() { return this.activeFilterList.length > 0 },
    activeFilterList() { return this.tasks.activeFilters() },
    emptyStateType() {
      if (this.searchQuery) return 'search'
      if (this.filterStatus || this.filterPriority || this.filterDue || this.sidebarFilter) return 'filter'
      if (this.tasksState.stats && this.tasksState.stats.total > 0 && this.tasksState.stats.remaining === 0) return 'done'
      return 'empty'
    },
    insightText() {
      const s = this.tasksState.stats
      if (!s) return ''
      if (s.remaining === 0 && s.total > 0) return 'All tasks completed. Great work!'
      if (s.overdue > 0) return `${s.overdue} task${s.overdue > 1 ? 's' : ''} overdue, ${s.remaining} remaining`
      if (s.dueToday > 0) return `${s.dueToday} task${s.dueToday > 1 ? 's' : ''} due today, ${s.remaining} remaining`
      return `${s.remaining} task${s.remaining !== 1 ? 's' : ''} remaining`
    },
    progressPercent() {
      const s = this.tasksState.stats
      if (!s || s.total === 0) return 0
      return Math.round((s.completed / s.total) * 100)
    }
  },
  methods: {
    async fetchData() {
      await Promise.all([
        this.tasks.fetchTasks(),
        this.tasks.fetchStats()
      ])
    },
    handleSidebarFilter(filter) {
      this.sidebarFilter = filter.due || filter.priority || filter.status || ''
      this.filterStatus = filter.status || ''
      this.filterPriority = filter.priority || ''
      this.filterDue = filter.due || ''
      this.tasks.setQuery(filter)
    },
    removeFilterTag(key) {
      if (key === 'search') {
        this.searchQuery = ''
      } else {
        this.tasks.removeFilter(key)
        if (key === 'status') this.filterStatus = ''
        if (key === 'priority') this.filterPriority = ''
        if (key === 'due') { this.filterDue = ''; this.sidebarFilter = '' }
      }
    },
    clearAllFilters() {
      this.searchQuery = ''
      this.filterStatus = ''
      this.filterPriority = ''
      this.filterDue = ''
      this.filterSort = ''
      this.sidebarFilter = ''
      this.tasks.clearFilters()
    },
    openCreate() {
      this.editingTask = null
      this.showForm = true
    },
    openEdit(task) {
      this.editingTask = task
      this.showForm = true
    },
    closeForm() {
      this.showForm = false
      this.editingTask = null
    },
    async handleSave({ id, title, description, priority, dueDate }) {
      if (id) {
        await this.tasks.updateTask(id, { title, description, priority, dueDate })
      } else {
        await this.tasks.createTask(title, description, priority, dueDate)
      }
      await this.tasks.fetchStats()
      this.closeForm()
    },
    async handleToggle(id) {
      await this.tasks.toggleTask(id)
      await this.tasks.fetchStats()
    },
    confirmDelete(task) {
      this.deletingTask = task
    },
    async handleDelete(id) {
      await this.tasks.deleteTask(id)
      await this.tasks.fetchStats()
      this.deletingTask = null
    }
  }
}
</script>

<style scoped>
.workspace {
  display: flex;
  min-height: calc(100vh - var(--navbar-height));
}

.workspace-main {
  flex: 1;
  padding: var(--spacing-8) var(--spacing-8) var(--spacing-16);
  max-width: 900px;
}

.workspace-topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
  gap: var(--spacing-4);
}

.workspace-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-1);
}

.workspace-title-skeleton {
  width: 240px;
  height: 32px;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-1);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.workspace-subtitle {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
}

.insights {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--color-gray-100);
}

.insight-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.insight-value {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-900);
  line-height: 1.2;
}

.insight-label {
  font-size: var(--text-xs);
  color: var(--color-gray-500);
}

.insight-card--progress {
  margin-left: auto;
  align-items: flex-end;
  flex: 1;
  max-width: 200px;
}

.insight-progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 4px;
}

.insight-progress-fill {
  height: 100%;
  background-color: var(--color-accent);
  border-radius: var(--radius-full);
  transition: width 300ms ease;
}

.insights-skeleton {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--color-gray-100);
}

.insight-skeleton-card {
  width: 60px;
  height: 40px;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-md);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.insight-skeleton-card--wide {
  flex: 1;
  max-width: 200px;
  margin-left: auto;
}

.workspace-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
  align-items: center;
}

.workspace-controls > :first-child {
  flex: 1;
  min-width: 200px;
}

.controls-right {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -2px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--color-gray-400);
  pointer-events: none;
}

.select {
  appearance: none;
  padding: var(--spacing-2) var(--spacing-8) var(--spacing-2) var(--spacing-3);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-gray-700);
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  outline: none;
  font-family: inherit;
  transition: all var(--transition-fast);
  min-width: 90px;
}

.select:hover {
  border-color: var(--color-gray-300);
}

.select:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-ring);
  background-color: var(--color-white);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
}

.active-filter-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: 2px var(--spacing-2);
  font-size: 0.6875rem;
  font-weight: var(--font-medium);
  color: var(--color-accent);
  background-color: var(--color-accent-bg);
  border-radius: var(--radius-full);
}

.active-filter-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-accent);
  padding: 0;
  line-height: 1;
  border-radius: var(--radius-sm);
}

.active-filter-remove:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.active-filter-clear {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.6875rem;
  font-weight: var(--font-medium);
  color: var(--color-gray-500);
  padding: 2px var(--spacing-1);
  text-decoration: underline;
  text-underline-offset: 2px;
  font-family: inherit;
}

.active-filter-clear:hover {
  color: var(--color-gray-700);
}

.active-filter-clear:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.workspace-loading {
  padding-top: 0;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.skeleton-card {
  height: 68px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-100);
  border-radius: var(--radius-lg);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.workspace-error {
  text-align: center;
  padding: var(--spacing-16) 0;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: var(--color-danger-bg);
  border-radius: var(--radius-xl);
  color: var(--color-danger);
  margin-bottom: var(--spacing-5);
}

.error-text {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  margin-bottom: var(--spacing-4);
}

.workspace-content {
  padding-top: 0;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

@media (max-width: 768px) {
  .workspace-main {
    padding: var(--spacing-6) var(--spacing-4) var(--spacing-12);
  }

  .workspace-topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .insights {
    flex-wrap: wrap;
  }

  .insight-card--progress {
    width: 100%;
    max-width: none;
    align-items: stretch;
  }

  .insights-skeleton {
    flex-wrap: wrap;
  }

  .insight-skeleton-card--wide {
    width: 100%;
    max-width: none;
  }

  .workspace-controls {
    flex-direction: column;
  }

  .controls-right {
    width: 100%;
  }

  .controls-right .select-wrapper {
    flex: 1;
  }
}
</style>
