<template>
  <div class="orders-page-bg">
    <Navbar />
    <div class="orders-page">
      <h1>Your Orders</h1>
      <div v-if="orders.length === 0" class="orders-empty">No orders yet.</div>
      <div v-else class="orders-table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.date }}</td>
              <td>{{ order.name }}</td>
              <td>{{ order.email }}</td>
              <td v-if="editId !== order.id">{{ order.contact }}</td>
              <td v-else><input v-model="editOrder.contact" /></td>
              <td v-if="editId !== order.id">{{ order.address }}</td>
              <td v-else><input v-model="editOrder.address" /></td>
              <td>
                <ul>
                  <li v-for="item in order.items" :key="item.name">
                    {{ item.name }} (x{{ item.quantity }})
                  </li>
                </ul>
              </td>
              <td>${{ Number(order.total).toFixed(2) }}</td>
              <td>
                <button v-if="editId !== order.id" @click="startEdit(order)">Edit</button>
                <button v-if="editId === order.id" @click="saveEdit(order.id)">Save</button>
                <button v-if="editId === order.id" @click="cancelEdit">Cancel</button>
                <button @click="deleteOrder(order.id)">Delete</button>
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

const orders = ref([])
const editId = ref(null)
const editOrder = ref({})

async function loadOrders() {
  const res = await fetch('http://localhost:3001/api/orders')
  orders.value = await res.json()
}

onMounted(loadOrders)

async function deleteOrder(id) {
  await fetch(`http://localhost:3001/api/orders/${id}`, { method: 'DELETE' })
  await loadOrders()
}

function startEdit(order) {
  editId.value = order.id
  editOrder.value = { contact: order.contact, address: order.address }
}

function cancelEdit() {
  editId.value = null
  editOrder.value = {}
}

async function saveEdit(id) {
  const orig = orders.value.find(o => o.id === id)
  if (!orig || !editOrder.value.contact || !editOrder.value.address) {
    alert('Contact and address are required.');
    return;
  }
  const updated = {
    id: orig.id,
    name: orig.name,
    email: orig.email,
    contact: editOrder.value.contact,
    address: editOrder.value.address,
    items: Array.isArray(orig.items) ? orig.items.map(i => ({ ...i })) : [],
    total: Number(orig.total)
  }
  await fetch(`http://localhost:3001/api/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  })
  editId.value = null
  editOrder.value = {}
  await loadOrders()
}
</script>

<style scoped>
.orders-page-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}
.orders-page {
  max-width: 1100px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 400px;
}
.orders-page h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}
.orders-empty {
  text-align: center;
  color: #b48a78;
  font-size: 1.1rem;
  margin-top: 2rem;
}
.orders-table-wrapper {
  overflow-x: auto;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
}
.orders-table th, .orders-table td {
  padding: 1rem 0.7rem;
  text-align: left;
  border-bottom: 1.5px solid #ffd6e6;
  font-size: 1.05rem;
}
.orders-table th {
  color: #d72660;
  font-weight: 700;
  background: #fff0f6;
}
.orders-table td {
  color: #7a263a;
}
.orders-table tr:last-child td {
  border-bottom: none;
}
.orders-table button {
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.3rem 0.8rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.3rem;
  margin-bottom: 0.2rem;
  transition: background 0.18s;
}
.orders-table button:hover {
  background: #b71c4a;
}
.orders-table input {
  border: 1.5px solid #ffd6e6;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  font-size: 1rem;
  color: #d72660;
  background: #fff0f6;
}
</style> 