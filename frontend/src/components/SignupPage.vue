<template>
  <div class="auth-bg">
    <LogoHeader />
    <form class="auth-form" @submit.prevent="signup">
      <h2>Sign Up</h2>
      <input v-model="name" type="text" placeholder="Full Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <p class="auth-link">Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoHeader from './LogoHeader.vue'
import axios from 'axios'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const error = ref('')

async function signup() {
  error.value = ''
  
  if (!name.value || !email.value || !password.value) {
    error.value = 'All fields are required'
    return
  }
  
  try {
    console.log('Sending signup request with data:', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: 'customer'
    })
    
    const response = await axios.post('http://localhost:3000/', {
      transition: 'SIGNUP',
      data: {
        name: name.value,
        email: email.value,
        password: password.value,
        role: 'customer' // Always register as customer
      }
    })
    
    console.log('Signup response:', response.data)
    
    if (response.data.errorMessage) {
      error.value = response.data.errorMessage
    } else if (response.data.success || response.data.message) {
      // Success case - clear form and redirect
      console.log('Signup successful! Redirecting to login...')
      name.value = ''
      email.value = ''
      password.value = ''
      router.push('/login')
    } else {
      // If no error message and no explicit success, assume success
      // (since the user was created in database)
      console.log('Signup completed successfully, redirecting to login...')
      name.value = ''
      email.value = ''
      password.value = ''
      router.push('/login')
    }
  } catch (err) {
    console.error('Signup error:', err)
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else if (err.response && err.response.data && err.response.data.errorMessage) {
      error.value = err.response.data.errorMessage
    } else {
      error.value = 'Signup failed. Please try again.'
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