<template>
  <div class="menu-page">
    <Navbar />
    <div class="menu-main-content">
      <section class="menu-hero">
        <h1 class="menu-title">Our Delicious Menu</h1>
        <p class="menu-desc">Choose a category and explore our sweet, handcrafted bakery delights!</p>
      </section>
      <div class="menu-categories">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['category-btn', { active: state.value === cat.id }]"
          @click="selectCategory(cat.id)"
        >
          {{ cat.label }}
        </button>
      </div>
      <div class="menu-items-grid">
        <div v-if="filteredMenuItems.length === 0" class="no-items-message">
          No items found for this category.
        </div>
        <div v-for="item in filteredMenuItems" :key="item.id" class="menu-item-card">
          <div class="menu-item-price">${{ item.price.toFixed(2) }}</div>
          <img :src="item.img" :alt="item.name" class="menu-item-img" />
          <div class="menu-item-info">
            <div class="menu-item-name">{{ item.name }}</div>
            <div class="menu-item-rating">
              <span v-for="n in 5" :key="n" :class="['star', { inactive: n > Math.round(item.rating) }]">★</span>
              <span class="rating-text">{{ item.rating.toFixed(1) }}</span>
            </div>
            <div class="menu-item-desc">{{ item.desc }}</div>
            <button class="add-to-cart-btn" @click="addToCart(item)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
    <CartDrawer />
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMachine } from '@xstate/vue'
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import CartDrawer from './CartDrawer.vue'
import { useCartStore } from '../composables/cartStore'
import { createMachine } from 'xstate'

const cart = useCartStore()
const addToCart = cart.addToCart

const categories = [
  { id: 'cakes', label: 'Cakes' },
  { id: 'cupcakes', label: 'Cupcakes' },
  { id: 'pastries', label: 'Pastries' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'breads', label: 'Breads' },
  { id: 'specials', label: 'Specials' },
]

const menuItems = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:3001/api/menu')
  const data = await res.json()
  menuItems.value = data.map(item => ({
    ...item,
    price: Number(item.price),
    rating: Number(item.rating)
  }))
  console.log('Loaded menu items:', menuItems.value)
})

// Build states object for each category
const states = {}
for (const cat of categories) {
  states[cat.id] = {
    on: Object.fromEntries(
      categories.map(c2 => [
        'SELECT_CATEGORY_' + c2.id.toUpperCase(),
        c2.id
      ])
    )
  }
}

const categoryMachine = createMachine({
  id: 'menuCategory',
  initial: 'cakes',
  states
})

const { state, send } = useMachine(categoryMachine)

function selectCategory(catId) {
  send({ type: 'SELECT_CATEGORY_' + catId.toUpperCase() })
}

const filteredMenuItems = computed(() => {
  const filtered = menuItems.value.filter(item => item.category === state.value.value)
  console.log('Filtered items for', state.value.value, filtered)
  return filtered
})
</script>

<style scoped>
.menu-page {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}
.menu-main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  box-sizing: border-box;
}
.menu-hero {
  text-align: center;
  margin-bottom: 2.5rem;
}
.menu-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #d72660;
  margin-bottom: 0.7rem;
}
.menu-desc {
  color: #b48a78;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}
.menu-categories {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2.2rem;
  flex-wrap: wrap;
}
.category-btn {
  background: #fff0f6;
  color: #d72660;
  border: 2px solid #ffd6e6;
  border-radius: 20px;
  padding: 0.7rem 2.2rem;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  outline: none;
}
.category-btn.active, .category-btn:hover {
  background: #d72660;
  color: #fff;
  border: 2px solid #d72660;
}
.menu-items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.2rem;
  justify-content: center;
  margin-top: 1.5rem;
}
.menu-item-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 0 0 3px #fff, 0 2px 16px 0 #ffd6e6, 0 0 16px 2px #ffb6d5;
  border: 2.5px solid #ffb6d5;
  min-width: 240px;
  max-width: 240px;
  flex: 0 0 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.1rem 1rem 1rem 1rem;
  transition: box-shadow 0.2s, box-shadow 0.22s, transform 0.22s, border 0.22s;
}
.menu-item-card:hover {
  box-shadow: 0 0 0 4px #fff, 0 6px 32px 0 #ffb6d5, 0 0 32px 4px #d72660;
  border: 2.5px solid #d72660;
  transform: translateY(-8px) scale(1.04);
  z-index: 2;
}
.menu-item-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 16px 0 #ffd6e6;
}
.menu-item-price {
  font-size: 1.08rem;
  font-weight: 700;
  color: #d72660;
  margin-bottom: 0.3rem;
  text-align: center;
  letter-spacing: 0.01em;
}
.menu-item-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.menu-item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #d72660;
  text-align: center;
}
.menu-item-rating {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 1rem;
  color: #ffc107;
  font-weight: 500;
  justify-content: center;
}
.menu-item-rating .star.inactive {
  color: #e0e0e0;
}
.rating-text {
  color: #b48a78;
  font-size: 0.95rem;
  margin-left: 0.5rem;
  font-weight: 400;
}
.menu-item-desc {
  font-size: 0.98rem;
  color: #7a263a;
  margin-top: 0.2rem;
  text-align: center;
}
.add-to-cart-btn {
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.7rem;
  transition: background 0.2s;
}
.add-to-cart-btn:hover {
  background: #b71c4a;
}
.no-items-message {
  text-align: center;
  color: #b48a78;
  font-size: 1.1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #fff0f6;
  border-radius: 15px;
  border: 2px solid #ffd6e6;
}
</style>