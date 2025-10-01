<template>
  <div class="home">
    <Header :apiStatus="apiStatus" />

    <main class="main-content">
      <div class="welcome-box">
        <h2>¡Bienvenido al Panel de Administración!</h2>
        <p>Seleccione un módulo para comenzar a gestionar su gimnasio.</p>
      </div>

      <div class="modules-grid">
        <router-link
            v-for="(module, index) in modules"
            :key="index"
            :to="module.route"
            class="module-link"
         >
            <ModuleCard :module="module" />
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import ModuleCard from '../components/CardModule.vue'

export default {
  name: 'Home',
  components: {
    Header,
    ModuleCard
  },
  data() {
    return {
      // ⚠️ Inicia en null → muestra "Verificando..." si lo implementas, o nada hasta que se cargue
      apiStatus: null,
      modules: [
        {
          title: "Gestión de Miembros",
          description: "Registrar, modificar, consultar y eliminar miembros del gimnasio.",
          icon: "👥",
          rf: "RF 01 a RF 06",
          route: "/miembros" 
        },
        {
          title: "Gestión de Membresías",
          description: "Activar, renovar y administrar los planes de membresía de los socios.",
          icon: "💳",
          rf: "RF 11 a RF 17"
        },
        {
          title: "Gestión de Entrenadores",
          description: "Registrar y asignar entrenadores, validar certificaciones.",
          icon: "👨‍🏫",
          rf: "RF 30 a RF 37"
        },
        {
          title: "Gestión de Horarios",
          description: "Crear, modificar y eliminar los horarios de las clases grupales.",
          icon: "⏰",
          rf: "RF 18 a RF 22"
        },
        {
          title: "Gestión de Actividades",
          description: "Administrar las actividades que ofrece el gimnasio a sus socios.",
          icon: "🧘",
          rf: "RF 23 a RF 27"
        },
        {
          title: "Reportes y Estadísticas",
          description: "Generar reportes de ingresos, asistencia al gimnasio y a clases.",
          icon: "📊",
          rf: "RF 38 a RF 40"
        }
      ]
    }
  },
  async mounted() {
    await this.checkApiStatus()
    // Opcional: verificar cada 30 segundos
    this.apiCheckInterval = setInterval(this.checkApiStatus, 30000)
  },
  beforeUnmount() {
    if (this.apiCheckInterval) {
      clearInterval(this.apiCheckInterval)
    }
  },
  methods: {
    async checkApiStatus() {
      try {
        //llama a  endpoint /api
        const response = await fetch('/api')
        this.apiStatus = response.ok // true si 200-299, false si 4xx/5xx
      } catch (error) {
        // Error de red (CORS, timeout, DNS, etc.)
        this.apiStatus = false
      }
    }
  }
}
</script>

<style scoped>

.home {
  min-height: 100vh;
  background: linear-gradient(180deg, #1e3a70, #2e4a8c 30%, #3a5eb0 100%);
  color: #fff;
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.welcome-box {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.welcome-box h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.welcome-box p {
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.module-link {
  text-decoration: none;
  color: inherit;
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
}
</style>