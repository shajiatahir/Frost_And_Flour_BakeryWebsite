<template>
  <div class="customer-orders-page-bg">
    <Navbar />
    <div class="customer-orders-page">
      <h1>Track Your Orders</h1>
      <div class="track-order-section">
        <h2>View your order history</h2>
        <div class="email-display-section">
          <p class="email-display">Logged in as: <strong>{{ loggedInEmail }}</strong></p>
          <button @click="trackOrders" class="track-btn">Track Orders</button>
        </div>
      </div>
      
      <div v-if="orders.length > 0" class="orders-section">
        <h3>Your Orders</h3>
        <div class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <div class="order-date">{{ formatDate(order.date) }}</div>
              <div class="order-total">${{ Number(order.total).toFixed(2) }}</div>
            </div>
            <div class="order-details">
              <div class="order-info">
                <p><strong>Name:</strong> {{ order.name }}</p>
                <p><strong>Contact:</strong> {{ order.contact }}</p>
                <p><strong>Address:</strong> {{ order.address }}</p>
              </div>
              <div class="order-items">
                <h4>Items Ordered:</h4>
                <ul v-if="order.items && order.items.length > 0">
                  <li v-for="item in order.items" :key="item.name">
                    {{ item.name }} (x{{ item.quantity }})
                  </li>
                </ul>
                <p v-else class="no-items">No items found for this order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="searched" class="no-orders">
        <p>No orders found for your email address.</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const orders = ref([])
const searched = ref(false)

// Get logged-in user's email from localStorage
const loggedInEmail = computed(() => {
  const authUser = localStorage.getItem('authUser')
  if (authUser) {
    try {
      const userData = JSON.parse(authUser)
      return userData.email || ''
    } catch (e) {
      return ''
    }
  }
  return ''
})

// Check if user is authenticated
const isAuthenticated = computed(() => {
  const authUser = localStorage.getItem('authUser')
  return authUser && authUser !== 'null' && authUser !== 'undefined'
})

onMounted(() => {
  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  // Auto-track orders when component mounts
  if (loggedInEmail.value) {
    trackOrders()
  }
})

async function trackOrders() {
  if (!loggedInEmail.value) {
    alert('Please log in to view your orders')
    router.push('/login')
    return
  }
  
  try {
    console.log('Fetching orders for email:', loggedInEmail.value)
    const response = await fetch(`http://localhost:3001/api/orders/customer/${encodeURIComponent(loggedInEmail.value)}`)
    
    if (!response.ok) {
      console.error('Response not ok:', response.status, response.statusText)
      if (response.status === 404) {
        alert('No orders found for your email address.')
      } else {
        alert(`Error: ${response.status} ${response.statusText}`)
      }
      return
    }
    
    const data = await response.json()
    console.log('Orders received:', data)
    
    // Process orders to ensure items are properly parsed
    orders.value = data.map(order => {
      console.log('Processing order in frontend:', order.id, 'Items:', order.items, 'Type:', typeof order.items)
      
      // Ensure items is an array
      let items = []
      if (order.items) {
        try {
          // If items is a string, parse it
          if (typeof order.items === 'string') {
            if (order.items === '[object Object]' || order.items === '[]') {
              items = []
              console.log('Items was [object Object] or empty, setting to empty array')
            } else if (order.items.startsWith('[') || order.items.startsWith('{')) {
              items = JSON.parse(order.items)
            } else {
              console.log('Unknown items format:', order.items)
              items = []
            }
          } else if (Array.isArray(order.items)) {
            items = order.items
          } else {
            console.log('Items is not string or array, setting to empty array. Type:', typeof order.items)
            items = []
          }
        } catch (e) {
          console.error('Error parsing items for order:', order.id, e)
          items = []
        }
      }
      
      // Ensure items is an array
      if (!Array.isArray(items)) {
        items = []
        console.log('Items is not an array after processing, setting to empty array')
      }
      
      const processedOrder = {
        ...order,
        items: items
      }
      
      console.log('Processed order:', processedOrder.id, 'Items:', processedOrder.items)
      return processedOrder
    })
    
    console.log('Processed orders:', orders.value)
    searched.value = true
  } catch (error) {
    console.error('Error fetching orders:', error)
    alert('Error fetching orders. Please try again.')
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.customer-orders-page-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}

.customer-orders-page {
  max-width: 800px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 400px;
}

.customer-orders-page h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.track-order-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 2rem 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.track-order-section h2 {
  color: #d72660;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.email-display-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.email-display {
  color: #7a263a;
  font-size: 1rem;
  margin: 0;
  padding: 0.8rem 1rem;
  background: #fff0f6;
  border-radius: 8px;
  border: 1px solid #ffd6e6;
}

.email-display strong {
  color: #d72660;
}

.track-btn {
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.track-btn:hover {
  background: #b71c4a;
}

.orders-section h3 {
  color: #d72660;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 1.5rem;
  border: 1px solid #ffd6e6;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ffd6e6;
}

.order-date {
  color: #7a263a;
  font-weight: 600;
  font-size: 1rem;
}

.order-total {
  color: #d72660;
  font-weight: 700;
  font-size: 1.1rem;
}

.order-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.order-info p {
  margin-bottom: 0.5rem;
  color: #7a263a;
  font-size: 0.95rem;
}

.order-info strong {
  color: #d72660;
}

.order-items h4 {
  color: #d72660;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.order-items ul {
  list-style: none;
  padding: 0;
  background: #fff0f6;
  border-radius: 6px;
  padding: 0.5rem;
}

.order-items li {
  color: #7a263a;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
  padding: 0.3rem 0.5rem;
  background: #fff;
  border-radius: 4px;
  border-left: 3px solid #d72660;
}

.no-items {
  color: #b48a78;
  font-style: italic;
  font-size: 0.9rem;
  margin: 0;
}

.no-orders {
  text-align: center;
  color: #b48a78;
  font-size: 1.1rem;
  margin-top: 2rem;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
}

@media (max-width: 768px) {
  .order-details {
    grid-template-columns: 1fr;
  }
}
</style> 