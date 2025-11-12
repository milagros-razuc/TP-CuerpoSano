<template>
  <BaseCard>
    <template #header>
      <h2>CU-09 — Reporte de Asistencia</h2>

      <div class="inline">
        <label>Desde</label>
        <input v-model="f.desde" type="date" />

        <label>Hasta</label>
        <input v-model="f.hasta" type="date" />

        <label>Tipo</label>
        <select v-model="f.tipo">
          <option value="todas">Todas</option>
          <option value="gimnasio">Gimnasio</option>
          <option value="clase">Clases</option>
        </select>

        <button class="btn" @click="fetch">Aplicar</button>
      </div>
    </template>

    <table class="table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Miembro</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.id">
          <td>{{ formatFecha(r.fecha_hora) }}</td>
          <td>{{ r.tipo }}</td>
          <td>
            {{ r.miembro?.nombre }} {{ r.miembro?.apellido }}
            ({{ r.miembro?.dni }})
          </td>
          <td>
            <span v-if="r.tipo === 'clase'">{{ r.clase?.nombre }}</span>
            <span v-else>Ingreso general al gimnasio</span>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="4" class="text-center">
            No hay registros para los filtros seleccionados
          </td>
        </tr>
      </tbody>
    </table>
  </BaseCard>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import { attendance } from '../services/reports.js'

// filtros reactivos
const f = reactive({
  desde: '',
  hasta: '',
  tipo: 'todas' // gimnasio | clase | todas
})

// lista de resultados
const rows = ref([])

function formatFecha(fecha) {
  const d = new Date(fecha)
  return d.toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

async function fetch() {
  try {
    let data = await attendance(f)
    if (!Array.isArray(data)) data = []

    // filtro por tipo
    if (f.tipo !== 'todas') {
      data = data.filter(a => a.tipo === f.tipo)
    }

    // filtro por fechas
    if (f.desde) {
      const desdeDate = new Date(f.desde)
      data = data.filter(a => new Date(a.fecha_hora) >= desdeDate)
    }
    if (f.hasta) {
      const hastaDate = new Date(f.hasta)
      data = data.filter(a => new Date(a.fecha_hora) <= hastaDate)
    }

    // orden descendente y límite a 20 si no hay filtros
    if (!f.desde && !f.hasta && f.tipo === 'todas') {
      data = data.sort(
        (a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)
      ).slice(0, 20)
    } else {
      data = data.sort(
        (a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)
      )
    }

    rows.value = data
  } catch (err) {
    console.error('Error al obtener asistencias:', err)
    rows.value = []
  }
}

// carga inicial
onMounted(fetch)
</script>

<style scoped>
.text-center {
  text-align: center;
  color: #666;
}
.inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem;
}
.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.3rem;
  cursor: pointer;
}
.btn:hover {
  background-color: #0056b3;
}
</style>
