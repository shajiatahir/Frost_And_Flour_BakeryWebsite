<template>
  <div class="admin-dashboard-bg">
    <Navbar />
    <div class="admin-dashboard">
      <h1>Admin Panel</h1>
      
      <!-- Admin Navigation Cards -->
      <div class="admin-cards">
        <router-link to="/admin/track-orders" class="admin-card">
          <div class="card-icon">📦</div>
          <h3>Track Orders</h3>
          <p>View and manage all customer orders with search functionality</p>
        </router-link>
        
        <router-link to="/admin/messages" class="admin-card">
          <div class="card-icon">💬</div>
          <h3>Messages</h3>
          <p>View customer messages and send replies</p>
        </router-link>
        
        <router-link to="/admin/users" class="admin-card">
          <div class="card-icon">👥</div>
          <h3>User Management</h3>
          <p>Manage users, change roles, and delete accounts</p>
        </router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
</script>

<style scoped>
.admin-dashboard-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}

.admin-dashboard {
  max-width: 1200px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 600px;
}

.admin-dashboard h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
}

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.admin-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px #ffd6e6;
  border-color: #d72660;
}

.card-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
}

.admin-card h3 {
  color: #d72660;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.admin-card p {
  color: #7a263a;
  text-align: center;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .admin-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .admin-card {
    padding: 1.5rem;
  }
}
</style> 