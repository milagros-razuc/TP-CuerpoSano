<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-07 — Registrar Pago</h2></template>

      <form class="row" @submit.prevent="onSave">
        <div style="flex:1">
          <label>Buscar Miembro (DNI / Nombre / Apellido)</label>
          <input v-model="q" @input="search" type="text" placeholder="Buscar..." />
          <ul v-if="results.length" style="max-height:150px;overflow:auto;margin:6px 0;padding:6px;border:1px solid #eee">
            <li v-for="r in results" :key="r.id" style="padding:6px;cursor:pointer" @click="selectMember(r)">
              {{ r.dni }} — {{ r.nombre }} {{ r.apellido }}
            </li>
          </ul>
          <div style="margin-top:8px">
            <label>Miembro seleccionado</label>
            <div v-if="selected" style="display:flex;align-items:center;gap:8px">
              <button title="Deseleccionar" class="btn ghost" style="padding:6px 8px;min-width:32px" @click="deselect">✕</button>
              <div>{{ selected.dni }} — {{ selected.nombre }} {{ selected.apellido }}</div>
            </div>
            <div v-else style="color:#666">Ninguno</div>
          </div>
        </div>

        <div style="flex:1">
          <label>Tipo de pago</label>
          <select v-model="form.tipo">
            <option value="membresia">Membresía</option>
            <option value="clase">Clase</option>
          </select>

          <label>Método</label>
          <select v-model="form.id_metodoPago">
            <option :value="1">Efectivo</option>
            <option :value="2">Mercado Pago</option>
            <option :value="3">Tarjeta</option>
          </select>

          <label>Monto</label>
          <input v-model.number="form.monto" type="number" min="0" step="0.01" />

          <label>Fecha</label>
          <input v-model="form.fecha_pago" type="date" />

          <label>Observaciones</label>
          <input v-model="form.observaciones" type="text" />
        </div>
      </form>

      <template #footer>
        <button class="btn primary" @click="onSave">Guardar Pago</button>
      </template>
    </BaseCard>

    <BaseCard>
      <template #header>
        <h3>Pagos recientes</h3>
        <div class="inline">
          <input v-model="filters.q" type="text" placeholder="Buscar..." @input="fetch" />
          <button class="btn" @click="fetch">Actualizar</button>
        </div>
      </template>

      <table class="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Miembro</th>
            <th>Método</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!items.length">
            <td colspan="5" style="text-align:center;color:var(--muted)">No hay pagos registrados</td>
          </tr>
          <tr v-else v-for="p in items" :key="p.id">
            <td>{{ formatDate(p.fecha_pago) }}</td>
            <td>{{ p.miembro ? (p.miembro.nombre + ' ' + p.miembro.apellido) : '—' }}</td>
            <td>{{ p.metodoPago?.nombre || '—' }}</td>
            <td>${{ p.monto.toLocaleString('es-AR') }}</td>
            <td>{{ p.estado_pago }}</td>
          </tr>
        </tbody>
      </table>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import * as api from '../services/payments.js'

const q = ref('')
const results = ref([])
const selected = ref(null)
const form = reactive({
  id_miembro: null,
  tipo: 'membresia',
  id_metodoPago: 1,
  monto: 0,
  fecha_pago: new Date().toISOString().slice(0,10),
  observaciones: ''
})
const filters = reactive({ q: '' })
const items = ref([])

async function fetch() {
  items.value = await api.listAll(filters)
}

function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

let searchTimeout = null
async function search() {
  clearTimeout(searchTimeout)
  if (!q.value || q.value.length < 2) { results.value = []; return }
  searchTimeout = setTimeout(async () => {
    const members = await (await import('../services/members.js')).listAll({ q: q.value })
    const term = q.value.toLowerCase()
    results.value = members.filter(m => [m.dni, m.nombre, m.apellido].join(' ').toLowerCase().includes(term))
  }, 300)
}

function selectMember(m) {
  selected.value = m
  form.id_miembro = m.id
  results.value = []
  q.value = ''
}

function deselect() {
  selected.value = null
  form.id_miembro = null
}

async function onSave() {
  if (!form.id_miembro) return alert('Seleccione un miembro antes de registrar el pago')
  try {
    const r = await api.createOne({ ...form })
    items.value.unshift(r)
    selected.value = null
    Object.assign(form, { id_miembro:null, monto:0, observaciones:'' })
  } catch (e) {
    console.error(e)
    alert('Error al registrar pago: ' + (e?.response?.data?.error || e.message))
  }
}

onMounted(fetch)
</script>
