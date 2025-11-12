<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-03 — Clases</h2></template>

      <form class="row" @submit.prevent="onSave">
        <div><label>Nombre</label><input v-model="form.nombre" type="text" placeholder="Funcional" /></div>
        <div><label>Descripción</label><input v-model="form.descripcion" type="text" placeholder="Nivel inicial" /></div>

        <div>
          <label>Días</label>
          <div class="chips">
            <label v-for="d in daysList" :key="d" style="margin-right:8px">
              <input type="checkbox" :value="d" v-model="form.dias" /> {{ d }}
            </label>
          </div>
        </div>

        <div><label>Hora</label><input v-model="form.hora" type="text" placeholder="18:00" required /></div>
        <div><label>Duración (min)</label><input v-model.number="form.duracion_minutos" type="number" min="1" placeholder="60" required /></div>
        <div><label>Cupo</label><input v-model.number="form.cupo" type="number" min="1" placeholder="20" required /></div>

        <div>
          <label>Entrenador</label>
          <select v-model.number="form.id_entrenador" required>
            <option :value="undefined">Seleccionar...</option>
            <option v-for="t in trainers" :key="t.id" :value="t.id">{{ t.nombre }} {{ t.apellido }}</option>
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
          <input v-model="q" type="text" placeholder="Buscar..." @input="fetch" />
          <button class="btn" @click="clear">Limpiar</button>
          <button class="btn" @click="imprimir">Imprimir</button>
        </Toolbar>
      </template>

      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Días</th>
            <th>Hora</th>
            <th>Cupo</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in items"
            :key="row.id"
            @click="fill(row)"
            style="cursor:pointer"
          >
            <td>{{ row.nombre }}</td>
            <td>{{ (row.dias && row.dias.length) ? row.dias.join(', ') : '-' }}</td>
            <td>{{ row.hora_inicio || row.hora }}</td>
            <td>{{ row.cupo_maximo || row.cupo }}</td>
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
import * as api from '../services/classes.js'
import * as trainersApi from '../services/trainers.js'

const daysList = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const q = ref('')
const items = ref([])
const trainers = ref([])
const form = ref({
  id: undefined,
  nombre: '',
  descripcion: '',
  dias: [],
  hora: '',
  duracion_minutos: 60,
  cupo: 20,
  id_entrenador: undefined
})

// 🔹 Cargar datos
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
    dias: row.dias ? [...row.dias] : [],
    hora: row.hora_inicio || row.hora || '',
    duracion_minutos: row.duracion_minutos ?? 60,
    cupo: row.cupo_maximo ?? row.cupo ?? 20,
    id_entrenador: row.id_entrenador ?? undefined
  }
}
async function loadTrainers() {
  trainers.value = await trainersApi.listAll()
}

// 🔹 Guardar clase
async function onSave() {
  if (!form.value.nombre || !form.value.hora || !form.value.id_entrenador || !form.value.dias.length) {
    Swal.fire('⚠️ Campos incompletos', 'Completá todos los campos obligatorios (nombre, hora, entrenador y días).', 'warning')
    return
  }

  try {
    const payload = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      hora_inicio: form.value.hora,
      duracion_minutos: Number(form.value.duracion_minutos),
      cupo_maximo: Number(form.value.cupo),
      id_entrenador: Number(form.value.id_entrenador),
      dias: form.value.dias
    }

    const created = await api.createOne(payload)
    const nueva = created.clase || created
    items.value.unshift(nueva)
    form.value = { id: undefined, nombre: '', descripcion: '', dias: [], hora: '', duracion_minutos: 60, cupo: 20, id_entrenador: undefined }

    Swal.fire('✅ Guardado', 'La clase se creó exitosamente.', 'success')
  } catch (err) {
    Swal.fire('❌ Error', err.response?.data?.error || 'No se pudo crear la clase.', 'error')
  }
}

// 🔹 Modificar clase
async function onUpdate() {
  if (!form.value.id) return
  if (!form.value.dias.length) {
    Swal.fire('⚠️ Días faltantes', 'Seleccioná al menos un día.', 'warning')
    return
  }

  try {
    const payload = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      hora_inicio: form.value.hora,
      duracion_minutos: Number(form.value.duracion_minutos),
      cupo_maximo: Number(form.value.cupo),
      id_entrenador: Number(form.value.id_entrenador),
      dias: form.value.dias
    }

    const upd = await api.updateOne(form.value.id, payload)
    const updated = upd.clase || upd
    const i = items.value.findIndex(x => x.id === updated.id)
    if (i > -1) items.value[i] = updated

    Swal.fire('✅ Actualizado', 'La clase fue modificada correctamente.', 'success')
  } catch (err) {
    Swal.fire('❌ Error', err.response?.data?.error || 'No se pudo modificar la clase.', 'error')
  }
}

// 🔹 Eliminar clase con confirmación
async function onDelete() {
  if (!form.value.id) return

  const confirm = await Swal.fire({
    title: '¿Eliminar clase?',
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
    form.value = { id: undefined, nombre: '', descripcion: '', dias: [], hora: '', duracion_minutos: 60, cupo: 20, id_entrenador: undefined }

    Swal.fire('🗑️ Eliminada', 'La clase se eliminó correctamente.', 'success')
  } catch (err) {
    Swal.fire('❌ Error', err.response?.data?.error || 'No se pudo eliminar la clase.', 'error')
  }
}

onMounted(() => {
  fetch()
  loadTrainers()
})

// Imprimir solo la tabla de clases filtradas
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
      <td>${escapeHtml((r.dias && r.dias.length) ? r.dias.join(', ') : '-')}</td>
      <td>${escapeHtml(r.hora_inicio || r.hora || '')}</td>
      <td>${escapeHtml(String(r.cupo_maximo ?? r.cupo ?? ''))}</td>
    </tr>`).join('')

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Listado de Clases</title>${css}</head><body>
    <h1>Listado de Clases</h1>
    <table>
      <thead>
        <tr><th>Nombre</th><th>Días</th><th>Hora</th><th>Cupo</th></tr>
      </thead>
      <tbody>
        ${htmlRows || '<tr><td colspan="4" style="text-align:center">No hay clases</td></tr>'}
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
