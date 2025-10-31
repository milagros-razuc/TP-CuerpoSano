<template>
  <div class="miembros-view">
  <main>
    <Header title="Cuerpo Sano — Especificación" subtitle="INGENIERIA DE SOFTWARE II. QUINTA ENTREGA." />
      <nav class="tabs wrap" role="tablist" aria-label="Casos de uso">
        <button class="tab" role="tab" :aria-selected="activeTab==='cu01'" @click="activeTab='cu01'">CU-01 Miembros</button>
        <button class="tab" role="tab" :aria-selected="activeTab==='cu02'" @click="activeTab='cu02'">CU-02 Membresías</button>
        <button class="tab" role="tab" :aria-selected="activeTab==='cu03'" @click="activeTab='cu03'">CU-03 Clases</button>
        <button class="tab" role="tab" :aria-selected="activeTab==='cu04'" @click="activeTab='cu04'">CU-04 Actividades</button>
        <button class="tab" role="tab" :aria-selected="activeTab==='cu05'" @click="activeTab='cu05'">CU-05 Entrenadores</button>
        <button class="tab" role="tab" :aria-selected="activeTab==='cu06'" @click="activeTab='cu06'">CU-06 Asistencia</button>
        <button class="tab" role="tab" :aria-selected="activeTab==='cu07'" @click="activeTab='cu07'">CU-07 Pagos y Reportes</button>
      </nav>

    <!-- CU-01: Gestión de Miembros -->
    <div class="wrap">
    <section v-if="activeTab==='cu01'" class="view">
      <div class="grid">
        <div class="card">
          <div class="hd">
            <h2>CU-01 — Registrar/Modificar Miembro</h2>
           <span class="chip" :class="miembro.activo ? 'ok' : 'err'">
            {{ miembro.activo ? 'Miembro Activo' : 'Miembro Inactivo' }}
            </span>
          </div>
          <div class="bd">
            <div class="state hide-on-print" v-if="mensaje">{{ mensaje }}</div>
            <div class="row">
              <div>
                <label>Nombre</label>
                <input type="text" v-model="miembro.nombre"  placeholder="Ej.: Carla Gómez" />
              </div>
              <div>
                <label>Apellido</label>
                <input
                  type="text"
                  v-model="miembro.apellido"
                  placeholder="Ej.: Gómez"
                />
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
          <div class="ft">
            <button class="btn primary" @click="registrar">Registrar</button>
            <button class="btn" @click="modificar">Modificar</button>
            <button class="btn error" @click="eliminar">Eliminar</button>
          </div>
          
        </div>
        

        <div class="card">
          <div class="hd">
            <h2>Consultar/Imprimir Miembros</h2>
            <div class="inline">
              <input type="text" v-model="buscar" placeholder="Buscar por nombre, DNI…" />
              <button class="btn" @click="buscar=''">Limpiar</button>
              <button class="btn" @click="imprimir">Imprimir listado</button>
            </div>
          </div>
          <div class="bd">
            <table>
              <thead>
                <tr><th>Nombre</th><th>DNI</th><th>Membresía</th><th>Inicio</th></tr>
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
          </div>
        </div>
      </div>
    </section>
    </div>

    <div class="footer muted" style="margin-top:30px; text-align:center">
      © Cuerpo Sano
    </div>
  </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Header from '../components/Header.vue'

const API = import.meta.env.VITE_API_URL

const hora = ref('—')
const miembros = ref([])
const tipos = ref([])
const buscar = ref('')
const mensaje = ref('')
const activeTab = ref('cu01')

// Modelo de miembro con todos los campos
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

// Filtrado de miembros para la tabla
const miembrosFiltrados = computed(() =>
  miembros.value.filter(m =>
    m.nombre.toLowerCase().includes(buscar.value.toLowerCase()) ||
    m.dni.toString().includes(buscar.value)
  )
)

onMounted(() => {
  // Reloj
  setInterval(() => {
    const d = new Date()
    const pad = x => String(x).padStart(2, '0')
    hora.value = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }, 1000)

  cargarMembresias()
  cargarMiembros()
})

// Traer miembros desde la API
async function cargarMiembros() {
  const res = await axios.get(`${API}/miembros`)
  miembros.value = res.data.map(m => ({
    ...m,
    nombreCompleto: `${m.nombre} ${m.apellido}`,
    tipo: m.membresias.length ? m.membresias[0].tipo?.id : '',
    tipoNombre: m.membresias.length ? m.membresias[0].tipo?.nombre : ''
  }))
}

// Traer tipos de membresía
async function cargarMembresias() {
  const res = await axios.get(`${API}/TipoMembresias`)
  tipos.value = res.data
}

// Registrar
async function registrar() {
  try {
  if (!miembro.value.nombre || !miembro.value.apellido || !miembro.value.dni || !miembro.value.tipo)
    return alert('Complete los campos obligatorios')

  await axios.post(`${API}/miembros`, miembro.value)
  await cargarMiembros()
  limpiar()
  }catch (error) {
    if (error.response && error.response.data?.detalles) {
      // Muestra los errores de validación del backend
      alert('Errores: ' + error.response.data.detalles.join(', '));
    } else {
      alert('No se pudo crear el miembro');
      console.error(error);
   }
  }
}
// Modificar
async function modificar() {
  if (!miembro.value.dni) return alert('Seleccione un miembro')
  await axios.put(`${API}/miembros/${miembro.value.dni}`, miembro.value)
  await cargarMiembros()
  limpiar()
}

// Eliminar
async function eliminar() {
  if (!miembro.value.dni) return alert('Seleccione un miembro')
  if (!confirm(`¿Eliminar a ${miembro.value.nombre}?`)) return
  await axios.delete(`${API}/miembros/${miembro.value.dni}`)
  await cargarMiembros()
  limpiar()
}

// Prefill formulario al seleccionar de la tabla
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

// Limpiar formulario
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

// Imprimir listado
function imprimir() {
  window.print()
}
</script>


<style>
:root{
      --bg:#1a3558; --panel:#244d8f; --panel-2:#2b3e6f; --ink:#e9edf1; --muted:#9aa6b2;
      --primary:#4da3ff; --ok:#22c55e; --err:#ef4444; --warn:#f59e0b; --bd:#2b3e6f;
      --radius:14px; --radius-sm:10px; --gap:14px; --shadow:0 10px 30px rgba(0,0,0,.35);
    }
    *{box-sizing:border-box}
    html,body{height:100%}

    .miembros-view {
      min-height: 100vh;
      background: linear-gradient(180deg, #1e3a70, #2e4a8c 30%, #3a5eb0 100%);
    }


    body{
      margin:0; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
      background: linear-gradient(180deg, #2e4a7c, #3b5e95 30%, #4a70b0 100%);
      /*background: linear-gradient(180deg,#2d4072,#344463 30%, #f6f7f9 100%);*/
      color:var(--ink);
    }
    header{
      position:sticky; top:0; z-index:20; backdrop-filter: blur(8px);
      background: rgba(26, 43, 78, 0.7); border-bottom:1px solid var(--bd);
    }
    .wrap{max-width:1200px; margin:0 auto; padding:16px}
    .brand{display:flex; align-items:center; gap:10px}
    .brand .logo{width:36px; height:36px; border-radius:9px; background:linear-gradient(135deg,#4da3ff,#7c3aed); display:grid; place-items:center; box-shadow: var(--shadow)}
    .brand h1{font-size:18px; margin:0}
    .sub{color:var(--muted); font-size:13px}

    .tabs{
      display:flex; gap:8px; flex-wrap:wrap; padding:10px 16px 16px;
    }
    .tab{
      border:1px solid var(--bd); color:var(--ink); background:var(--panel);
      padding:10px 14px; border-radius:999px; cursor:pointer; transition:.2s;
      font-size:14px; user-select:none
    }
    .tab[aria-selected="true"]{background:var(--primary); border-color:transparent; color:#163651; font-weight:600}
    .container{max-width:1200px; margin:20px auto; padding:0 16px 60px}
    .grid{display:grid; grid-template-columns: 1.2fr .8fr; gap: var(--gap)}
    @media (max-width: 980px){ .grid{grid-template-columns:1fr} }

    .card{
      background:linear-gradient(180deg, rgba(28, 43, 87, 0.9), rgba(28, 39, 70, 0.75));
      border:1px solid var(--bd); border-radius: var(--radius); box-shadow: var(--shadow);
    }
    .card .hd{
      padding:16px 18px; border-bottom:1px solid var(--bd); display:flex; align-items:center; justify-content:space-between; gap:12px
    }
    .card .hd h2{margin:0; font-size:16px}
    .card .bd{padding:16px 18px}
    .card .ft{padding:12px 18px; border-top:1px solid var(--bd); display:flex; gap:10px; flex-wrap:wrap}

    .row{display:grid; grid-template-columns:1fr 1fr; gap:var(--gap)}
    @media (max-width: 720px){ .row{grid-template-columns:1fr} }

    label{font-size:13px; color:var(--muted); display:block; margin-bottom:6px}
    input[type="text"], input[type="email"], input[type="date"], input[type="number"], select, textarea{
      width:100%; padding:12px 12px; border-radius: var(--radius-sm); border:1px solid var(--bd);
      background:var(--panel-2); color:var(--ink); outline:none; transition:.2s;
    }
    textarea{min-height:90px; resize:vertical}
    input:focus, select:focus, textarea:focus{border-color: var(--primary); box-shadow: 0 0 0 3px rgba(77,163,255,.15);}

    .btn{
      padding:10px 14px; border-radius:10px; border:1px solid var(--bd); background:var(--panel-2);
      color:var(--ink); cursor:pointer; transition:.2s; font-weight:600; font-size:14px
    }
    .btn:hover{transform: translateY(-1px)}
    .btn.primary{background:var(--primary); color:#061019; border-color:transparent}
    .btn.ghost{background:transparent}
    .btn.warn{background:var(--warn); color:#111}
    .btn.error{background:var(--err)}
    .btn.ok{background:var(--ok); color:#071018}
    .inline{display:flex; gap:8px; flex-wrap:wrap; align-items:center}
    .muted{color:var(--muted)}
    .chip{display:inline-flex; align-items:center; gap:6px; padding:6px 10px; background:var(--panel-2); border:1px solid var(--bd); border-radius:999px; font-size:12px}
    .chip.ok{border-color:#234a35; background:#12261b; color:#7ee2a6}
    .chip.err{border-color:#4a2323; background:#261212; color:#f2a3a3}
    .chip.warn{border-color:#4a3b23; background:#261e12; color:#f6d28f}
    .sep{height:1px; background:var(--bd); margin:12px 0}

    table{width:100%; border-collapse: collapse; font-size:14px}
    th,td{padding:10px 12px; border-bottom:1px solid var(--bd); text-align:left}
    th{color:#cbd5e1; font-weight:600}
    tbody tr:hover{background: rgba(255,255,255,.03)}

    .state{
      border-radius:12px; padding:12px 14px; display:flex; align-items:center; gap:10px; border:1px solid var(--bd);
      background:var(--panel-2); margin-bottom:12px
    }
    .state.ok{border-color:#234a35; background:#12261b}
    .state.err{border-color:#4a2323; background:#261212}
    .state .title{font-weight:700}
    .hide{display:none}
    .print-only{display:none}
    @media print{
      header,.tabs,.btn, .state.hide-on-print, .footer{display:none !important}
      .print-only{display:block}
      body{background:#fff; color:#000}
      .card{box-shadow:none; border:1px solid #ddd}
    }
</style>