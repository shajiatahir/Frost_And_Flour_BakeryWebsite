<template>
  <div class="about-page-bg">
    <Navbar />
    <div class="about-page">
      <h1>About Frost & Flour</h1>
      <div class="about-content">
        <img src="/about_preview.jpg" alt="About Frost and Flour" class="about-img" />
        <p>
          Welcome to <b>Frost & Flour</b>! We are passionate about creating sweet moments and delicious memories. Our bakery specializes in handcrafted cakes, cupcakes, cookies, pastries, breads, and special desserts, all made with the finest ingredients and a sprinkle of love.
        </p>
        <p>
          Whether you're celebrating a birthday, wedding, or just want to treat yourself, our creations are designed to bring joy to every occasion. We believe in quality, creativity, and a personal touch in everything we bake.
        </p>
        <p>
          Thank you for choosing Frost & Flour. We look forward to making your day a little sweeter!
        </p>
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
.about-page-bg {
  background: #ffe6f0;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: #d72660;
  overflow-x: hidden;
}
.about-page {
  max-width: 700px;
  margin: 2.5rem auto;
  background: #fff0f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px #ffd6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 400px;
  text-align: center;
}
.about-page h1 {
  color: #d72660;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.about-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.about-img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 2px 12px #ffd6e6;
  margin-bottom: 1.2rem;
}
.about-content p {
  color: #7a263a;
  font-size: 1.08rem;
  margin: 0;
  line-height: 1.7;
}
</style> 