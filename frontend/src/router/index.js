import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import MiembrosView from '../views/MiembrosView.vue'
import MembresiasView from '../views/MembresiasView.vue'
import ClasesView from '../views/ClasesView.vue'
import InscripcionesView from '../views/InscripcionesView.vue'
import ActividadesView from '../views/ActividadesView.vue'
import EntrenadoresView from '../views/EntrenadoresView.vue'
import EspecialidadesView from '../views/EspecialidadesView.vue'
import IngresoGimnasioView from '../views/IngresoGimnasioView.vue'
import IngresoClasesView from '../views/IngresoClasesView.vue'
import PagosView from '../views/PagosView.vue'
import ReporteIngresosView from '../views/ReporteIngresosView.vue'
import ReporteAsistenciaView from '../views/ReporteAsistenciaView.vue'
import ReporteMembresiasView from '../views/ReporteMembresiasView.vue'


const routes = [
  { path: '/', name: 'Home', component: Home, meta: { showInTabs: true, label: 'Home', order: 0 } },
  { path: '/miembros', name: 'Miembros', component: MiembrosView, meta: { showInTabs: true, label: 'CU-01 Miembros', order: 1 } },
  { path: '/membresias', name: 'Membresias', component: MembresiasView, meta: { showInTabs: true, label: 'CU-02 Membresías', order: 2 } },
  { path: '/clases', name: 'Clases', component: ClasesView, meta: { showInTabs: true, label: 'CU-03 Clases', order: 3 } },
  { path: '/inscripciones', name: 'Inscripciones', component: InscripcionesView, meta: { showInTabs: true, label: 'CU-03b Inscripciones', order: 3.1 } },
  { path: '/actividades', name: 'Actividades', component: ActividadesView, meta: { showInTabs: true, label: 'CU-04 Actividades', order: 4 } },
  { path: '/entrenadores', name: 'Entrenadores', component: EntrenadoresView, meta: { showInTabs: true, label: 'CU-05 Entrenadores', order: 5 } },
  { path: '/especialidades', name: 'Especialidades', component: EspecialidadesView, meta: { showInTabs: true, label: 'CU-05b Especialidades', order: 5.1 } },
  { path: '/ingreso-gimnasio', name: 'IngresoGimnasio', component: IngresoGimnasioView, meta: { showInTabs: true, label: 'CU-06 Ingreso', order: 6 } },
  { path: '/ingreso-clases', name: 'IngresoClases', component: IngresoClasesView, meta: { showInTabs: true, label: 'CU-06b Ingreso Clases', order: 6.1 } },
  { path: '/pagos', name: 'Pagos', component: PagosView, meta: { showInTabs: true, label: 'CU-07 Pagos', order: 7 } },
  { path: '/reportes/ingresos', name: 'ReporteIngresos', component: ReporteIngresosView, meta: { showInTabs: true, label: 'Reporte Ingresos', order: 8 } },
  { path: '/reportes/membresias', name: 'ReporteMembresias', component: ReporteMembresiasView, meta: { showInTabs: true, label: 'Reporte Membresías', order: 8.1 } },
  { path: '/reportes/asistencia', name: 'ReporteAsistencia', component: ReporteAsistenciaView, meta: { showInTabs: true, label: 'Reporte Asistencia', order: 9 } },
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router