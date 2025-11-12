const express = require('express');
const router = express.Router();

// === MIEMBROS ===
const crearMiembro = require('./controllers/miembros/create');
const updateMiembro = require('./controllers/miembros/update');
const deleteMiembro = require('./controllers/miembros/delete');
const getAllMiembros = require('./controllers/miembros/get-all');


// === TIPO MEMBRESIAS ===
const getMembresias = require('./controllers/tipoMembresias/get-all');
const createMembresias = require('./controllers/tipoMembresias/create');
const updateMembresias = require('./controllers/tipoMembresias/update');
const removeMembresias = require('./controllers/tipoMembresias/delete');

// === CLASES ===
const getClases = require('./controllers/clases/get-all');
const createClases = require('./controllers/clases/create');
const updateClases = require('./controllers/clases/update');
const removeClases = require('./controllers/clases/delete');

// === INSCRIPCIONES ===
const getInscripciones = require('./controllers/inscripciones/get-all');
const createInscripciones = require('./controllers/inscripciones/create');
const updateInscripciones = require('./controllers/inscripciones/update');
const removeInscripciones = require('./controllers/inscripciones/delete');

// === ENTRENADORES ===

const getEntrenadores = require('./controllers/entrenadores/get-all');
const createEntrenadores = require('./controllers/entrenadores/create');
const updateEntenadores = require('./controllers/entrenadores/update');
const removeEntrenadores = require('./controllers/entrenadores/delete');

// === ESPECIALIDADES ===
const getAllEspecialidades = require('./controllers/especialidades/get-all');
const createEspecialidad = require('./controllers/especialidades/create');
const updateEspecialidad = require('./controllers/especialidades/update');
const removeEspecialidad = require('./controllers/especialidades/delete');

// === ACTIVIDADES ===
const getAllActividades = require('./controllers/actividades/get-all');
const createActividad = require('./controllers/actividades/create');
const updateActividad = require('./controllers/actividades/update');
const removeActividad = require('./controllers/actividades/delete');

// === ASISTENCIAS ===
const registrarGimnasio = require('./controllers/asistencias/registrarGimnasio');
const registrarClase = require('./controllers/asistencias/registrarClase');
const getReportes = require('./controllers/asistencias/getReporte');
const getAllGimnasio = require('./controllers/asistencias/getAllGimnasio');
const getAllClases = require('./controllers/asistencias/getAllClases');

// === MEMBRESIAS ===
const createMembresia = require('./controllers/membresias/create');
const getAllMembresias = require('./controllers/membresias/get-all');
const deleteMembresia = require('./controllers/membresias/delete');

// === PAGOS ===
const createPago = require('./controllers/pagos/create');
const getAllPagos = require('./controllers/pagos/get-all');
const cancelPago = require('./controllers/pagos/delete');

// === METODO PAGOS ===
const createMetodoPago = require('./controllers/metodoPagos/create');
const getMetodosPago = require('./controllers/metodoPagos/get-all');
const updateMetodoPago = require('./controllers/metodoPagos/update');


// --- Rutas para MIEMBROS ---
router.post('/miembros', crearMiembro);
router.put('/miembros/:id', updateMiembro);
router.delete('/miembros/:id', deleteMiembro);
router.get('/miembros', getAllMiembros);

// --- Rutas para TIPO MEMBRESIAS ---

router.get('/TipoMembresias', getMembresias);
router.post('/TipoMembresias', createMembresias);
router.put('/TipoMembresias/:id', updateMembresias);
router.delete('/TipoMembresias/:id', removeMembresias);


// --- Rutas para CLASES ---
router.get('/clases', getClases);
router.post('/clases', createClases);
router.put('/clases/:id', updateClases);
router.delete('/clases/:id', removeClases);

// --- Rutas para INSCRIPCIONES ---
router.get('/inscripciones', getInscripciones);
router.post('/inscripciones', createInscripciones);
router.put('/inscripciones/:id_miembro/:id_clase', updateInscripciones);
router.delete('/inscripciones/:id_miembro/:id_clase', removeInscripciones);

// --- Rutas para ENTRENADORES ---
router.get('/entrenadores', getEntrenadores);
router.post('/entrenadores', createEntrenadores);
router.put('/entrenadores/:dni', updateEntenadores);
router.delete('/entrenadores/:dni', removeEntrenadores);

// --- Rutas para ESPECIALIDADES ---
router.get('/especialidades', getAllEspecialidades);
router.post('/especialidades', createEspecialidad);
router.put('/especialidades/:id', updateEspecialidad);
router.delete('/especialidades/:id', removeEspecialidad);

// --- Rutas para ACTIVIDADES ---
router.get('/actividades', getAllActividades);
router.post('/actividades', createActividad);
router.put('/actividades/:id', updateActividad);
router.delete('/actividades/:id', removeActividad);

// --- Rutas para ASISTENCIAS ---
router.post('/asistencias/gimnasio', registrarGimnasio);
router.post('/asistencias/clases', registrarClase);
router.get('/asistencias/reportes', getReportes);
router.get('/asistencias/gimnasio', getAllGimnasio);
router.get('/asistencias/clases', getAllClases);


// --- Rutas para MEMBRESIAS ---
router.post('/membresias', createMembresia);
router.get('/membresias', getAllMembresias);
router.delete('membresias/:id', deleteMembresia);

// --- Rutas para PAGOS ---
router.post('/pagos', createPago);
router.get('/pagos', getAllPagos);
router.patch('pagos/:id', cancelPago);

// --- Rutas para METODO PAGOS ---
router.post('/metodoPago', createMetodoPago);
router.get('/metodoPago', getMetodosPago);
router.put('/metodoPago/:id', updateMetodoPago);


module.exports = router;