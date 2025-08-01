import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import SignupPage from '../components/SignupPage.vue'
import LandingPage from '../components/LandingPage.vue'
import MenuPage from '../components/MenuPage.vue'
import CartPage from '../components/CartPage.vue'
import CheckoutPage from '../components/CheckoutPage.vue'
import AboutPage from '../components/AboutPage.vue'
import ContactPage from '../components/ContactPage.vue'
import OrdersPage from '../components/OrdersPage.vue'
import CustomerOrdersPage from '../components/CustomerOrdersPage.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import AdminTrackOrdersPage from '../components/AdminTrackOrdersPage.vue'
import AdminMessagesPage from '../components/AdminMessagesPage.vue'
import AdminUserManagementPage from '../components/AdminUserManagementPage.vue'
import ProfilePage from '../components/ProfilePage.vue'

const routes = [
  { path: '/', name: 'Home', component: LandingPage },
  { path: '/menu', name: 'Menu', component: MenuPage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/contact', name: 'Contact', component: ContactPage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/signup', name: 'Signup', component: SignupPage },
  { path: '/home', name: 'Landing', component: LandingPage, meta: { requiresAuth: true } },
  { path: '/cart', name: 'Cart', component: CartPage, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: CheckoutPage, meta: { requiresAuth: true } },
  { path: '/orders', name: 'Orders', component: OrdersPage, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/customer-orders', name: 'CustomerOrders', component: CustomerOrdersPage, meta: { requiresAuth: true } },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/track-orders', name: 'AdminTrackOrders', component: AdminTrackOrdersPage, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/messages', name: 'AdminMessages', component: AdminMessagesPage, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', name: 'AdminUserManagement', component: AdminUserManagementPage, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/profile', name: 'Profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authUser = localStorage.getItem('authUser')
  const isAuthenticated = authUser && authUser !== 'null' && authUser !== 'undefined'
  
  let userRole = 'customer'
  if (isAuthenticated) {
    try {
      const userData = JSON.parse(authUser)
      userRole = userData.role || 'customer'
    } catch (e) {
      userRole = 'customer'
    }
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login')
    } else if (to.meta.requiresAdmin && userRole !== 'admin') {
      next('/home')
    } else {
      next()
    }
  } else if (to.path === '/login' || to.path === '/signup') {
    if (isAuthenticated) {
      next('/home')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router