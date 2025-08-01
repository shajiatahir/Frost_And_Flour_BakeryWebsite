<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top-row">
        <div class="footer-logo-row">
          <img src="/frost_and_flour_icon.png" alt="Frost and Flour Logo" class="footer-logo-img" />
          <span class="footer-logo-text">Frost & Flour</span>
        </div>
        <div class="footer-social-row footer-social-right">
          <span>Follow us</span>
          <a href="#" class="footer-social-icon" aria-label="Facebook"><svg width="22" height="22" fill="none" stroke="#d72660" stroke-width="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="#" class="footer-social-icon" aria-label="Pinterest"><svg width="22" height="22" fill="none" stroke="#d72660" stroke-width="2" viewBox="0 0 24 24"><path d="M8.72 21c.38-1.5 2.28-8.5 2.28-8.5s-.57-1.13-.57-2.8c0-2.62 2.1-4.75 4.7-4.75 2.2 0 3.43 1.57 3.43 3.66 0 2.2-1.17 5.5-2.8 5.5-1.1 0-1.92-1.1-1.66-2.45.32-1.7.94-3.54.94-4.77 0-1.1-.6-2-1.8-2-1.43 0-2.6 1.5-2.6 3.5 0 1.3.47 2.2.47 2.2s-1.6 6.7-1.9 8.1c-.2.8-.3 1.7-.3 2.5 0 .3.1.6.2.8.1.2.3.3.5.3.2 0 .4-.1.5-.3.1-.2.2-.5.2-.8 0-.8.1-1.7.3-2.5z"/></svg></a>
          <a href="#" class="footer-social-icon" aria-label="WhatsApp"><svg width="22" height="22" fill="none" stroke="#d72660" stroke-width="2" viewBox="0 0 24 24"><path d="M21.7 20.3l-3.4-3.4c1.1-1.5 1.7-3.3 1.7-5.2C20 6.5 16.5 3 12.5 3S5 6.5 5 11c0 1.9.6 3.7 1.7 5.2l-3.4 3.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l3.4-3.4c1.5 1.1 3.3 1.7 5.2 1.7 4 0 7.5-3.5 7.5-7.5 0-1.9-.6-3.7-1.7-5.2z"/></svg></a>
          <a href="#" class="footer-social-icon" aria-label="Instagram"><svg width="22" height="22" fill="none" stroke="#d72660" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg></a>
        </div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-bottom-row">
        <div class="footer-col contact-col">
          <div class="footer-col-title">Contact</div>
          <div>(051)-2552890</div>
          <div>frostandflour@gmail.com</div>
          <div>Street 39 H-8/3</div>
          <div>Islamabad, Pakistan</div>
        </div>
        <div class="footer-col explore-col">
          <div class="footer-col-title">Explore</div>
          <div class="explore-links">
            <router-link to="/">Home</router-link>
            <router-link to="/menu">Menu</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/orders">Orders</router-link>
            <router-link to="/contact">Contact</router-link>
          </div>
        </div>
      </div>
      <div class="footer-copyright">© 2024 Frost & Flour. All rights reserved</div>
    </div>
  </footer>
</template>

<script setup>
// No script logic needed for static footer
</script>

<style scoped>
.footer {
  width: 100vw;
  min-width: 100vw;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg, #ffd6e6 0%, #ffe6f0 100%);
  box-shadow: 0 -4px 24px 0 #ffd6e6, 0 -2px 16px 0 #ffb6d5;
  margin: 0;
  padding: 0;
  position: relative;
  border: none;
  overflow-x: hidden;
}
.footer-inner {
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 2.5rem 0 1.2rem 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-end;
  box-sizing: border-box;
}
.footer-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
  margin-bottom: 1.2rem;
  width: 100%;
  box-sizing: border-box;
  padding: 0 2rem;
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
  box-shadow: 0 2px 8px #ffd6e6;
  border: 2.5px solid #d72660;
}
.footer-logo-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #d72660;
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
  background: #ffd6e6;
  margin: 1.2rem 0 1.2rem 0;
  border-radius: 2px;
}
.footer-bottom-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0;
  margin-bottom: 1.2rem;
  width: 100%;
  box-sizing: border-box;
  padding: 0 2rem;
}
.footer-col {
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 1.05rem;
  color: #d72660;
}
.footer-col-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #d72660;
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
}
.contact-col {
  align-items: flex-start;
  text-align: left;
}
.explore-col {
  align-items: center;
  text-align: center;
  flex: 1;
}
.explore-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.2rem;
}
.explore-links router-link,
.explore-links .router-link-active,
.explore-links .router-link-exact-active,
.explore-links a[href='/menu'],
.explore-links a[href='/about'],
.explore-links a[href='/orders'],
.explore-links a[href='/contact'] {
  color: #d72660 !important;
  font-weight: 700;
  font-size: 1.08rem;
  text-decoration: none !important;
  transition: color 0.18s;
  display: block;
  text-align: center;
}
.explore-links router-link:hover,
.explore-links .router-link-active:hover,
.explore-links .router-link-exact-active:hover,
.explore-links a[href='/menu']:hover,
.explore-links a[href='/about']:hover,
.explore-links a[href='/orders']:hover,
.explore-links a[href='/contact']:hover {
  color: #b71c4a !important;
  text-decoration: underline !important;
}
.footer-copyright {
  text-align: center;
  color: #d72660;
  font-size: 0.98rem;
  margin-top: 1.2rem;
  opacity: 0.85;
}
@media (max-width: 900px) {
  .footer-inner, .footer-bottom-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    padding: 2rem 1rem 1rem 1rem;
  }
  .contact-col, .explore-col {
    align-items: flex-start;
    text-align: left;
  }
  .explore-links {
    align-items: flex-start;
    text-align: left;
  }
}
</style> 