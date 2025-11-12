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
          <button class="btn" @click="window.print()">Imprimir</button>
        </Toolbar>
      </template>
      <table class="table">
        <thead><tr><th>Nombre</th><th>Descripción</th><th>Nivel</th></tr></thead>
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
import BaseCard from '../components/ui/BaseCard.vue'
import Toolbar from '../components/ui/Toolbar.vue'
import * as api from '../services/activities.js'
const q = ref('')
const items = ref([])
// default difficulty level set to 'medio'
const form = ref({ nombre: '', descripcion: '', nivel_dificultad: 'bajo' })
async function fetch(){ items.value = await api.listAll({ q: q.value }) }
function clear(){ q.value=''; fetch() }
function fill(row){
  form.value = {
    id: row.id,
    nombre: row.nombre ?? '',
    descripcion: row.descripcion ?? '',
    nivel_dificultad: row.nivel_dificultad ?? 'bajo'
  }
}
async function onSave(){
  const created = await api.createOne({ ...form.value, id: undefined });
  // controller returns { message, actividad }
  const nueva = created.actividad || created
  items.value.unshift(nueva);
  form.value = { nombre: '', descripcion: '', nivel_dificultad: 'bajo' }
}
async function onUpdate(){
  if(!form.value.id) return;
  const upd = await api.updateOne(form.value.id, { ...form.value });
  const updated = upd.actividad || upd
  const i = items.value.findIndex(x=>x.id===updated.id); if(i>-1) items.value[i]=updated
}
async function onDelete(){ if(!form.value.id) return; await api.deleteOne(form.value.id); items.value = items.value.filter(x=>x.id!==form.value.id); form.value = { nombre: '', descripcion: '', nivel_dificultad: 'medio' } }
onMounted(fetch)
</script>
