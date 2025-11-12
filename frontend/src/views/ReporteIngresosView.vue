<template>
  <BaseCard>
    <template #header>
        <h2>Reporte de Ingresos</h2>

        <div class="inline">
          <label>Desde</label>
          <input v-model="f.desde" type="date" />

          <label>Hasta</label>
          <input v-model="f.hasta" type="date" />

          <label>Método</label>
          <select v-model="f.metodo">
            <option value="">Todos</option>
            <option v-for="m in metodos" :key="m.id" :value="m.nombre">{{ m.nombre }}</option>
          </select>

          <button class="btn" @click="fetch">Aplicar</button>
        </div>
      </template>

      <table class="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Miembro</th>
            <th>Método</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ formatFecha(r.fecha_pago) }}</td>
            <td>{{ r.miembro ? (r.miembro.nombre + ' ' + r.miembro.apellido + ' (DNI: ' + r.miembro.dni + ')') : '—' }}</td>
            <td>{{ r.metodo || '—' }}</td>
            <td>{{ formatMonto(r.monto) }}</td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="4" class="text-center">No hay registros para los filtros seleccionados</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="3" style="text-align:right">Total</th>
            <th>{{ total }}</th>
          </tr>
        </tfoot>
      </table>
  </BaseCard>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import { income } from '../services/reports.js'
import * as metodosApi from '../services/metodoPagos.js'
// default: hasta = today, desde = 7 days before
function yyyyMmDd(date){
  const y = date.getFullYear()
  const m = String(date.getMonth()+1).padStart(2,'0')
  const d = String(date.getDate()).padStart(2,'0')
  return `${y}-${m}-${d}`
}
const today = new Date()
const aWeekAgo = new Date(Date.now() - 7*24*60*60*1000)
const f = reactive({ desde: yyyyMmDd(aWeekAgo), hasta: yyyyMmDd(today), metodo: '' })
const rows = ref([])
const total = computed(()=> rows.value.reduce((a,b)=> a + (Number(b.monto)||0), 0))
const metodos = ref([])

function formatFecha(fecha){ if(!fecha) return '—'; const d = new Date(fecha); return d.toLocaleString('es-AR', { dateStyle:'short', timeStyle:'short' }) }
function formatMonto(v){ return Number(v).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }

async function loadMetodos(){
  try{ metodos.value = await metodosApi.listAll() }catch(e){ metodos.value = [] }
}

async function fetch(){
  try{
    const data = await income(f)
    rows.value = Array.isArray(data) ? data : []
  }catch(e){ console.error('Error cargando ingresos', e); rows.value = [] }
}

onMounted(()=>{ loadMetodos(); fetch() })
</script>
