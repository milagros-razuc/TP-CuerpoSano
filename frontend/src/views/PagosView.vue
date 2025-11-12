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
          <label>Membresía</label>
          <select v-model="form.id_tipo_membresia" @change="onTipoChange">
            <option :value="null">-- Seleccione --</option>
            <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.nombre }} — ${{ String(t.precio).replace('.',',') }}</option>
          </select>

          <label>Método</label>
          <select v-model="form.id_metodoPago">
            <option :value="null">-- Seleccione --</option>
            <option v-for="m in metodos" :key="m.id" :value="m.id">{{ m.nombre }}</option>
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
import * as tiposApi from '../services/memberships.js'
import * as metodosApi from '../services/metodoPagos.js'

const q = ref('')
const results = ref([])
const selected = ref(null)
const form = reactive({
  id_miembro: null,
  id_tipo_membresia: null, // seleccionado (TipoMembresia)
  id_metodoPago: null,
  monto: 0,
  fecha_pago: new Date().toISOString().slice(0,10),
  observaciones: ''
})
const tipos = ref([])
const metodos = ref([])
const filters = reactive({ q: '' })
const items = ref([])

async function fetch() {
  items.value = await api.listAll(filters)
}

async function loadTipoMembresias(){
  try{ tipos.value = await tiposApi.listAll() }catch(e){ console.error('Error cargando tipos de membresía', e); tipos.value = [] }
}

async function loadMetodosPago(){
  try{ metodos.value = await metodosApi.listAll() }catch(e){ console.error('Error cargando métodos de pago', e); metodos.value = [] }
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

function onTipoChange(){
  const sel = tipos.value.find(t=>t.id === form.id_tipo_membresia)
  if(sel){ form.monto = Number(sel.precio) }
}

async function onSave() {
  if (!form.id_miembro) return alert('Seleccione un miembro antes de registrar el pago')
  try {
    const r = await api.createOne({ ...form })
    // backend returns { message, pago, membresia } — normalize the item for the recent list
    const created = r.pago || r
    const display = {
      id: created.id,
      fecha_pago: created.fecha_pago,
      monto: created.monto,
      estado_pago: created.estado_pago,
      // include metodoPago object if we have it loaded
      metodoPago: metodos.value.find(m => m.id === created.id_metodoPago) || null,
      // include miembro info from selected if available
      miembro: selected.value ? { id: selected.value.id, nombre: selected.value.nombre, apellido: selected.value.apellido, dni: selected.value.dni } : null
    }
    items.value.unshift(display)
    // clear selection and reset form
    selected.value = null
    Object.assign(form, { id_miembro: null, id_tipo_membresia: null, id_metodoPago: null, monto: 0, observaciones: '' })
  } catch (e) {
    console.error(e)
    alert('Error al registrar pago: ' + (e?.response?.data?.error || e.message))
  }
}

onMounted(fetch)
onMounted(()=>{ loadTipoMembresias(); loadMetodosPago() })
</script>
