<template>
  <div v-if="isOpen" class="cart-drawer">
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button class="close-btn" @click="closeCart">×</button>
    </div>
    <div v-if="items.length === 0" class="cart-empty">Your cart is empty.</div>
    <div v-else class="cart-items">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <img :src="item.img" :alt="item.name" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">{{ item.name }}</div>
          <div class="cart-item-qty">
            <button @click="updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity === 1">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <div class="cart-item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
        </div>
        <button class="remove-btn" @click="removeFromCart(item.id)">Remove</button>
      </div>
    </div>
    <div v-if="items.length" class="cart-footer-sticky">
      <div class="cart-total">Total: ${{ total.toFixed(2) }}</div>
      <div class="cart-actions">
        <router-link to="/cart" class="view-cart-btn">View Cart</router-link>
        <router-link to="/checkout" class="checkout-btn">Proceed to Checkout</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../composables/cartStore'
import { storeToRefs } from 'pinia'

const cart = useCartStore()
const { items, isOpen, total } = storeToRefs(cart)
const { closeCart, removeFromCart, updateQuantity } = cart
</script>

<style scoped>
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 370px;
  height: 100vh;
  background: #fff0f6;
  box-shadow: -2px 0 16px #ffd6e6;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 0;
  animation: slideIn 0.3s;
}
@keyframes slideIn {
  from { right: -400px; }
  to { right: 0; }
}
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem 1rem 1.5rem;
  border-bottom: 2px solid #ffd6e6;
  background: #fff;
}
.cart-header h2 {
  font-size: 1.3rem;
  color: #d72660;
  font-weight: 700;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #d72660;
  cursor: pointer;
  font-weight: 700;
  line-height: 1;
}
.cart-empty {
  padding: 2rem;
  text-align: center;
  color: #b48a78;
  font-size: 1.1rem;
}
.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem 1.5rem;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ffd6e6;
  padding: 0.7rem 1rem;
}
.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 1rem;
  box-shadow: 0 1px 6px #ffd6e6;
}
.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.cart-item-name {
  font-size: 1.05rem;
  color: #d72660;
  font-weight: 600;
}
.cart-item-qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.2rem 0;
}
.cart-item-qty button {
  background: #ffd6e6;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1.1rem;
  color: #d72660;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.18s;
}
.cart-item-qty button:disabled {
  background: #f3e0e9;
  color: #b48a78;
  cursor: not-allowed;
}
.cart-item-price {
  color: #b48a78;
  font-size: 0.98rem;
  font-weight: 500;
}
.remove-btn {
  background: none;
  border: none;
  color: #b48a78;
  font-size: 0.95rem;
  cursor: pointer;
  margin-left: 1rem;
  font-weight: 600;
  transition: color 0.18s;
}
.remove-btn:hover {
  color: #d72660;
}
.cart-footer {
  padding: 1.2rem 1.5rem 1.5rem 1.5rem;
  border-top: 2px solid #ffd6e6;
  background: #fff;
}
.cart-total {
  font-size: 1.15rem;
  color: #d72660;
  font-weight: 700;
  margin-bottom: 1rem;
}
.cart-actions {
  display: flex;
  gap: 1rem;
}
.view-cart-btn, .checkout-btn {
  flex: 1;
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.7rem 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
}
.view-cart-btn:hover, .checkout-btn:hover {
  background: #b71c4a;
}
.cart-footer-sticky {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  border-top: 2px solid #ffd6e6;
  padding: 1.2rem 1.5rem 1.5rem 1.5rem;
  z-index: 10;
}
</style> 