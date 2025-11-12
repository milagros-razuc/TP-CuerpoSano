<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-06 — Especialidades</h2></template>
      <form class="row" @submit.prevent="onSave">
        <div><label>Nombre</label><input v-model="form.nombre" type="text" placeholder="Musculación" required/></div>
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
import BaseCard from '../components/ui/BaseCard.vue'
import Toolbar from '../components/ui/Toolbar.vue'
import * as api from '../services/specialties.js'

const q = ref('')
const items = ref([])
const form = ref({ id: undefined, nombre: '' })

async function fetch(){
  items.value = await api.listAll({ q: q.value })
}

function clear(){ q.value=''; fetch() }

function fill(row){ form.value = { id: row.id, nombre: row.nombre } }

async function onSave(){
  if(!form.value.nombre) return alert('Ingrese nombre')
  const created = await api.createOne({ ...form.value, id: undefined })
  const nueva = created.membresia || created || created.especialidad || created
  // Si la API devuelve objeto anidado, hacemos fetch para asegurar lista actualizada
  await fetch()
  form.value = { id: undefined, nombre: '' }
}

async function onUpdate(){
  if(!form.value.id) return
  const upd = await api.updateOne(form.value.id, { nombre: form.value.nombre })
  await fetch()
}

async function onDelete(){
  if(!form.value.id) return
  await api.deleteOne(form.value.id)
  await fetch()
  form.value = { id: undefined, nombre: '' }
}

onMounted(fetch)
</script>
