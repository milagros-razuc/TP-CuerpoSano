<template>

  <div class="grid">
    <BaseCard>
      <template #header>
        <h2>CU-01 — Registrar/Modificar Miembro</h2>
        <span class="chip" :class="miembro.activo ? 'ok' : 'err'">
          {{ miembro.activo ? 'Miembro Activo' : 'Miembro Inactivo' }}
        </span>
      </template>

      <div class="bd">
        <div class="state hide-on-print" v-if="mensaje">{{ mensaje }}</div>
        <div class="row">
          <div>
            <label>Nombre</label>
            <input type="text" v-model="miembro.nombre" placeholder="Ej.: Carla Gómez" />
          </div>
          <div>
            <label>Apellido</label>
            <input type="text" v-model="miembro.apellido" placeholder="Ej.: Gómez" />
          </div>
          <div>
            <label>Teléfono</label>
            <input type="text" v-model="miembro.telefono" placeholder="Ej.: +54 11 5555-5555" />
          </div>
          <div>
            <label>DNI</label>
            <input type="text" v-model="miembro.dni" placeholder="Ej.: 30123456" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" v-model="miembro.email" placeholder="Ej.: carla@dominio.com" />
          </div>
          <div>
            <label>Fecha de nacimiento</label>
            <input type="date" v-model="miembro.fecha_nacimiento" />
          </div>
          <div>
            <label>Tipo de membresía</label>
            <select v-model="miembro.tipo">
              <option value="">Seleccione...</option>
              <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.nombre }}</option>
            </select>
          </div>
          <div>
            <label>Fecha de registro</label>
            <input type="date" v-model="miembro.fecha_registro" />
          </div>
          <div>
            <label>Foto (URL opcional)</label>
            <input type="text" v-model="miembro.foto" placeholder="https://…" />
          </div>
          <div>
            <label>Métodos de identificación</label>
            <div>
              <label>
                <input type="checkbox" value="codigo_barras" v-model="miembro.metodo_identificacion" />
                Código de barras
              </label>
              <label>
                <input type="checkbox" value="huella" v-model="miembro.metodo_identificacion" />
                Huella digital
              </label>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="btn primary" @click="registrar">Registrar</button>
        <button class="btn" @click="modificar">Modificar</button>
        <button class="btn error" @click="eliminar">Eliminar</button>
      </template>
    </BaseCard>


    <BaseCard>
      <template #header>
        <h2>Consultar/Imprimir Miembros</h2>
        <Toolbar>
          <input v-model="buscar" type="text" placeholder="Buscar por nombre, DNI…" @input="cargarMiembros" />
          <button class="btn" @click="buscar = ''">Limpiar</button>
          <button class="btn" @click="imprimir">Imprimir listado</button>
        </Toolbar>
      </template>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Membresía</th>
            <th>Inicio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in miembrosFiltrados" :key="m.dni" @click="prefill(m)">
            <td>{{ m.nombreCompleto }}</td>
            <td>{{ m.dni }}</td>
            <td>{{ m.tipoNombre }}</td>
            <td>{{ m.fecha_registro }}</td>
          </tr>
        </tbody>
      </table>
    </BaseCard>
  </div>

  <div class="footer muted" style="margin-top:30px; text-align:center">
    © Cuerpo Sano
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import * as membersApi from '../services/members.js'
import * as membershipsApi from '../services/memberships.js'

import BaseCard from '../components/ui/BaseCard.vue'
import Toolbar from '../components/ui/Toolbar.vue'

const miembros = ref([])
const tipos = ref([])
const buscar = ref('')
const mensaje = ref('')
const hora = ref('—')

// Modelo
const miembro = ref({
  id: null,
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  email: '',
  fecha_nacimiento: '',
  fecha_registro: '',
  foto: '',
  activo: true,
  metodo_identificacion: [],
  tipo: ''
})

// Computado para filtro
const miembrosFiltrados = computed(() =>
  miembros.value.filter(m =>
    m.nombre.toLowerCase().includes(buscar.value.toLowerCase()) ||
    m.dni.toString().includes(buscar.value)
  )
)

// Carga inicial
onMounted(() => {
  cargarMembresias()
  cargarMiembros()
  setInterval(() => {
    const d = new Date()
    const pad = x => String(x).padStart(2, '0')
    hora.value = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }, 1000)
})

// Traer miembros
async function cargarMiembros() {
  try {
    const data = await membersApi.listAll({ q: buscar.value })
    miembros.value = data.map(m => ({
      ...m,
      nombreCompleto: `${m.nombre} ${m.apellido}`,
      tipo: m.membresias?.length ? (m.membresias[0].tipo?.id ?? m.membresias[0].tipo) : (m.tipo ?? ''),
      tipoNombre: m.membresias?.length ? (m.membresias[0].tipo?.nombre ?? m.membresias[0].tipo) : (m.tipoNombre ?? '')
    }))
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los miembros', 'error')
    console.error(error)
  }
}

// Traer tipos de membresía
async function cargarMembresias() {
  try {
    tipos.value = await membershipsApi.listAll()
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los tipos de membresía', 'error')
  }
}

// Registrar
async function registrar() {
  if (!miembro.value.nombre || !miembro.value.apellido || !miembro.value.dni || !miembro.value.tipo) {
    return Swal.fire('Campos incompletos', 'Complete todos los campos obligatorios', 'warning')
  }

  try {
    const result = await membersApi.createOne(miembro.value)
    await Swal.fire('Éxito', 'Miembro registrado correctamente', 'success')
    await cargarMiembros()
    limpiar()
  } catch (error) {
    if (error.response?.status === 409) {
      Swal.fire('Duplicado', 'Ya existe un miembro con ese DNI', 'error')
    } else if (error.response?.data?.detalles) {
      Swal.fire('Error de validación', error.response.data.detalles.join('<br>'), 'error')
    } else {
      Swal.fire('Error', 'No se pudo crear el miembro', 'error')
    }
    console.error(error)
  }
}

// Modificar
async function modificar() {
  if (!miembro.value.id) return Swal.fire('Atención', 'Seleccione un miembro para modificar', 'info')

  try {
    await membersApi.updateOne(miembro.value.id, miembro.value)
    await Swal.fire('Éxito', 'Miembro actualizado correctamente', 'success')
    await cargarMiembros()
    limpiar()
  } catch (error) {
    Swal.fire('Error', 'No se pudo actualizar el miembro', 'error')
    console.error(error)
  }
}

// Eliminar (desactivar)
async function eliminar() {
  if (!miembro.value.id) return Swal.fire('Seleccione un miembro', '', 'info')

  const confirm = await Swal.fire({
    title: `¿Desactivar a ${miembro.value.nombre}?`,
    text: 'El miembro y su membresía quedarán inactivos.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  })

  if (!confirm.isConfirmed) return

  try {
    await membersApi.deleteOne(miembro.value.id)
    await Swal.fire('Hecho', 'Miembro desactivado correctamente', 'success')
    await cargarMiembros()
    limpiar()
  } catch (error) {
    Swal.fire('Error', 'No se pudo desactivar el miembro', 'error')
    console.error(error)
  }
}

// Prefill
function prefill(m) {
  miembro.value = {
    id: m.id,
    nombre: m.nombre,
    apellido: m.apellido,
    dni: m.dni,
    telefono: m.telefono,
    email: m.email,
    fecha_nacimiento: m.fecha_nacimiento,
    fecha_registro: m.fecha_registro,
    foto: m.foto,
    activo: m.activo,
    metodo_identificacion: Array.isArray(m.metodo_identificacion) ? m.metodo_identificacion : [m.metodo_identificacion],
    tipo: m.tipo
  }
}

// Limpiar
function limpiar() {
  miembro.value = {
    id: null,
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    fecha_nacimiento: '',
    fecha_registro: '',
    foto: '',
    activo: true,
    metodo_identificacion: [],
    tipo: ''
  }
}

// Imprimir
function imprimir() {
  // Imprimir solo la tabla de miembros filtrados: abrimos una ventana nueva con HTML minimal
  const rows = miembrosFiltrados.value || []
  const css = `
    <style>
      body{font-family: Arial, Helvetica, sans-serif; color:#0b2338; margin:20px}
      h1{font-size:18px}
      table{width:100%;border-collapse:collapse;margin-top:10px}
      th,td{border:1px solid #ddd;padding:8px;text-align:left}
      th{background:#f4f6f8}
    </style>`

  const htmlRows = rows.map(m => `
    <tr>
      <td>${escapeHtml(m.nombreCompleto ?? (m.nombre + ' ' + (m.apellido||'')).trim())}</td>
      <td>${escapeHtml(String(m.dni ?? ''))}</td>
      <td>${escapeHtml(m.tipoNombre ?? '')}</td>
      <td>${escapeHtml(m.fecha_registro ?? '')}</td>
    </tr>`).join('')

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Listado de Miembros</title>${css}</head><body>
    <h1>Listado de Miembros</h1>
    <table>
      <thead>
        <tr><th>Nombre</th><th>DNI</th><th>Membresía</th><th>Inicio</th></tr>
      </thead>
      <tbody>
        ${htmlRows || '<tr><td colspan="4" style="text-align:center">No hay miembros</td></tr>'}
      </tbody>
    </table>
  </body></html>`

  const w = window.open('', '_blank')
  if (!w) {
    // Fallback: imprimir la página actual
    window.print()
    return
  }
  w.document.write(html)
  w.document.close()
  w.focus()
  // delay para asegurar renderizado
  setTimeout(() => {
    w.print()
    // no forzamos el cierre inmediato por compatibilidad
  }, 300)
}

// Helper para evitar inyección HTML al insertar texto
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
</script>



<style>
:root {
  --bg: #1a3558;
  --panel: #244d8f;
  --panel-2: #2b3e6f;
  --ink: #e9edf1;
  --muted: #9aa6b2;
  --primary: #4da3ff;
  --ok: #22c55e;
  --err: #ef4444;
  --warn: #f59e0b;
  --bd: #2b3e6f;
  --radius: 14px;
  --radius-sm: 10px;
  --gap: 14px;
  --shadow: 0 10px 30px rgba(0, 0, 0, .35);
}

* {
  box-sizing: border-box
}

html,
body {
  height: 100%
}

.miembros-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #1e3a70, #2e4a8c 30%, #3a5eb0 100%);
}


body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
  background: linear-gradient(180deg, #2e4a7c, #3b5e95 30%, #4a70b0 100%);
  /*background: linear-gradient(180deg,#2d4072,#344463 30%, #f6f7f9 100%);*/
  color: var(--ink);
}

header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(8px);
  background: rgba(26, 43, 78, 0.7);
  border-bottom: 1px solid var(--bd);
}

.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px
}

.brand .logo {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, #4da3ff, #7c3aed);
  display: grid;
  place-items: center;
  box-shadow: var(--shadow)
}

.brand h1 {
  font-size: 18px;
  margin: 0
}

.sub {
  color: var(--muted);
  font-size: 13px
}

.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 10px 16px 16px;
}

.tab {
  border: 1px solid var(--bd);
  color: var(--ink);
  background: var(--panel);
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: .2s;
  font-size: 14px;
  user-select: none
}

.tab[aria-selected="true"] {
  background: var(--primary);
  border-color: transparent;
  color: #163651;
  font-weight: 600
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px 60px
}

.grid {
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: var(--gap)
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr
  }
}

.card {
  background: linear-gradient(180deg, rgba(28, 43, 87, 0.9), rgba(28, 39, 70, 0.75));
  border: 1px solid var(--bd);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.card .hd {
  padding: 16px 18px;
  border-bottom: 1px solid var(--bd);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px
}

.card .hd h2 {
  margin: 0;
  font-size: 16px
}

.card .bd {
  padding: 16px 18px
}

.card .ft {
  padding: 12px 18px;
  border-top: 1px solid var(--bd);
  display: flex;
  gap: 10px;
  flex-wrap: wrap
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap)
}

@media (max-width: 720px) {
  .row {
    grid-template-columns: 1fr
  }
}

label {
  font-size: 13px;
  color: var(--muted);
  display: block;
  margin-bottom: 6px
}

input[type="text"],
input[type="email"],
input[type="date"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 12px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--bd);
  background: var(--panel-2);
  color: var(--ink);
  outline: none;
  transition: .2s;
}

textarea {
  min-height: 90px;
  resize: vertical
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(77, 163, 255, .15);
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--bd);
  background: var(--panel-2);
  color: var(--ink);
  cursor: pointer;
  transition: .2s;
  font-weight: 600;
  font-size: 14px
}

.btn:hover {
  transform: translateY(-1px)
}

.btn.primary {
  background: var(--primary);
  color: #061019;
  border-color: transparent
}

.btn.ghost {
  background: transparent
}

.btn.warn {
  background: var(--warn);
  color: #111
}

.btn.error {
  background: var(--err)
}

.btn.ok {
  background: var(--ok);
  color: #071018
}

.inline {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center
}

.muted {
  color: var(--muted)
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--panel-2);
  border: 1px solid var(--bd);
  border-radius: 999px;
  font-size: 12px
}

.chip.ok {
  border-color: #234a35;
  background: #12261b;
  color: #7ee2a6
}

.chip.err {
  border-color: #4a2323;
  background: #261212;
  color: #f2a3a3
}

.chip.warn {
  border-color: #4a3b23;
  background: #261e12;
  color: #f6d28f
}

.sep {
  height: 1px;
  background: var(--bd);
  margin: 12px 0
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--bd);
  text-align: left
}

th {
  color: #cbd5e1;
  font-weight: 600
}

tbody tr:hover {
  background: rgba(255, 255, 255, .03)
}

.state {
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--bd);
  background: var(--panel-2);
  margin-bottom: 12px
}

.state.ok {
  border-color: #234a35;
  background: #12261b
}

.state.err {
  border-color: #4a2323;
  background: #261212
}

.state .title {
  font-weight: 700
}

.hide {
  display: none
}

.print-only {
  display: none
}

@media print {

  header,
  .tabs,
  .btn,
  .state.hide-on-print,
  .footer {
    display: none !important
  }

  .print-only {
    display: block
  }

  body {
    background: #fff;
    color: #000
  }

  .card {
    box-shadow: none;
    border: 1px solid #ddd
  }
}
</style>
