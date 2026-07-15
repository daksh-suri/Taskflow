import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home/HomePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register/RegisterPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard/DashboardPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth && !to.meta.guest) {
    return next()
  }

  const { useAuth } = await import('../composables/useAuth')
  const { isAuthenticated, fetchCurrentUser } = useAuth()

  if (!isAuthenticated.value) {
    await fetchCurrentUser()
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next('/login')
  }

  if (to.meta.guest && isAuthenticated.value) {
    return next('/dashboard')
  }

  next()
})

export default router
