import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isOpen = ref(false)

  function addToCart(product) {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
    isOpen.value = true
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId)
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item && quantity > 0) {
      item.quantity = quantity
    } else if (item && quantity === 0) {
      removeFromCart(productId)
    }
  }

  function clearCart() {
    items.value = []
  }

  function closeCart() {
    isOpen.value = false
  }

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  return {
    items,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    closeCart,
    total
  }
}) 