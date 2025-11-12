<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-04 — Actividades</h2></template>
      <form class="row" @submit.prevent="onSave">
        <div><label>Nombre</label><input v-model="form.nombre" type="text" placeholder="Spinning" required/></div>
        <div><label>Descripción</label><input v-model="form.descripcion" type="text" placeholder="Alta intensidad"/></div>
        <div>
          <label>Nivel de dificultad</label>
          <select v-model="form.nivel_dificultad" required>
            <option value="bajo">Bajo</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
          </select>
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
          <input v-model="q" type="text" placeholder="Buscar..." @input="fetch">
          <button class="btn" @click="clear">Limpiar</button>
          <button class="btn" @click="imprimir">Imprimir</button>
        </Toolbar>
      </template>
      <table class="table">
        <thead>
          <tr><th>Nombre</th><th>Descripción</th><th>Nivel</th></tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id" @click="fill(row)" style="cursor:pointer">
            <td>{{ row.nombre }}</td>
            <td>{{ row.descripcion }}</td>
            <td>{{ row.nivel_dificultad || '-' }}</td>
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
import * as api from '../services/activities.js'

const q = ref('')
const items = ref([])
const form = ref({ nombre: '', descripcion: '', nivel_dificultad: 'bajo' })

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
    nombre: row.nombre ?? '',
    descripcion: row.descripcion ?? '',
    nivel_dificultad: row.nivel_dificultad ?? 'bajo'
  }
}

async function onSave() {
  if (!form.value.nombre) {
    Swal.fire('Error', 'El nombre es obligatorio', 'error')
    return
  }

  const created = await api.createOne({ ...form.value, id: undefined })
  const nueva = created.actividad || created
  items.value.unshift(nueva)
  form.value = { nombre: '', descripcion: '', nivel_dificultad: 'bajo' }

  Swal.fire('¡Guardado!', 'La actividad fue creada correctamente.', 'success')
}

async function onUpdate() {
  if (!form.value.id) return
  const upd = await api.updateOne(form.value.id, { ...form.value })
  const updated = upd.actividad || upd
  const i = items.value.findIndex(x => x.id === updated.id)
  if (i > -1) items.value[i] = updated

  Swal.fire('¡Actualizado!', 'Los datos de la actividad fueron modificados.', 'success')
}

async function onDelete() {
  if (!form.value.id) return

  const result = await Swal.fire({
    title: '¿Eliminar actividad?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await api.deleteOne(form.value.id)
    items.value = items.value.filter(x => x.id !== form.value.id)
    form.value = { nombre: '', descripcion: '', nivel_dificultad: 'bajo' }

    Swal.fire('Eliminado', 'La actividad fue eliminada correctamente.', 'success')
  }
}

onMounted(fetch)

// Imprimir solo la tabla de actividades filtradas
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
      <td>${escapeHtml(r.nivel_dificultad ?? '')}</td>
    </tr>`).join('')

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Listado de Actividades</title>${css}</head><body>
    <h1>Listado de Actividades</h1>
    <table>
      <thead>
        <tr><th>Nombre</th><th>Descripción</th><th>Nivel</th></tr>
      </thead>
      <tbody>
        ${htmlRows || '<tr><td colspan="3" style="text-align:center">No hay actividades</td></tr>'}
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
