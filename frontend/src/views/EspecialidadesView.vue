<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-06 — Especialidades</h2></template>
      <form class="row" @submit.prevent="onSave">
        <div>
          <label>Nombre</label>
          <input v-model="form.nombre" type="text" placeholder="Musculación" required />
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
        <thead><tr><th>Nombre</th></tr></thead>
        <tbody>
          <tr v-for="row in items" :key="row.id" @click="fill(row)" style="cursor:pointer">
            <td>{{ row.nombre }}</td>
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
import * as api from '../services/specialties.js'

const q = ref('')
const items = ref([])
const form = ref({ id: undefined, nombre: '' })

async function fetch() {
  items.value = await api.listAll({ q: q.value })
}

function clear() {
  q.value = ''
  fetch()
}

function fill(row) {
  form.value = { id: row.id, nombre: row.nombre }
}

async function onSave() {
  if (!form.value.nombre) {
    Swal.fire('Error', 'Ingrese el nombre de la especialidad.', 'error')
    return
  }
  const created = await api.createOne({ ...form.value, id: undefined })
  const nueva = created.especialidad || created
  await fetch()
  form.value = { id: undefined, nombre: '' }
  Swal.fire('Guardada', 'La especialidad fue creada correctamente.', 'success')
}

async function onUpdate() {
  if (!form.value.id) {
    Swal.fire('Error', 'Debe seleccionar una especialidad para modificar.', 'error')
    return
  }
  await api.updateOne(form.value.id, { nombre: form.value.nombre })
  await fetch()
  Swal.fire('Actualizada', 'La especialidad fue modificada correctamente.', 'success')
}

async function onDelete() {
  if (!form.value.id) {
    Swal.fire('Error', 'Debe seleccionar una especialidad para eliminar.', 'error')
    return
  }

  const result = await Swal.fire({
    title: '¿Eliminar especialidad?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  })

  if (result.isConfirmed) {
    await api.deleteOne(form.value.id)
    await fetch()
    form.value = { id: undefined, nombre: '' }
    Swal.fire('Eliminada', 'La especialidad fue eliminada correctamente.', 'success')
  }
}

onMounted(fetch)

function escapeHtml(str) {
  if (!str && str !== 0) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function imprimir() {
  // Solo imprimimos las filas actualmente visibles (items filtrados)
  const rowsHtml = items.value
    .map(r => `\n<tr><td>${escapeHtml(r.nombre)}</td></tr>`)
    .join('')

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Especialidades - Imprimir</title>
    <style>
      body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin:16px}
      table{border-collapse: collapse; width:100%}
      th,td{border:1px solid #ccc; padding:8px; text-align:left}
      thead th{background:#f6f6f6}
    </style>
  </head>
  <body>
    <h2>Especialidades</h2>
    <table>
      <thead><tr><th>Nombre</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <script>window.onload=function(){window.print(); setTimeout(()=>window.close(),500);}</script>
  </body>
</html>`

  const w = window.open('', '_blank', 'width=900,height=700')
  if (!w) {
    // Popup bloqueado: abrir en la misma ventana como fallback
    const win = window.open('', '_self')
    win.document.open()
    win.document.write(html)
    win.document.close()
  } else {
    w.document.open()
    w.document.write(html)
    w.document.close()
  }
}
</script>
