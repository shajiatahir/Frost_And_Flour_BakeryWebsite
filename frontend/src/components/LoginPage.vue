<template>
  <div class="auth-bg">
    <LogoHeader />
    <form class="auth-form" @submit.prevent="login">
      <h2>Login</h2>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <p class="auth-link">Don't have an account? <router-link to="/signup">Sign up</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoHeader from './LogoHeader.vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  error.value = ''
  
  if (!email.value || !password.value) {
    error.value = 'Email and password are required'
    return
  }
  
  try {
    const response = await axios.post('http://localhost:3000/', {
      transition: 'LOGIN',
      data: {
        email: email.value,
        password: password.value
      }
    })
    
    if (response.data.user) {
      localStorage.setItem('authUser', JSON.stringify(response.data.user))
      
      // Role-based redirect
      if (response.data.user.role === 'admin') {
        router.push('/admin') // Redirect admins to admin dashboard
      } else {
        router.push('/home') // Redirect customers to home
      }
    } else {
      error.value = response.data.errorMessage || 'Login failed.'
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Login failed. Please try again.'
    }
  }
}
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  background: #ffe6f0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.auth-form {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(229, 115, 138, 0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  max-width: 90vw;
}
.auth-form h2 {
  color: #d72660;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}
.auth-form input {
  width: 100%;
  margin-bottom: 1.2rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid #f3c6d3;
  font-size: 1rem;
  outline: none;
}
.auth-form button {
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 0.7rem;
  transition: background 0.2s;
}
.auth-form button:hover {
  background: #b71c4a;
}
.auth-link {
  margin-top: 0.5rem;
  color: #d72660;
  font-size: 1rem;
}
.auth-link a {
  color: #d72660;
  text-decoration: underline;
}
.auth-error {
  color: #d72660;
  margin-bottom: 0.7rem;
  font-size: 1rem;
  font-weight: 500;
}
</style> 