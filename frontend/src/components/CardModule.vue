<!-- src/components/ModuleCard.vue -->
<template>
  <div class="module-card">
    <div class="module-icon">{{ module.icon }}</div>
    <h3>{{ module.title }}</h3>
    <p class="module-description">{{ module.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'ModuleCard',
  props: {
    module: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.module-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%; /* let the card fill the grid cell */
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.module-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.module-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.module-description {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 1rem;
  /* allow description to take remaining vertical space so headings/footers align */
  flex: 1 1 auto;
}

/* rf-tag removed */
</style>