<template>
  <div class="admin-track-orders-bg">
    <Navbar />
    <div class="admin-track-orders">
      <h1>Track Orders</h1>
      
      <!-- Search Section -->
      <div class="search-section">
        <div class="search-box">
          <input 
            v-model="searchEmail" 
            type="email" 
            placeholder="Search by customer email..." 
            @input="searchOrders"
          />
          <button @click="searchOrders" class="search-btn">Search</button>
          <button @click="clearSearch" class="clear-btn">Clear</button>
        </div>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Total Orders:</span>
            <span class="stat-value">{{ filteredOrders.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Revenue:</span>
            <span class="stat-value">${{ totalRevenue.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <p v-if="searchEmail">No orders found for "{{ searchEmail }}"</p>
        <p v-else>No orders found.</p>
      </div>
      
      <div v-else class="orders-table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>{{ formatDate(order.date) }}</td>
              <td>{{ order.name }}</td>
              <td>{{ order.email }}</td>
              <td>{{ order.contact }}</td>
              <td>{{ order.address }}</td>
              <td>
                <div class="items-preview">
                  <span v-if="order.items && order.items.length > 0">
                    {{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}
                  </span>
                  <button @click="showOrderDetails(order)" class="view-details-btn">
                    View Details
                  </button>
                </div>
              </td>
              <td>${{ Number(order.total).toFixed(2) }}</td>
              <td>
                <button @click="editOrder(order)" class="edit-btn">Edit</button>
                <button @click="deleteOrder(order.id)" class="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Details Modal -->
      <div v-if="showDetailsModal" class="modal-overlay" @click="closeOrderDetails">
        <div class="modal" @click.stop>
          <h3>Order Details</h3>
          <div v-if="selectedOrder" class="order-details">
            <div class="detail-row">
              <strong>Order ID:</strong> {{ selectedOrder.id }}
            </div>
            <div class="detail-row">
              <strong>Customer:</strong> {{ selectedOrder.name }}
            </div>
            <div class="detail-row">
              <strong>Email:</strong> {{ selectedOrder.email }}
            </div>
            <div class="detail-row">
              <strong>Contact:</strong> {{ selectedOrder.contact }}
            </div>
            <div class="detail-row">
              <strong>Address:</strong> {{ selectedOrder.address }}
            </div>
            <div class="detail-row">
              <strong>Date:</strong> {{ formatDate(selectedOrder.date) }}
            </div>
            <div class="detail-row">
              <strong>Total:</strong> ${{ Number(selectedOrder.total).toFixed(2) }}
            </div>
            
            <div class="items-section">
              <h4>Order Items:</h4>
              <div v-if="selectedOrder.items && selectedOrder.items.length > 0" class="items-list">
                <div v-for="item in selectedOrder.items" :key="item.name" class="item-row">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-quantity">x{{ item.quantity }}</span>
                </div>
              </div>
              <div v-else class="no-items">
                No items found for this order.
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="closeOrderDetails" class="close-btn">Close</button>
          </div>
        </div>
      </div>

      <!-- Edit Order Modal -->
      <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
        <div class="modal" @click.stop>
          <h3>Edit Order</h3>
          <form @submit.prevent="saveOrderEdit">
            <div class="form-row">
              <label>Contact:</label>
              <input v-model="editOrderData.contact" required />
            </div>
            <div class="form-row">
              <label>Address:</label>
              <input v-model="editOrderData.address" required />
            </div>
            <div class="modal-actions">
              <button type="submit" class="save-btn">Save</button>
              <button type="button" @click="closeEditModal" class="cancel-btn">Cancel</button>
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
import { ref, onMounted, computed } from 'vue'

const orders = ref([])
const searchEmail = ref('')
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const selectedOrder = ref(null)
const editOrderData = ref({})
const editingOrderId = ref(null)

const filteredOrders = computed(() => {
  if (!searchEmail.value) return orders.value
  return orders.value.filter(order => 
    order.email.toLowerCase().includes(searchEmail.value.toLowerCase())
  )
})

const totalRevenue = computed(() => {
  return filteredOrders.value.reduce((sum, order) => sum + Number(order.total), 0)
})

onMounted(() => {
  loadOrders()
})

async function loadOrders() {
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    const response = await fetch('http://localhost:3001/api/orders', {
      headers: {
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      }
    })
    const data = await response.json()
    
    // Process orders to ensure items are properly parsed
    orders.value = data.map(order => {
      let items = []
      if (order.items) {
        try {
          if (typeof order.items === 'string') {
            items = JSON.parse(order.items)
          } else if (Array.isArray(order.items)) {
            items = order.items
          }
        } catch (e) {
          console.error('Error parsing items for order:', order.id, e)
          items = []
        }
      }
      return { ...order, items: Array.isArray(items) ? items : [] }
    })
  } catch (error) {
    console.error('Error loading orders:', error)
  }
}

function searchOrders() {
  // Search is handled by computed property
  console.log('Searching for:', searchEmail.value)
}

function clearSearch() {
  searchEmail.value = ''
}

function showOrderDetails(order) {
  selectedOrder.value = order
  showDetailsModal.value = true
}

function closeOrderDetails() {
  showDetailsModal.value = false
  selectedOrder.value = null
}

function editOrder(order) {
  editingOrderId.value = order.id
  editOrderData.value = {
    contact: order.contact,
    address: order.address
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editOrderData.value = {}
  editingOrderId.value = null
}

async function saveOrderEdit() {
  try {
    const order = orders.value.find(o => o.id === editingOrderId.value)
    if (!order) return

    const updated = {
      id: order.id,
      name: order.name,
      email: order.email,
      contact: editOrderData.value.contact,
      address: editOrderData.value.address,
      items: order.items,
      total: Number(order.total)
    }

    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    await fetch(`http://localhost:3001/api/orders/${editingOrderId.value}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      },
      body: JSON.stringify(updated)
    })

    closeEditModal()
    await loadOrders()
  } catch (error) {
    console.error('Error updating order:', error)
  }
}

async function deleteOrder(id) {
  if (!confirm('Are you sure you want to delete this order?')) return
  
  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    await fetch(`http://localhost:3001/api/orders/${id}`, { 
      method: 'DELETE',
      headers: {
        'x-user-email': authUser.email,
        'x-user-role': authUser.role
      }
    })
    await loadOrders()
  } catch (error) {
    console.error('Error deleting order:', error)
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
.admin-track-orders-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}

.admin-track-orders {
  max-width: 1200px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 600px;
}

.admin-track-orders h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.search-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-box input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ffd6e6;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

.search-btn, .clear-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn {
  background: #d72660;
  color: #fff;
}

.search-btn:hover {
  background: #b71c4a;
}

.clear-btn {
  background: #b48a78;
  color: #fff;
}

.clear-btn:hover {
  background: #7a263a;
}

.stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #7a263a;
  margin-bottom: 0.3rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d72660;
}

.empty-state {
  text-align: center;
  color: #b48a78;
  font-size: 1.1rem;
  padding: 3rem;
}

.orders-table-wrapper {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.orders-table th, .orders-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ffd6e6;
  font-size: 0.9rem;
}

.orders-table th {
  background: #fff0f6;
  color: #d72660;
  font-weight: 600;
}

.items-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.view-details-btn {
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.view-details-btn:hover {
  background: #218838;
}

.edit-btn, .save-btn {
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.3rem;
  transition: background 0.2s;
}

.edit-btn:hover, .save-btn:hover {
  background: #b71c4a;
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
  max-width: 600px;
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

.order-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ffd6e6;
}

.detail-row:last-child {
  border-bottom: none;
}

.items-section {
  margin-top: 1.5rem;
}

.items-section h4 {
  color: #d72660;
  margin-bottom: 1rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #fff0f6;
  border-radius: 4px;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  color: #7a263a;
  font-weight: 600;
}

.no-items {
  color: #b48a78;
  font-style: italic;
  text-align: center;
  padding: 1rem;
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

.form-row input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ffd6e6;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
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

.cancel-btn, .close-btn {
  background: #b48a78;
  color: #fff;
}

.cancel-btn:hover, .close-btn:hover {
  background: #7a263a;
}

@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
  }
  
  .stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
}
</style> 