<template>
  <BaseCard>
    <template #header><h2>CU-06 — Ingreso Gimnasio</h2></template>
    <form class="row" @submit.prevent="onRegister">
      <div style="flex:1">
        <label>Buscar Miembro (DNI / Nombre / Apellido)</label>
        <input v-model="q" @input="search" type="text" placeholder="Buscar..." />
        <ul v-if="results.length" style="max-height:150px;overflow:auto;margin:6px 0;padding:6px;border:1px solid #eee">
          <li v-for="r in results" :key="r.id" style="padding:6px;cursor:pointer" @click="selectMember(r)">{{ r.dni }} — {{ r.nombre }} {{ r.apellido }}</li>
        </ul>
        <div style="margin-top:8px">
          <label>Escanear/Código de barras</label>
          <input type="text" v-model="barcode" @change="scanBarcode" placeholder="Leer código o pegar aquí" />
        </div>
      </div>

      <div style="flex:1"><label>Miembro seleccionado</label>
        <div v-if="selected" style="display:flex;align-items:center;gap:8px">
          <button title="Deseleccionar" class="btn ghost" style="padding:6px 8px;min-width:32px" @click="deselect">✕</button>
          <div>{{ selected.dni }} — {{ selected.nombre }} {{ selected.apellido }}</div>
        </div>
        <div v-else style="color:#666">Ninguno</div>
      </div>

      <div style="flex:1"><label>Metodo identificación</label>
        <select v-model="metodo">
          <option value="codigo_barras">Código de barras</option>
          <option value="huella">Huella</option>
        </select>
      </div>
      
    </form>
    <template #footer>
      <button class="btn primary" @click="onRegister">Registrar</button>
      <button class="btn" @click="exportCsv">Exportar CSV</button>
    </template>
  </BaseCard>

  <BaseCard>
    <template #header><h3>Ingresos recientes</h3></template>
    <table class="table">
      <thead><tr><th>Fecha</th><th>DNI</th><th>Nombre y Apellido</th><th>Método</th></tr></thead>
      <tbody>
        <tr v-if="!items.length">
          <td colspan="4" style="text-align:center;color:var(--muted)">No hay ingresos registrados</td>
        </tr>
        <tr v-else v-for="i in items" :key="i.id">
          <td>{{ formatDate(i.fecha_hora || i.fecha) }}</td>
          <td>{{ i.miembro?.dni || i.id_miembro || i.miembro?.id || i.identificacion || '—' }}</td>
          <td>{{ (i.miembro?.nombre || i.nombre) ? ((i.miembro?.nombre || i.nombre) + ' ' + (i.miembro?.apellido || i.apellido || '')).trim() : '—' }}</td>
          <td>{{ i.metodo_identificacion || i.modo || '—' }}</td>
        </tr>
      </tbody>
    </table>
  </BaseCard>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import * as api from '../services/attendance_gym.js'
const q = ref('')
const results = ref([])
const selected = ref(null)
const metodo = ref('codigo_barras')
const barcode = ref('')
const busy = ref(false)
const items = ref([])
async function fetch(){ items.value = await api.listAll() }
onMounted(fetch)

function formatDate(d){
  if(!d) return '—'
  const dt = new Date(d)
  if(isNaN(dt)) return '—'
  const dd = String(dt.getDate()).padStart(2,'0')
  const mm = String(dt.getMonth() + 1).padStart(2,'0')
  const yyyy = dt.getFullYear()
  const hh = String(dt.getHours()).padStart(2,'0')
  const min = String(dt.getMinutes()).padStart(2,'0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

let searchTimeout = null
async function search(){
  clearTimeout(searchTimeout)
  if(!q.value || q.value.length < 2){ results.value = []; return }
  searchTimeout = setTimeout(async ()=>{
    // usamos members service; si el backend no filtra por q, filtramos cliente-side
    const members = await (await import('../services/members.js')).listAll({ q: q.value })
    const term = q.value.toLowerCase()
    results.value = members.filter(m => {
      const haystack = [m.dni, m.nombre, m.apellido].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(term)
    })
  }, 300)
}

function selectMember(m){ selected.value = m; results.value = []; q.value = '' }

function deselect(){ selected.value = null }

async function scanBarcode(){
  if(!barcode.value) return
  busy.value = true
  try{
    const members = await (await import('../services/members.js')).listAll({ q: barcode.value })
    // buscar exact match por codigo_barra o dni
    const found = members.find(x => x.codigo_barra === barcode.value || String(x.dni) === String(barcode.value))
    if(found) selectMember(found)
    else alert('Miembro no encontrado para ese código')
  }catch(e){ console.error(e); alert('Error buscando código') }
  finally{ busy.value = false; barcode.value = '' }
}



async function onRegister(){
  if(!selected.value) return alert('Seleccione un miembro antes de registrar la asistencia')
  const payload = { id_miembro: selected.value.id, metodo_identificacion: metodo.value }
  try{
    const r = await api.createOne(payload)
    items.value.unshift(r.asistencia || r)
    selected.value = null
    // fecha/hora se delega al backend (timestamp server-side) o se omite; no manejamos input en frontend
  }catch(e){
    console.error(e); alert('Error al registrar asistencia: '+(e?.response?.data?.error||e.message))
  }
}
function exportCsv(){
  const rows = [['fecha','identificacion','modo'], ...items.value.map(i=>[i.fecha,i.identificacion,i.modo])]
  const csv = rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: 'ingresos.csv' })
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
}
  </script>
