<template>
  <div class="dashboard-container">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="logo">
        <h1>🏋️‍♂️ Cuerpo Sano</h1>
        <p class="subtitle">Sistema de Gestión Integral</p>
      </div>
      <div class="status-indicator" v-if="apiStatus">
        <div class="status-dot" :class="{ online: apiStatus.online }"></div>
        <span class="status-text" :class="{ online: apiStatus.online }">
          API {{ apiStatus.online ? 'Conectada' : 'Desconectada' }}
        </span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Welcome Card -->
      <div class="welcome-card">
        <h2>¡Bienvenido al Panel de Administración!</h2>
        <p>Seleccione un módulo para comenzar a gestionar su gimnasio.</p>
      </div>

      <!-- Modules Grid -->
      <div class="modules-grid">
        <!-- Miembros -->
        <router-link to="/miembros" class="module-card">
          <div class="icon">👥</div>
          <h3>Gestión de Miembros</h3>
          <p>Registrar, modificar, consultar y eliminar miembros del gimnasio.</p>
          <div class="actions">
            <span class="tag">RF-01 a RF-06</span>
          </div>
        </router-link>

        <!-- Membresías -->
        <router-link to="/membresias" class="module-card">
          <div class="icon">💳</div>
          <h3>Gestión de Membresías</h3>
          <p>Activar, renovar y administrar los planes de membresía de los socios.</p>
          <div class="actions">
            <span class="tag">RF-11 a RF-17</span>
          </div>
        </router-link>

        <!-- Entrenadores -->
        <router-link to="/entrenadores" class="module-card">
          <div class="icon">👨‍🏫</div>
          <h3>Gestión de Entrenadores</h3>
          <p>Registrar y asignar entrenadores, validar certificaciones.</p>
          <div class="actions">
            <span class="tag">RF-30 a RF-37</span>
          </div>
        </router-link>

        <!-- Horarios -->
        <router-link to="/horarios" class="module-card">
          <div class="icon">⏰</div>
          <h3>Gestión de Horarios</h3>
          <p>Crear, modificar y eliminar los horarios de las clases grupales.</p>
          <div class="actions">
            <span class="tag">RF-18 a RF-22</span>
          </div>
        </router-link>

        <!-- Actividades -->
        <router-link to="/actividades" class="module-card">
          <div class="icon">🧘‍♀️</div>
          <h3>Gestión de Actividades</h3>
          <p>Administrar las actividades que ofrece el gimnasio a sus socios.</p>
          <div class="actions">
            <span class="tag">RF-23 a RF-27</span>
          </div>
        </router-link>

        <!-- Reportes -->
        <router-link to="/reportes" class="module-card">
          <div class="icon">📊</div>
          <h3>Reportes y Estadísticas</h3>
          <p>Generar reportes de ingresos, asistencia al gimnasio y a clases.</p>
          <div class="actions">
            <span class="tag">RF-38 a RF-40</span>
          </div>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      apiStatus: null
    };
  },
  async mounted() {
    await this.checkApiStatus();
  },
  methods: {
    async checkApiStatus() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        console.log('Intentando conectar con:', baseUrl);
        const response = await axios.get(`${baseUrl}/`);
        this.apiStatus = {
          online: true,
          message: response.data.message,
          version: response.data.version
        };
      } catch (error) {
        console.error('❌ Error al conectar con la API:', error);
        this.apiStatus = {
          online: false,
          message: 'No se pudo conectar con el servidor.'
        };
      }
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 2rem;
  color: #fff;
}

/* Header Styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.logo h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #f44336;
  box-shadow: 0 0 10px #f44336;
  transition: all 0.3s ease;
}

.status-dot.online {
  background-color: #4caf50;
  box-shadow: 0 0 10px #4caf50;
}

.status-text {
  font-weight: 600;
  color: #f44336;
}

.status-text.online {
  color: #4caf50;
}

/* Main Content */
.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-card {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.welcome-card h2 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  background: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-card p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

/* Modules Grid */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.module-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-decoration: none;
  color: #fff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 280px;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
}

.module-card h3 {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.module-card p {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }

  .module-card {
    min-height: auto;
    padding: 1.5rem;
  }
}
</style>