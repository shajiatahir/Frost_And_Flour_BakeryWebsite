<template>
  <div class="admin-messages-bg">
    <Navbar />
    <div class="admin-messages">
      <h1>Messages</h1>
      
      <!-- Messages List -->
      <div v-if="messages.length === 0" class="empty-state">
        No messages found.
      </div>
      
      <div v-else class="messages-list">
        <div v-for="message in messages" :key="message.id" class="message-card">
          <div class="message-header">
            <div class="message-info">
              <h3>{{ message.name }}</h3>
              <p class="message-email">{{ message.email }}</p>
              <p class="message-date">{{ formatDate(message.date) }}</p>
            </div>
            <div class="message-actions">
              <button @click="replyToMessage(message)" class="reply-btn">Reply</button>
              <button @click="deleteMessage(message.id)" class="delete-btn">Delete</button>
            </div>
          </div>
          <div class="message-content">
            <p>{{ message.message }}</p>
          </div>
        </div>
      </div>

      <!-- Reply Modal -->
      <div v-if="showReplyModal" class="modal-overlay" @click="closeReplyModal">
        <div class="modal" @click.stop>
          <h3>Reply to {{ selectedMessage?.name }}</h3>
          <form @submit.prevent="sendReply">
            <div class="form-row">
              <label>To:</label>
              <input v-model="replyData.to" readonly />
            </div>
            <div class="form-row">
              <label>Subject:</label>
              <input v-model="replyData.subject" required />
            </div>
            <div class="form-row">
              <label>Message:</label>
              <textarea v-model="replyData.message" rows="6" required></textarea>
            </div>
            <div class="modal-actions">
              <button type="submit" class="send-btn">Send Reply</button>
              <button type="button" @click="closeReplyModal" class="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { ref, onMounted } from 'vue'

const messages = ref([])
const showReplyModal = ref(false)
const selectedMessage = ref(null)
const replyData = ref({ to: '', subject: '', message: '' })

onMounted(() => {
  loadMessages()
})

async function loadMessages() {
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    const response = await fetch('http://localhost:3001/api/contact', {
      headers: {
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      }
    })
    messages.value = await response.json()
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

async function deleteMessage(id) {
  if (!confirm('Are you sure you want to delete this message?')) return
  
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    await fetch(`http://localhost:3001/api/contact/${id}`, { 
      method: 'DELETE',
      headers: {
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      }
    })
    await loadMessages()
  } catch (error) {
    console.error('Error deleting message:', error)
  }
}

function replyToMessage(message) {
  selectedMessage.value = message
  replyData.value = {
    to: message.email,
    subject: `Re: Your message to Frost and Flour`,
    message: ''
  }
  showReplyModal.value = true
}

function closeReplyModal() {
  showReplyModal.value = false
  replyData.value = { to: '', subject: '', message: '' }
  selectedMessage.value = null
}

async function sendReply() {
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    await fetch('http://localhost:3001/api/admin/send-email', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      },
      body: JSON.stringify(replyData.value)
    })
    
    closeReplyModal()
    alert('Reply sent successfully! (Check console for email details)')
  } catch (error) {
    console.error('Error sending reply:', error)
    alert('Error sending reply.')
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.admin-messages-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}

.admin-messages {
  max-width: 800px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 600px;
}

.admin-messages h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.empty-state {
  text-align: center;
  color: #b48a78;
  font-size: 1.1rem;
  padding: 3rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 1.5rem;
  border: 1px solid #ffd6e6;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.message-info h3 {
  color: #d72660;
  font-size: 1.2rem;
  margin: 0 0 0.3rem 0;
}

.message-email {
  color: #7a263a;
  font-size: 1rem;
  margin: 0 0 0.2rem 0;
}

.message-date {
  color: #b48a78;
  font-size: 0.9rem;
  margin: 0;
}

.message-actions {
  display: flex;
  gap: 0.5rem;
}

.message-content p {
  color: #7a263a;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

.reply-btn {
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.reply-btn:hover {
  background: #b71c4a;
}

.delete-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #c82333;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h3 {
  color: #d72660;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-row {
  margin-bottom: 1rem;
}

.form-row label {
  display: block;
  color: #7a263a;
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.form-row input, .form-row textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ffd6e6;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
}

.form-row textarea {
  min-height: 120px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn {
  background: #d72660;
  color: #fff;
}

.send-btn:hover {
  background: #b71c4a;
}

.cancel-btn {
  background: #b48a78;
  color: #fff;
}

.cancel-btn:hover {
  background: #7a263a;
}

@media (max-width: 768px) {
  .message-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
}
</style> 