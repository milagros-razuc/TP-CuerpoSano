// controllers/membresias/create.js
const { TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { nombre, descripcion, precio, duracion_dias } = req.body;

    if (!nombre || !precio || !duracion_dias) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios',
        campos: ['nombre', 'precio', 'duracion_dias']
      });
    }

    // Evitar duplicados por nombre
    const existente = await TipoMembresia.findOne({ where: { nombre } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe una membresía con ese nombre' });
    }

    const nueva = await TipoMembresia.create({
      nombre,
      descripcion: descripcion || '',
      precio,
      duracion_dias
    });

    res.status(201).json({ message: 'Membresía creada correctamente', membresia: nueva });

  } catch (error) {
    console.error('Error al crear membresía:', error);

    if (error.name === 'SequelizeValidationError') {
      const detalles = error.errors.map(e => e.message);
      return res.status(400).json({ error: 'Error de validación', detalles });
    }

    res.status(500).json({ error: 'Error interno al crear la membresía', detalles: error.message });
  }
};
