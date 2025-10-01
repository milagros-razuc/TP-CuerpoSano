<template>
  <header class="header">
    <div class="logo">
      <h1>
        <span class="emoji">🏋️‍♂️</span> Cuerpo Sano
      </h1>
      <p class="subtitle">Sistema de Gestión Integral</p>
    </div>

    <div class="header-right">
      <!-- API status -->
      <div class="api-status" v-if="apiStatus !== null">
        <span class="status-dot" :class="apiStatus ? 'online' : 'offline'"></span>
        <span class="text" :class="apiStatus ? 'online-text' : 'offline-text'">
          {{ apiStatus ? 'API Conectada' : 'API Desconectada' }}
        </span>
      </div>

      <!-- Clock -->
      <span class="chip clock">🕒 {{ hora }}</span>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  apiStatus: {
    type: Boolean,
    default: null
  }
})

const hora = ref('—')

onMounted(() => {
  // actualizar hora cada segundo
  const updateClock = () => {
    const d = new Date()
    const pad = x => String(x).padStart(2,'0')
    hora.value = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
  updateClock()
  setInterval(updateClock, 1000)
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.logo h1 {
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.emoji {
  font-size: 2.2rem;
  background: linear-gradient(45deg, #ffd700, #ffcc33);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.api-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background-color: rgba(255,255,255,0.15);
  white-space: nowrap;
  min-width: 160px;
}

.api-status .status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  transform: translateY(-0.5px);
}

.api-status .online {
  background-color: #16a34a;
}

.api-status .offline {
  background-color: #dc2626;
}

.api-status .text {
  line-height: 1;
  margin: 0;
  font-weight: 600;
}

.api-status .online-text {
  color: #16a34a;
}

.api-status .offline-text {
  color: #dc2626;
}

.chip.clock {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
  font-weight: 600;
  white-space: nowrap;
}
</style>
