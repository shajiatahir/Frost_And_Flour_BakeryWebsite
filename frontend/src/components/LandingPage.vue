<template>
  <div class="landing-page">
    <Navbar />
    <CartDrawer />
    <div class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-img-col">
          <img src="/home_page.jpg" alt="Bakery Cake" class="hero-img" />
        </div>
        <div class="hero-content-col">
          <h1 class="hero-title">Deliver You A Blissful<br />Dessert in Every Bite</h1>
          <p class="hero-desc">
            Indulge in handcrafted desserts made with love, fresh ingredients, and a sprinkle of joy. From classic cupcakes to signature creations, every bite is a celebration of flavor. Whether you're craving a treat or planning a special event, we're here to make your day a little sweeter!
          </p>
          <router-link to="/menu" class="about-btn">Explore Menu</router-link>
        </div>
      </section>
      <!-- Menu Preview Section -->
      <section class="menu-preview-section">
        <div class="menu-header-row">
          <div class="menu-header-title">
            <h2>Try Our Best Selling</h2>
            <div class="menu-header-underline"></div>
          </div>
          <div class="menu-header-divider"></div>
          <div class="menu-header-desc">
            <p>Here's our best creations that everyone loves. Lightness and sweetness of the cake make you want more and more. Start from cake, sundaes and other creations.</p>
          </div>
        </div>
        <div class="menu-cards-row">
          <div v-for="item in bestSelling" :key="item.id" class="menu-card">
            <img :src="item.img" :alt="item.name" class="menu-card-img" />
            <div class="menu-card-title">{{ item.name }}</div>
            <div class="menu-card-rating">
              <span v-for="n in 5" :key="n" :class="['star', { inactive: n > Math.round(item.rating) }]">★</span>
              <span class="rating-text">{{ item.rating.toFixed(1) }} Rating</span>
            </div>
          </div>
        </div>
        <div class="menu-view-more-row">
          <router-link to="/menu" class="menu-view-more-btn">View More <span class="arrow">→</span></router-link>
        </div>
      </section>
      <!-- About Us Section -->
      <section class="about-preview-section">
        <img src="/about_preview.jpg" alt="About Us" class="about-bg-img" />
        <div class="about-content">
          <h2 class="about-title">About us</h2>
          <p class="about-desc">We're all about good vibes and great bakes! Everything we make is crafted to spark joy and satisfy your sweet tooth!</p>
          <router-link to="/about" class="about-read-btn">Read More</router-link>
        </div>
      </section>
      
      <!-- Remove the custom contact-footer-section here -->
      
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import CartDrawer from './CartDrawer.vue'

const bestSelling = [
  {
    id: 1,
    name: 'Raspberry Sundae',
    img: '/raspberry_sundae.jpg',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Churros',
    img: '/churros.jpg',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Blueberry Pie',
    img: '/blueberry_pie.jpg',
    rating: 4.2,
  },
  {
    id: 4,
     name: 'Macarons',
    img: '/macarons.jpg',
    rating: 4.0,
  },
  {
    id: 5,
    name: 'Molten Lava Cake',
    img: '/molten_lava.jpg',
    rating: 4.3,
  },
  {
    id: 6,
    name: 'Fruit Waffle',
    img: '/Fruit_waffle.jpg',
    rating: 4.1,
  },
  {
    id: 7,
    name: 'Sprinkled Doughnuts',
    img: '/sprinkled_doughnuts.jpg',
    rating: 4.3,
  },
]
</script>

<style scoped>
/* Add or update styles for a more modern, pink, bakery-themed look */
.landing-page {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  max-width: 1100px;
  margin: 2.5rem auto;
  padding: 2.5rem 2rem;
  background: #ffe6f0;
  border-radius: 0;
  box-sizing: border-box;
}
.hero-img-col {
  flex: 1 1 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
}
.hero-img {
  width: 350px;
  max-width: 100%;
  border-radius: 24px;
  object-fit: cover;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  display: block;
}
.hero-content-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 420px;
  min-width: 0;
  padding: 0 1rem;
}
.hero-title {
  color: #d34a5a;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  line-height: 1.2;
}
.hero-desc {
  color: #444;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}
.about-btn {
  background: #d72660;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-block;
}
.about-btn:hover {
  background: #b71c4a;
}
.menu-preview-section {
  margin: 3.5rem auto 80px auto;
  max-width: 1200px;
  background: none;
  padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  border-radius: 24px;
  box-sizing: border-box;
  min-height: 340px;
}
.menu-header-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 3.5rem;
  margin-bottom: 2.2rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
}
.menu-header-title {
  min-width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.menu-header-title h2 {
  color: #7a263a;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.01em;
}
.menu-header-underline {
  width: 60px;
  height: 3px;
  background: #d72660;
  border-radius: 2px;
  margin-top: 0.2rem;
}
.menu-header-divider {
  width: 2px;
  min-height: 70px;
  background: #e9d6d6;
  margin: 0 2.2rem;
  border-radius: 2px;
  align-self: stretch;
}
.menu-header-desc p {
  color: #7a263a;
  font-size: 1.05rem;
  margin: 0;
  max-width: 420px;
  line-height: 1.5;
  text-align: left;
  padding-left: 7rem;
}
.menu-cards-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
}
.menu-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 0 0 3px #fff, 0 2px 16px 0 #ffd6e6, 0 0 16px 2px #ffb6d5;
  border: 2.5px solid #ffb6d5;
  min-width: 200px;
  max-width: 220px;
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.1rem 1rem 1rem 1rem;
  transition: box-shadow 0.2s, box-shadow 0.22s, transform 0.22s, border 0.22s;
}
.menu-card:hover {
  box-shadow: 0 0 0 4px #fff, 0 6px 32px 0 #ffb6d5, 0 0 32px 4px #d72660;
  border: 2.5px solid #d72660;
  transform: translateY(-8px) scale(1.04);
  z-index: 2;
}
.menu-card-img {
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 16px 0 #ffd6e6;
}
.menu-card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #7a263a;
  margin-bottom: 0.4rem;
}
.menu-card-rating {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 1rem;
  color: #d72660;
  font-weight: 500;
}
.menu-card-rating .star {
  color: #ffc107;
  font-size: 1.1rem;
}
.menu-card-rating .star.inactive {
  color: #e0e0e0;
}
.menu-card-rating .rating-text {
  color: #b48a78;
  font-size: 0.95rem;
  margin-left: 0.5rem;
  font-weight: 400;
}
.menu-view-more-row {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}
.menu-view-more-btn {
  background: #fff;
  color: #d72660;
  border: 1.5px solid #d72660;
  border-radius: 24px;
  padding: 0.6rem 2.2rem;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.menu-view-more-btn:hover {
  background: #d72660;
  color: #fff;
}
.menu-view-more-btn .arrow {
  font-size: 1.2rem;
  margin-left: 0.2rem;
}
.about-preview-section {
  width: 100vw;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
}
.about-bg-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  min-height: 260px;
  object-fit: cover;
  object-position: center;
  display: block;
  z-index: 1;
  pointer-events: none;
  user-select: none;
}
.about-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.about-title {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  margin-bottom: 0.7rem;
  font-style: italic;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.about-desc {
  font-size: 1.08rem;
  font-weight: 400;
  margin-bottom: 1.3rem;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,0.13);
}
.about-read-btn {
  background: #a85c43;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 2.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  text-decoration: none;
  display: inline-block;
}
.about-read-btn:hover {
  background: #7a3c24;
}
.contact-footer-section {
  width: 100vw;
  min-height: 320px;
  position: relative;
  overflow: hidden;
  margin: 120px 0 0 0;
  padding: 0;
  box-sizing: border-box;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.contact-bg-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  opacity: 1;
}
.contact-footer-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem 1.2rem 2rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-end;
}
.footer-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
  margin-bottom: 1.2rem;
  width: 100%;
}
.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.footer-logo-img {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: contain;
  background: #fff;
  padding: 4px;
}
.footer-logo-text {
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.01em;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
}
.footer-social-row.footer-social-right {
  margin-left: auto;
  gap: 1.1rem;
  display: flex;
  align-items: center;
}
.footer-social-icon svg {
  vertical-align: middle;
  stroke: #d72660;
  fill: none;
  transition: stroke 0.18s;
}
.footer-social-icon:hover svg {
  stroke: #fff;
}
.footer-divider {
  width: 100%;
  height: 1.5px;
  background: rgba(255,255,255,0.18);
  margin: 1.2rem 0 1.2rem 0;
  border-radius: 2px;
}
.footer-bottom-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4.5rem;
  margin-bottom: 1.2rem;
  width: 100%;
}
.footer-col {
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 1.05rem;
  color: #fff;
}
.footer-col-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #ffd6e6;
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
}
.footer-copyright {
  text-align: center;
  color: #fff;
  font-size: 0.98rem;
  margin-top: 1.2rem;
  opacity: 0.85;
}
</style> 