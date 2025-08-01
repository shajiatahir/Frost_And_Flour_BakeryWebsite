<template>
  <div class="logo-header">
    <img src="/frost_and_flour_icon.png" alt="Frost and Flour Logo" class="logo-img" />
    <span class="logo-text">Frost and Flour</span>
  </div>
</template>

<style scoped>
.logo-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2.5rem 0 2rem 0;
}
.logo-img {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: none;
  border: none;
  margin: 0;
  object-fit: contain;
  display: block;
}
.logo-text {
  font-size: 1.3rem;
  font-family: inherit;
  font-weight: 500;
  color: #d72660;
  margin-left: 0.6rem;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  line-height: 1;
  white-space: nowrap;
}
</style> 