<template>
  <div class="admin-user-management-bg">
    <Navbar />
    <div class="admin-user-management">
      <h1>User Management</h1>
      
      <!-- Users Table -->
      <div v-if="users.length === 0" class="empty-state">
        No users found.
      </div>
      
      <div v-else class="users-table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <select v-model="user.role" @change="updateUserRole(user.id, user.role)">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <button @click="deleteUser(user.id)" class="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { ref, onMounted } from 'vue'

const users = ref([])

onMounted(() => {
  loadUsers()
})

async function loadUsers() {
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    const response = await fetch('http://localhost:3001/api/admin/users', {
      headers: {
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      }
    })
    users.value = await response.json()
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

async function updateUserRole(userId, newRole) {
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    await fetch(`http://localhost:3001/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      },
      body: JSON.stringify({ role: newRole })
    })
    await loadUsers()
  } catch (error) {
    console.error('Error updating user role:', error)
  }
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    await fetch(`http://localhost:3001/api/admin/users/${userId}`, { 
      method: 'DELETE',
      headers: {
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      }
    })
    await loadUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
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
.admin-user-management-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}

.admin-user-management {
  max-width: 1000px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 600px;
}

.admin-user-management h1 {
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

.users-table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.users-table th, .users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ffd6e6;
  font-size: 0.9rem;
}

.users-table th {
  background: #fff0f6;
  color: #d72660;
  font-weight: 600;
}

.users-table select {
  border: 1px solid #ffd6e6;
  border-radius: 4px;
  padding: 0.3rem;
  font-size: 0.9rem;
  background: #fff;
  color: #d72660;
}

.delete-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .users-table-wrapper {
    overflow-x: auto;
  }
  
  .users-table {
    min-width: 600px;
  }
}
</style> 