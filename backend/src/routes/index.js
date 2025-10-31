const express = require('express');
const router = express.Router();

// === MIEMBROS ===
const crearMiembro = require('./controllers/miembros/create');
const updateMiembro = require('./controllers/miembros/update');
const deleteMiembro = require('./controllers/miembros/delete');
const getAllMiembros = require('./controllers/miembros/get-all');



const getMembresias = require('./controllers/membresias/get-all');

// --- Rutas para MIEMBROS ---
router.post('/miembros', crearMiembro);
router.put('/miembros/:dni', updateMiembro);
router.delete('/miembros/:dni', deleteMiembro);
router.get('/miembros', getAllMiembros);

router.get('/TipoMembresias', getMembresias);

module.exports = router;