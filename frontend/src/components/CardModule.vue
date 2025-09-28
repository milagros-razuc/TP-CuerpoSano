<!-- src/components/ModuleCard.vue -->
<template>
  <div class="module-card">
    <div class="module-icon">{{ module.icon }}</div>
    <h3>{{ module.title }}</h3>
    <p class="module-description">{{ module.description }}</p>
    <div class="rf-tag">{{ module.rf }}</div>
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
}

.rf-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
}
</style>