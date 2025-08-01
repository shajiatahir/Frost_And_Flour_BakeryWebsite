<template>
  <div class="checkout-page-bg">
    <Navbar />
    <div class="checkout-page">
      <h1>Checkout</h1>
      <div class="order-preview">
        <h2>Order Preview</h2>
        <div v-if="items.length === 0" class="order-empty">Your cart is empty.</div>
        <div v-else class="order-items-list">
          <div v-for="item in items" :key="item.id" class="order-item-row">
            <img :src="item.img" :alt="item.name" class="order-item-img" />
            <div class="order-item-details">
              <div class="order-item-name">{{ item.name }}</div>
              <div class="order-item-qty">Qty: {{ item.quantity }}</div>
              <div class="order-item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>
          <div class="order-total-row">
            <span>Total:</span>
            <span class="order-total-price">${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <form class="checkout-form" @submit="handleSubmit">
        <h2>Shipping Details</h2>
        <div class="form-row">
          <label for="name">Name</label>
          <input id="name" type="text" required v-model="name" />
        </div>
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" type="email" required v-model="email" />
        </div>
        <div class="form-row">
          <label for="contact">Contact Number</label>
          <input id="contact" type="text" required v-model="contact" />
        </div>
        <div class="form-row">
          <label for="address">Address</label>
          <input id="address" type="text" required v-model="address" />
        </div>
        <button class="place-order-btn" type="submit">Place Order</button>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { useCartStore } from '../composables/cartStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const { items, total } = storeToRefs(cart)
const router = useRouter()

const name = ref('')
const email = ref('')
const contact = ref('')
const address = ref('')

function handleSubmit(e) {
  e.preventDefault()
  if (!items.value.length) return
  const order = {
    name: name.value,
    email: email.value,
    contact: contact.value,
    address: address.value,
    items: items.value.map(item => ({ name: item.name, quantity: item.quantity })),
    total: total.value
  }
  fetch('http://localhost:3001/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(() => {
      cart.clearCart()
      router.push('/orders')
    })
}
</script>

<style scoped>
.checkout-page-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}
.checkout-page {
  max-width: 700px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 500px;
}
.checkout-page h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}
.order-preview {
  margin-bottom: 2.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 1.5rem 1.2rem;
}
.order-preview h2 {
  color: #d72660;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
.order-empty {
  text-align: center;
  color: #b48a78;
  font-size: 1.1rem;
  margin-top: 1rem;
}
.order-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.order-item-row {
  display: flex;
  align-items: center;
  background: #fff0f6;
  border-radius: 10px;
  box-shadow: 0 1px 6px #ffd6e6;
  padding: 0.7rem 1rem;
  gap: 1.2rem;
}
.order-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 1px 6px #ffd6e6;
}
.order-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.order-item-name {
  font-size: 1.05rem;
  color: #d72660;
  font-weight: 600;
}
.order-item-qty {
  color: #b48a78;
  font-size: 1rem;
}
.order-item-price {
  color: #7a263a;
  font-size: 1.05rem;
  font-weight: 500;
}
.order-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.15rem;
  color: #d72660;
  font-weight: 700;
  margin-top: 1.5rem;
  border-top: 2px solid #ffd6e6;
  padding-top: 1rem;
}
.order-total-price {
  font-size: 1.2rem;
}
.checkout-form {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  margin-top: 2rem;
}
.checkout-form h2 {
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
.place-order-btn {
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
.place-order-btn:hover {
  background: #b71c4a;
}
</style> 