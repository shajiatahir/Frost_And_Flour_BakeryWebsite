<template>
  <div class="profile-page-bg">
    <Navbar />
    <div class="profile-page">
      <h1>Your Profile</h1>
      <div class="profile-content">
        <div class="profile-pic-section">
          <img :src="profilePic || '/frost_and_flour_icon.png'" alt="Profile Picture" class="profile-pic" />
          <input type="file" accept="image/*" @change="onPicChange" />
        </div>
        <form class="profile-form" @submit.prevent="saveProfile">
          <div class="form-row">
            <label for="firstName">First Name</label>
            <input id="firstName" v-model="firstName" type="text" required />
          </div>
          <div class="form-row">
            <label for="lastName">Last Name</label>
            <input id="lastName" v-model="lastName" type="text" required />
          </div>
          <div class="form-row">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" required />
          </div>
          <div class="form-row">
            <label for="contact">Contact Number</label>
            <input id="contact" v-model="contact" type="text" required />
          </div>
          <button class="save-btn" type="submit">Save Profile</button>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { ref, onMounted } from 'vue'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const contact = ref('')
const profilePic = ref('')

onMounted(() => {
  const stored = localStorage.getItem('profile')
  if (stored) {
    const data = JSON.parse(stored)
    firstName.value = data.firstName || ''
    lastName.value = data.lastName || ''
    email.value = data.email || ''
    contact.value = data.contact || ''
    profilePic.value = data.profilePic || ''
  }
})

function saveProfile() {
  localStorage.setItem('profile', JSON.stringify({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    contact: contact.value,
    profilePic: profilePic.value
  }))
  alert('Profile saved!')
}

function onPicChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    profilePic.value = ev.target.result
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.profile-page-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}
.profile-page {
  max-width: 600px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 400px;
  text-align: center;
}
.profile-page h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.profile-pic-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}
.profile-pic {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 2px 12px #ffd6e6;
  background: #fff;
  border: 3px solid #ffd6e6;
}
.profile-form {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
}
.form-row label {
  color: #7a263a;
  font-size: 1rem;
  font-weight: 500;
}
.form-row input {
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #ffd6e6;
  font-size: 1rem;
  outline: none;
  margin-top: 0.2rem;
}
.save-btn {
  display: block;
  width: 100%;
  margin: 2rem 0 0 0;
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.9rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: background 0.18s;
}
.save-btn:hover {
  background: #b71c4a;
}
</style> 