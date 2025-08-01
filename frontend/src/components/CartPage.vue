<template>
  <div class="cart-page-bg">
    <Navbar />
    <div class="cart-page">
      <h1>Your Cart</h1>
      <div v-if="items.length === 0" class="cart-empty">Your cart is empty.</div>
      <div v-else class="cart-items-list">
        <div v-for="item in items" :key="item.id" class="cart-item-row">
          <img :src="item.img" :alt="item.name" class="cart-item-img" />
          <div class="cart-item-details">
            <div class="cart-item-name">{{ item.name }}</div>
            <div class="cart-item-qty">Qty: {{ item.quantity }}</div>
            <div class="cart-item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
        <div class="cart-total-row">
          <span>Total:</span>
          <span class="cart-total-price">${{ total.toFixed(2) }}</span>
        </div>
        <div class="cart-actions-row">
          <router-link to="/menu" class="back-to-menu-btn">Back to Menu</router-link>
          <router-link to="/checkout" class="checkout-btn">Proceed to Checkout</router-link>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { useCartStore } from '../composables/cartStore'
import { storeToRefs } from 'pinia'

const cart = useCartStore()
const { items, total } = storeToRefs(cart)
</script>

<style scoped>
.cart-page-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}
.cart-page {
  max-width: 600px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 400px;
}
.cart-page h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}
.cart-empty {
  text-align: center;
  color: #b48a78;
  font-size: 1.1rem;
  margin-top: 2rem;
}
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.cart-item-row {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 1rem;
  gap: 1.2rem;
}
.cart-item-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 1px 6px #ffd6e6;
}
.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.cart-item-name {
  font-size: 1.1rem;
  color: #d72660;
  font-weight: 600;
}
.cart-item-qty {
  color: #b48a78;
  font-size: 1rem;
}
.cart-item-price {
  color: #7a263a;
  font-size: 1.05rem;
  font-weight: 500;
}
.cart-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  color: #d72660;
  font-weight: 700;
  margin-top: 2.5rem;
  border-top: 2px solid #ffd6e6;
  padding-top: 1.2rem;
}
.cart-total-price {
  font-size: 1.3rem;
}
.cart-actions-row {
  display: flex;
  gap: 1.2rem;
  margin-top: 2.2rem;
  justify-content: center;
}
.checkout-btn, .back-to-menu-btn {
  flex: 1;
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
  max-width: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.back-to-menu-btn {
  background: #fff;
  color: #d72660;
  border: 2px solid #d72660;
}
.back-to-menu-btn:hover {
  background: #d72660;
  color: #fff;
}
.checkout-btn:hover {
  background: #b71c4a;
}
</style> 