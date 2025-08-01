<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <img src="/frost_and_flour_icon.png" alt="Frost and Flour Logo" class="logo-img" />
          <span class="logo-text">Frost and Flour</span>
        </router-link>
      </div>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/menu">Menu</router-link></li>
        <li v-if="!isAuthenticated || userRole === 'customer'"><router-link to="/about">About</router-link></li>
        <li v-if="isAuthenticated && userRole === 'customer'"><router-link to="/customer-orders">Track Orders</router-link></li>
        <li v-if="isAuthenticated && userRole === 'admin'"><router-link to="/admin">Admin Panel</router-link></li>
        <li v-if="!isAuthenticated || userRole === 'customer'"><router-link to="/contact">Contact</router-link></li>
      </ul>
      <div class="nav-icons">
        <!-- Show profile and cart for authenticated users -->
        <template v-if="isAuthenticated">
          <div class="profile-dropdown-wrapper" @click="toggleProfileDropdown">
            <button class="icon-btn profile-btn">
              <!-- Profile SVG -->
              <svg width="24" height="24" fill="none" stroke="#d72660" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4"/></svg>
            </button>
            <div v-if="showProfileDropdown" class="profile-dropdown">
              <router-link to="/profile" class="dropdown-link">View Profile</router-link>
              <button class="dropdown-link" @click="logout">Logout</button>
            </div>
          </div>
          <button class="icon-btn" @click="openCart">
            <!-- Cart SVG -->
            <svg width="24" height="24" fill="none" stroke="#d72660" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
        </template>
        <!-- Show login/signup buttons for unauthenticated users -->
        <template v-else>
          <div class="auth-buttons">
            <router-link to="/login" class="auth-btn login-btn">Login</router-link>
            <router-link to="/signup" class="auth-btn signup-btn">Sign Up</router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../composables/cartStore'

const cart = useCartStore()
const router = useRouter()
const showProfileDropdown = ref(false)

// Check authentication status and user role
const isAuthenticated = computed(() => {
  const authUser = localStorage.getItem('authUser')
  return authUser && authUser !== 'null' && authUser !== 'undefined'
})

const userRole = computed(() => {
  if (!isAuthenticated.value) return 'customer'
  try {
    const authUser = localStorage.getItem('authUser')
    const userData = JSON.parse(authUser)
    return userData.role || 'customer'
  } catch (e) {
    return 'customer'
  }
})

function openCart() {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  cart.isOpen = true
}
function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
}
function logout() {
  // Clear authentication data
  localStorage.removeItem('authUser')
  // Clear any other user-related data
  localStorage.removeItem('profile')
  // Clear cart
  cart.clearCart()
  // Close dropdown
  showProfileDropdown.value = false
  // Navigate to login page
  router.push('/login')
}

// Click outside handler for dropdown
function handleClickOutside(event) {
  const dropdown = document.querySelector('.profile-dropdown-wrapper')
  if (dropdown && !dropdown.contains(event.target)) {
    showProfileDropdown.value = false
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  width: 100vw;
  min-width: 100vw;
  left: 0;
  top: 0;
  background: linear-gradient(90deg, #ffd6e6 0%, #ffe6f0 100%);
  box-shadow: 0 4px 24px 0 #ffd6e6, 0 2px 16px 0 #ffb6d5;
  border-bottom: 3px solid #d72660;
  position: sticky;
  z-index: 100;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo-section {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
}
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #fff0f6;
  border: 2.5px solid #d72660;
  margin: 0;
  object-fit: contain;
  display: block;
  box-shadow: 0 2px 8px #ffd6e6;
}
.logo-text {
  font-size: 1.3rem;
  font-family: inherit;
  font-weight: 700;
  color: #d72660;
  margin-left: 0.6rem;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  line-height: 1;
  white-space: nowrap;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
  font-size: 1rem;
  font-weight: 600;
  color: #d72660;
  margin: 0;
  padding: 0;
}
.nav-links li {
  cursor: pointer;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid transparent;
  transition: border 0.2s;
  white-space: nowrap;
  color: #d72660;
  font-weight: 600;
  background: none;
  border: none;
  margin: 0;
  display: flex;
  align-items: center;
}
.nav-links li .router-link-active,
.nav-links li .router-link-exact-active {
  color: #d72660 !important;
  font-weight: 700;
  border-bottom: 2px solid #d72660;
  text-decoration: none;
}
.nav-links li a {
  color: #d72660;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.18s;
}
.nav-links li a:hover {
  color: #b71c4a;
  text-decoration: underline;
}
.nav-icons {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 1.5rem;
}
.profile-dropdown-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.profile-btn {
  z-index: 2;
}
.profile-dropdown {
  position: fixed;
  top: 64px;
  right: 2.5rem;
  background: #fff0f6;
  border: 1.5px solid #ffd6e6;
  border-radius: 12px;
  box-shadow: 0 4px 24px #ffd6e6, 0 2px 16px #ffb6d5;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  padding: 0.5rem 0;
}
.dropdown-link {
  color: #d72660;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.7rem 1.2rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.18s;
  border-radius: 8px;
}
.dropdown-link:hover {
  background: #ffd6e6;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 50%;
  transition: background 0.18s;
}
.icon-btn:hover {
  background: #ffd6e6;
}
.icon-btn svg {
  display: block;
  width: 24px;
  height: 24px;
  z-index: 1;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.login-btn {
  color: #d72660;
  background: transparent;
  border-color: #d72660;
}

.login-btn:hover {
  background: #d72660;
  color: white;
}

.signup-btn {
  color: white;
  background: #d72660;
  border-color: #d72660;
}

.signup-btn:hover {
  background: #b71c4a;
  border-color: #b71c4a;
}
</style>