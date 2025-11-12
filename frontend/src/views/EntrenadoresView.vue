<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-05 — Entrenadores</h2></template>
      <form class="row" @submit.prevent="onSave">
        <div><label>Nombre</label><input v-model="form.nombre" type="text" placeholder="" required/></div>
        <div><label>Apellido</label><input v-model="form.apellido" type="text" placeholder="" required/></div>
        <div><label>DNI</label><input v-model.number="form.dni" type="number" placeholder="" required/></div>
        <div><label>Email</label><input v-model="form.email" type="email" placeholder="" required/></div>
        <div><label>Teléfono</label><input v-model="form.telefono" type="text" placeholder=""/></div>

        <!-- Especialidades: multi-select -->
        <div>
          <label>Especialidades</label>
          <div>
            <label v-for="e in specialties" :key="e.id" style="margin-right:10px">
              <input type="checkbox" :value="e.id" v-model="form.especialidades" /> {{ e.nombre }}
            </label>
          </div>
        </div>

        <!-- Certificaciones: subform -->
        <div style="width:100%">
          <label>Certificaciones</label>
          <div v-for="(c, idx) in form.certificaciones" :key="idx" style="border:1px solid #eee;padding:8px;margin-bottom:6px">
            <div><strong>{{ c.nombre }}</strong> — {{ c.entidad_emisora }} ({{ c.fecha_emision }} → {{ c.fecha_vencimiento }})</div>
            <button class="btn" type="button" @click="removeCertification(idx)">Eliminar</button>
          </div>
          <div class="row">
            <input v-model="newCert.nombre" placeholder="Nombre cert" />
            <input v-model="newCert.entidad_emisora" placeholder="Entidad" />
            <input v-model="newCert.fecha_emision" type="date" />
            <input v-model="newCert.fecha_vencimiento" type="date" />
            <button class="btn" type="button" @click="addCertification">Agregar</button>
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
          <input v-model="q" type="text" placeholder="Buscar..." @input="fetch">
          <button class="btn" @click="clear">Limpiar</button>
          <button class="btn" @click="window.print()">Imprimir</button>
        </Toolbar>
      </template>
      <table class="table">
        <thead><tr><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Especialidades</th></tr></thead>
        <tbody>
          <tr v-for="row in items" :key="row.id" @click="fill(row)" style="cursor:pointer">
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
import BaseCard from '../components/ui/BaseCard.vue'
import Toolbar from '../components/ui/Toolbar.vue'
import * as api from '../services/trainers.js'
import * as specialtiesApi from '../services/specialties.js'
const q = ref('')
const items = ref([])
const specialties = ref([])
const form = ref({ nombre: '', apellido: '', dni: undefined, telefono: '', email: '', especialidades: [], certificaciones: [] })
const newCert = ref({ nombre: '', entidad_emisora: '', fecha_emision: '', fecha_vencimiento: '' })

async function fetch(){ items.value = await api.listAll({ q: q.value }) }
function clear(){ q.value=''; fetch() }
function fill(row){
  form.value = {
    id: row.id,
    nombre: row.nombre || '',
    apellido: row.apellido || '',
    dni: row.dni || undefined,
    telefono: row.telefono || '',
    email: row.email || '',
    especialidades: row.especialidades ? row.especialidades.map(e=>e.id) : [],
    certificaciones: row.certificaciones ? row.certificaciones.map(c=>({ nombre: c.nombre, entidad_emisora: c.entidad_emisora, fecha_emision: c.fecha_emision, fecha_vencimiento: c.fecha_vencimiento })) : []
  }
}

async function loadSpecialties(){ specialties.value = await specialtiesApi.listAll() }

function addCertification(){
  if(!newCert.value.nombre) return alert('Ingrese nombre de la certificación')
  form.value.certificaciones.push({ ...newCert.value })
  newCert.value = { nombre: '', entidad_emisora: '', fecha_emision: '', fecha_vencimiento: '' }
}

function removeCertification(idx){ form.value.certificaciones.splice(idx,1) }

async function onSave(){
  // backend requiere nombre, apellido, dni, telefono, email
  if(!form.value.nombre || !form.value.apellido || !form.value.dni || !form.value.telefono || !form.value.email) {
    return alert('Complete los campos obligatorios: nombre, apellido, dni, teléfono y email')
  }
  const payload = {
    nombre: form.value.nombre,
    apellido: form.value.apellido,
    dni: Number(form.value.dni),
    telefono: form.value.telefono,
    email: form.value.email,
    especialidades: Array.isArray(form.value.especialidades) ? form.value.especialidades : [],
    certificaciones: Array.isArray(form.value.certificaciones) ? form.value.certificaciones : []
  }
  const created = await api.createOne(payload)
  const nueva = created.entrenador || created
  // refrescar lista
  await fetch()
  form.value = { nombre: '', apellido: '', dni: undefined, telefono: '', email: '', especialidades: [], certificaciones: [] }
}

async function onUpdate(){
  if(!form.value.dni) return alert('DNI es requerido para actualizar')
  const payload = {
    nombre: form.value.nombre,
    apellido: form.value.apellido,
    telefono: form.value.telefono,
    email: form.value.email,
    especialidades: Array.isArray(form.value.especialidades) ? form.value.especialidades : [],
    certificaciones: Array.isArray(form.value.certificaciones) ? form.value.certificaciones : []
  }
  const upd = await api.updateOne(form.value.dni, payload)
  await fetch()
}

async function onDelete(){
  if(!form.value.dni) return alert('DNI es requerido para eliminar')
  await api.deleteOne(form.value.dni)
  await fetch()
  form.value = { nombre: '', apellido: '', dni: undefined, telefono: '', email: '', especialidades: [], certificaciones: [] }
}

onMounted(()=>{ fetch(); loadSpecialties() })
</script>
