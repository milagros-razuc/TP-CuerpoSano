<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-05 — Entrenadores</h2></template>
      <form class="row" @submit.prevent="onSave">
        <div><label>Nombre</label><input v-model="form.nombre" type="text" required/></div>
        <div><label>Apellido</label><input v-model="form.apellido" type="text" required/></div>
        <div><label>DNI</label><input v-model.number="form.dni" type="number" required/></div>
        <div><label>Email</label><input v-model="form.email" type="email" required/></div>
        <div><label>Teléfono</label><input v-model="form.telefono" type="text" placeholder=""/></div>

        <!-- Especialidades -->
        <div>
          <label>Especialidades</label>
          <div>
            <label v-for="e in specialties" :key="e.id" style="margin-right:10px">
              <input type="checkbox" :value="e.id" v-model="form.especialidades" /> {{ e.nombre }}
            </label>
          </div>
        </div>

        <!-- Certificaciones -->
        <div style="width:100%">
          <label>Certificaciones</label>
          <div
            v-for="(c, idx) in form.certificaciones"
            :key="idx"
            style="border:1px solid #eee;padding:8px;margin-bottom:6px"
          >
            <div>
              <strong>{{ c.nombre }}</strong> — {{ c.entidad_emisora }}
              ({{ c.fecha_emision }} → {{ c.fecha_vencimiento }})
            </div>
            <button class="btn" type="button" @click="removeCertification(idx)">Eliminar</button>
          </div>

          <div
            class="row"
            style="display:flex; gap:10px; flex-wrap:wrap; align-items:end; margin-top:8px;"
          >
            <div style="flex:1; min-width:150px;">
              <label>Nombre cert</label>
              <input v-model="newCert.nombre" type="text" placeholder="Nombre cert" required/>
            </div>
            <div style="flex:1; min-width:150px;">
              <label>Entidad</label>
              <input v-model="newCert.entidad_emisora" type="text" placeholder="Entidad" />
            </div>
            <div style="flex:1; min-width:150px;">
              <label>Emisión</label>
              <input v-model="newCert.fecha_emision" type="date" />
            </div>
            <div style="flex:1; min-width:150px;">
              <label>Vencimiento</label>
              <input v-model="newCert.fecha_vencimiento" type="date" />
            </div>
            <div>
              <button class="btn" type="button" @click="addCertification">Agregar</button>
            </div>
          </div>
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
          <tr><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Especialidades</th></tr>
        </thead>
        <tbody>
          <tr
            v-for="row in items"
            :key="row.id"
            @click="fill(row)"
            style="cursor:pointer"
          >
            <td>{{ row.nombre }}</td>
            <td>{{ row.apellido }}</td>
            <td>{{ row.telefono }}</td>
            <td>{{ row.especialidades ? row.especialidades.map(e=>e.nombre).join(', ') : '-' }}</td>
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
import * as api from '../services/trainers.js'
import * as specialtiesApi from '../services/specialties.js'

const q = ref('')
const items = ref([])
const specialties = ref([])
const form = ref({ nombre: '', apellido: '', dni: undefined, telefono: '', email: '', especialidades: [], certificaciones: [] })
const newCert = ref({ nombre: '', entidad_emisora: '', fecha_emision: '', fecha_vencimiento: '' })

async function fetch() { items.value = await api.listAll({ q: q.value }) }
function clear() { q.value = ''; fetch() }

async function loadSpecialties() { specialties.value = await specialtiesApi.listAll() }

function fill(row) {
  form.value = {
    id: row.id,
    nombre: row.nombre || '',
    apellido: row.apellido || '',
    dni: row.dni || undefined,
    telefono: row.telefono || '',
    email: row.email || '',
    especialidades: row.especialidades ? row.especialidades.map(e=>e.id) : [],
    certificaciones: row.certificaciones ? row.certificaciones.map(c=>({
      nombre: c.nombre, entidad_emisora: c.entidad_emisora,
      fecha_emision: c.fecha_emision, fecha_vencimiento: c.fecha_vencimiento
    })) : []
  }
}

function addCertification() {
  if (!newCert.value.nombre) {
    Swal.fire('Error', 'Ingrese nombre de la certificación', 'error')
    return
  }
  form.value.certificaciones.push({ ...newCert.value })
  newCert.value = { nombre: '', entidad_emisora: '', fecha_emision: '', fecha_vencimiento: '' }
  Swal.fire('Agregada', 'La certificación fue agregada correctamente.', 'success')
}

function removeCertification(idx) {
  const cert = form.value.certificaciones[idx]
  Swal.fire({
    title: '¿Eliminar certificación?',
    text: `¿Querés eliminar "${cert.nombre}"? Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then(result => {
    if (result.isConfirmed) {
      form.value.certificaciones.splice(idx, 1)
      Swal.fire('Eliminada', 'La certificación fue eliminada correctamente.', 'success')
    }
  })
}

async function onSave() {
  if (!form.value.nombre || !form.value.apellido || !form.value.dni || !form.value.telefono || !form.value.email) {
    Swal.fire('Error', 'Complete los campos obligatorios: nombre, apellido, DNI, teléfono y email.', 'error')
    return
  }

  const payload = {
    nombre: form.value.nombre,
    apellido: form.value.apellido,
    dni: Number(form.value.dni),
    telefono: form.value.telefono,
    email: form.value.email,
    especialidades: form.value.especialidades,
    certificaciones: form.value.certificaciones
  }

  const created = await api.createOne(payload)
  const nueva = created.entrenador || created
  await fetch()
  form.value = { nombre: '', apellido: '', dni: undefined, telefono: '', email: '', especialidades: [], certificaciones: [] }

  Swal.fire('Guardado', 'El entrenador fue creado correctamente.', 'success')
}

async function onUpdate() {
  if (!form.value.dni) {
    Swal.fire('Error', 'Debe seleccionar un entrenador para modificar.', 'error')
    return
  }

  const payload = {
    nombre: form.value.nombre,
    apellido: form.value.apellido,
    telefono: form.value.telefono,
    email: form.value.email,
    especialidades: form.value.especialidades,
    certificaciones: form.value.certificaciones
  }

  await api.updateOne(form.value.dni, payload)
  await fetch()

  Swal.fire('Actualizado', 'Los datos del entrenador fueron modificados correctamente.', 'success')
}

async function onDelete() {
  if (!form.value.dni) {
    Swal.fire('Error', 'Debe seleccionar un entrenador para eliminar.', 'error')
    return
  }

  const result = await Swal.fire({
    title: '¿Eliminar entrenador?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await api.deleteOne(form.value.dni)
    await fetch()
    form.value = { nombre: '', apellido: '', dni: undefined, telefono: '', email: '', especialidades: [], certificaciones: [] }
    Swal.fire('Eliminado', 'El entrenador fue eliminado correctamente.', 'success')
  }
}

onMounted(() => { fetch(); loadSpecialties() })

// Imprimir solo la tabla de entrenadores filtrados
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
      <td>${escapeHtml(r.apellido ?? '')}</td>
      <td>${escapeHtml(r.telefono ?? '')}</td>
      <td>${escapeHtml(r.especialidades ? r.especialidades.map(e=>e.nombre).join(', ') : '-')}</td>
    </tr>`).join('')

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Listado de Entrenadores</title>${css}</head><body>
    <h1>Listado de Entrenadores</h1>
    <table>
      <thead>
        <tr><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Especialidades</th></tr>
      </thead>
      <tbody>
        ${htmlRows || '<tr><td colspan="4" style="text-align:center">No hay entrenadores</td></tr>'}
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
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
</script>
