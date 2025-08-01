<template>
  <div class="contact-page-bg">
    <Navbar />
    <div class="contact-page">
      <h1>Contact Us</h1>
      <div class="contact-details">
        <p>Have a question, suggestion, or want to place a custom order? We'd love to hear from you!</p>
        <p>Email: <a href="mailto:frostandflour@gmail.com">frostandflour@gmail.com</a></p>
        <p>Phone: (051)-2552890</p>
        <p>Address: Street 39 H-8/3, Islamabad, Pakistan</p>
      </div>
      <form class="contact-form" @submit="handleSubmit">
        <h2>Send us a message</h2>
        <div class="form-row">
          <label for="name">Name</label>
          <input id="name" type="text" required v-model="name" />
        </div>
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" type="email" required v-model="email" />
        </div>
        <div class="form-row">
          <label for="message">Message</label>
          <textarea id="message" rows="4" required v-model="message"></textarea>
        </div>
        <button class="send-btn" type="submit">Send Message</button>
        <div v-if="status" class="contact-status">{{ status }}</div>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const status = ref('')

async function handleSubmit(e) {
  e.preventDefault()
  status.value = ''
  try {
    const res = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value, message: message.value })
    })
    if (res.ok) {
      status.value = 'Message sent successfully!'
      name.value = ''
      email.value = ''
      message.value = ''
    } else {
      status.value = 'Failed to send message.'
    }
  } catch (err) {
    status.value = 'Failed to send message.'
  }
}
</script>

<style scoped>
.contact-page-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}
.contact-page {
  max-width: 700px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 400px;
  text-align: center;
}
.contact-page h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.contact-details {
  color: #7a263a;
  font-size: 1.08rem;
  margin-bottom: 2.2rem;
}
.contact-details a {
  color: #d72660;
  text-decoration: underline;
}
.contact-form {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.contact-form h2 {
  color: #d72660;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1.2rem;
  width: 100%;
  max-width: 400px;
}
.form-row label {
  color: #7a263a;
  font-size: 1rem;
  font-weight: 500;
}
.form-row input, .form-row textarea {
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #ffd6e6;
  font-size: 1rem;
  outline: none;
  margin-top: 0.2rem;
  resize: none;
}
.send-btn {
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
.send-btn:hover {
  background: #b71c4a;
}
.contact-status {
  margin-top: 1rem;
  color: #d72660;
  font-weight: 600;
  text-align: center;
}
</style> 