<template>
  <BaseCard>
    <template #header>
      <h2>Reporte - Histórico de Membresías</h2>

      <div class="inline">
        <label>Desde</label>
        <input v-model="f.desde" type="date" />

        <label>Hasta</label>
        <input v-model="f.hasta" type="date" />

        <div style="min-width:220px">
          <label>Buscar Miembro (DNI / Nombre / Apellido)</label>
          <input v-model="q" @input="search" type="text" placeholder="Buscar..." />
          <ul v-if="results.length" style="max-height:150px;overflow:auto;margin:6px 0;padding:6px;border:1px solid #eee">
            <li
              v-for="r in results"
              :key="r.id"
              style="padding:6px;cursor:pointer"
              @click="selectMember(r)"
            >
              {{ r.dni }} — {{ r.nombre }} {{ r.apellido }}
            </li>
          </ul>

          <div style="margin-top:8px">
            <label>Miembro/s seleccionado/s</label>
            <div v-if="selected" style="display:flex;align-items:center;gap:8px">
              <button
                title="Deseleccionar"
                class="btn ghost"
                style="padding:6px 8px;min-width:32px"
                @click="deselect"
              >
                ✕
              </button>
              <div>{{ selected.dni }} — {{ selected.nombre }} {{ selected.apellido }}</div>
            </div>
            <div v-else style="color:#666">Todos</div>
          </div>
        </div>

        <button class="btn" @click="fetch">Aplicar</button>
      </div>
    </template>

    <table class="table">
      <thead>
        <tr>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Estado</th>
          <th>Miembro</th>
          <th>Tipo Membresía</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.id">
          <td>{{ formatFecha(r.fecha_inicio) }}</td>
          <td>{{ formatFecha(r.fecha_fin) }}</td>
          <td>{{ r.estado }}</td>
          <td>
            {{ r.miembro?.nombre }} {{ r.miembro?.apellido }} ({{ r.miembro?.dni }})
          </td>
          <td>{{ r.tipo?.nombre }}</td>
          <td>{{ formatMoney(r.tipo?.precio) }}</td>
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="6" class="text-center">No hay registros para los filtros seleccionados</td>
        </tr>
      </tbody>
          <tfoot>
            <tr>
              <th colspan="5" style="text-align:right">Total</th>
              <th>{{ formatMoney(total) }}</th>
            </tr>
          </tfoot>
    </table>
  </BaseCard>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import { listAll } from '../services/membresias.js'

function yyyyMmDd(date){
  const y = date.getFullYear()
  const m = String(date.getMonth()+1).padStart(2,'0')
  const d = String(date.getDate()).padStart(2,'0')
  return `${y}-${m}-${d}`
}
const today = new Date()
const aWeekAgo = new Date(Date.now() - 7*24*60*60*1000)

const f = reactive({ desde: yyyyMmDd(aWeekAgo), hasta: yyyyMmDd(today), dni: '' })
const rows = ref([])
const total = computed(() => rows.value.reduce((acc, r) => acc + (Number(r.tipo?.precio) || 0), 0))

// member search (replicar IngresoGimnasio)
const q = ref('')
const results = ref([])
const selected = ref(null)
let searchTimeout = null

async function search() {
  clearTimeout(searchTimeout)
  if (!q.value || q.value.length < 2) {
    results.value = []
    return
  }
  searchTimeout = setTimeout(async () => {
    try {
      const members = await (await import('../services/members.js')).listAll({ q: q.value })
      const term = q.value.toLowerCase()
      results.value = members.filter(m => {
        const haystack = [m.dni, m.nombre, m.apellido].filter(Boolean).join(' ').toLowerCase()
        return haystack.includes(term)
      })
    } catch (e) {
      console.error('Error buscando miembros:', e)
      results.value = []
    }
  }, 300)
}

function selectMember(m) {
  selected.value = m
  results.value = []
  q.value = ''
  f.dni = m.dni ?? ''
}

function deselect() {
  selected.value = null
  f.dni = ''
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  const d = new Date(fecha)
  return d.toLocaleString('es-AR', { dateStyle: 'short' })
}

function formatMoney(v) {
  if (v == null) return '—'
  return Number(v).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
}

async function fetch() {
  try {
    let data = await listAll()
    if (!Array.isArray(data)) data = []

    // filtro por miembro seleccionado o por dni texto
    if (selected.value) {
      data = data.filter(m => m.miembro?.id === selected.value.id)
    } else if (f.dni) {
      const dniTrim = f.dni.toString().trim()
      data = data.filter(m => (m.miembro?.dni ?? '').toString().includes(dniTrim))
    }

    // filtro por fechas sobre fecha_inicio (hasta inclusivo)
    if (f.desde) {
      const desdeDate = new Date(f.desde)
      data = data.filter(m => new Date(m.fecha_inicio) >= desdeDate)
    }
    if (f.hasta) {
      const hastaDate = new Date(f.hasta)
      hastaDate.setHours(23,59,59,999)
      data = data.filter(m => new Date(m.fecha_inicio) <= hastaDate)
    }

    // orden descendente por fecha_inicio
    data = data.sort((a,b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio))

    // si no hay filtros, limitar a 20
    if (!f.desde && !f.hasta && !f.dni) data = data.slice(0,20)

    rows.value = data
  } catch (err) {
    console.error('Error al obtener membresías:', err)
    rows.value = []
  }
}

onMounted(fetch)
</script>
