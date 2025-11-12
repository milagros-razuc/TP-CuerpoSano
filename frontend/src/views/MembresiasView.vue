<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-02 — Membresías</h2></template>

      <form class="row" @submit.prevent="onSave">
        <div>
          <label>Nombre</label>
          <input v-model="form.nombre" type="text" placeholder="Mensual/Anual" required />
        </div>
        <div>
          <label>Descripción</label>
          <input v-model="form.descripcion" type="text" placeholder="Incluye X" />
        </div>
        <div>
          <label>Precio</label>
          <input v-model.number="form.precio" type="number" step="0.01" min="0" placeholder="0.00" required />
        </div>
        <div>
          <label>Duración (días)</label>
          <input v-model.number="form.duracion_dias" type="number" step="1" min="1" placeholder="30" required />
        </div>
      </form>

      <template #footer>
        <button class="btn primary" @click="onSave">Guardar</button>
        <button v-if="form.id" class="btn" @click="onUpdate">Modificar</button>
        <button v-if="form.id" class="btn error" @click="onDelete">Eliminar</button>
      </template>
    </BaseCard>

    <BaseCard>
      <template #header>
        <h3>Listado</h3>
          <Toolbar>
          <input v-model="q" type="text" placeholder="Buscar..." @input="fetch" />
          <button class="btn" @click="clear">Limpiar</button>
          <button class="btn" @click="imprimir">Imprimir</button>
        </Toolbar>
      </template>

      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Duración (días)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in items"
            :key="row.id"
            @click="fill(row)"
            style="cursor: pointer"
          >
            <td>{{ row.nombre }}</td>
            <td>{{ row.descripcion }}</td>
            <td>{{ formatPrice(row.precio) }}</td>
            <td>{{ row.duracion_dias }}</td>
          </tr>
        </tbody>
      </table>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import BaseCard from '../components/ui/BaseCard.vue'
import Toolbar from '../components/ui/Toolbar.vue'
import * as api from '../services/memberships.js'

const q = ref('')
const items = ref([])
const form = ref({
  id: undefined,
  nombre: '',
  descripcion: '',
  precio: 0.0,
  duracion_dias: 30
})

// 🔹 Funciones auxiliares
async function fetch() {
  items.value = await api.listAll({ q: q.value })
}

function clear() {
  q.value = ''
  fetch()
}

function fill(row) {
  form.value = {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: row.precio ?? 0,
    duracion_dias: row.duracion_dias ?? 30
  }
}

function formatPrice(val) {
  if (val === null || val === undefined || val === '') return ''
  const n = Number(val)
  if (Number.isNaN(n)) return ''
  return n.toFixed(2)
}

// 🔹 Crear membresía
async function onSave() {
  if (!form.value.nombre || form.value.precio <= 0 || form.value.duracion_dias < 1) {
    Swal.fire('⚠️ Campos incompletos', 'Completá nombre, precio (>0) y duración (>=1).', 'warning')
    return
  }

  try {
    const payload = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      precio: Number(form.value.precio),
      duracion_dias: Number(form.value.duracion_dias)
    }
    const created = await api.createOne(payload)
    items.value.unshift(created)
    form.value = { id: undefined, nombre: '', descripcion: '', precio: 0.0, duracion_dias: 30 }

    Swal.fire('✅ Guardado', 'La membresía se creó exitosamente.', 'success')
  } catch (err) {
    Swal.fire('❌ Error', err.response?.data?.error || 'No se pudo crear la membresía.', 'error')
  }
}

// 🔹 Modificar membresía
async function onUpdate() {
  if (!form.value.id) return
  if (!form.value.nombre || form.value.precio <= 0 || form.value.duracion_dias < 1) {
    Swal.fire('⚠️ Campos incompletos', 'Completá nombre, precio (>0) y duración (>=1).', 'warning')
    return
  }

  try {
    const payload = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      precio: Number(form.value.precio),
      duracion_dias: Number(form.value.duracion_dias)
    }
    const upd = await api.updateOne(form.value.id, payload)
    const i = items.value.findIndex(x => x.id === upd.id)
    if (i > -1) items.value[i] = upd

    Swal.fire('✅ Actualizado', 'La membresía fue modificada correctamente.', 'success')
  } catch (err) {
    Swal.fire('❌ Error', err.response?.data?.error || 'No se pudo modificar la membresía.', 'error')
  }
}

// 🔹 Eliminar membresía con confirmación
async function onDelete() {
  if (!form.value.id) return

  const confirm = await Swal.fire({
    title: '¿Eliminar membresía?',
    text: `¿Seguro que querés eliminar "${form.value.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (!confirm.isConfirmed) return

  try {
    await api.deleteOne(form.value.id)
    items.value = items.value.filter(x => x.id !== form.value.id)
    form.value = { id: undefined, nombre: '', descripcion: '', precio: 0.0, duracion_dias: 30 }

    Swal.fire('🗑️ Eliminada', 'La membresía se eliminó correctamente.', 'success')
  } catch (err) {
    Swal.fire('❌ Error', err.response?.data?.error || 'No se pudo eliminar la membresía.', 'error')
  }
}

onMounted(fetch)

// Imprimir solo la tabla de membresías filtradas
function imprimir() {
  const rows = items.value || []
  const css = `
    <style>
      body{font-family: Arial, Helvetica, sans-serif; color:#0b2338; margin:20px}
      h1{font-size:18px}
      table{width:100%;border-collapse:collapse;margin-top:10px}
      th,td{border:1px solid #ddd;padding:8px;text-align:left}
      th{background:#f4f6f8}
    </style>`

  const htmlRows = rows.map(r => `
    <tr>
      <td>${escapeHtml(r.nombre ?? '')}</td>
      <td>${escapeHtml(r.descripcion ?? '')}</td>
      <td>${escapeHtml(formatPrice(r.precio))}</td>
      <td>${escapeHtml(String(r.duracion_dias ?? ''))}</td>
    </tr>`).join('')

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Listado de Membresías</title>${css}</head><body>
    <h1>Listado de Membresías</h1>
    <table>
      <thead>
        <tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Duración (días)</th></tr>
      </thead>
      <tbody>
        ${htmlRows || '<tr><td colspan="4" style="text-align:center">No hay membresías</td></tr>'}
      </tbody>
    </table>
  </body></html>`

  const w = window.open('', '_blank')
  if (!w) {
    window.print()
    return
  }
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print() }, 300)
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
</script>
