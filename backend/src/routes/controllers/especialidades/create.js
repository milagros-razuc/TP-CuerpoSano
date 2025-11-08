const { Especialidad } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
    }

    const nuevaEspecialidad = await Especialidad.create({ nombre });

    res.status(201).json({
      message: 'Especialidad creada correctamente',
      especialidad: nuevaEspecialidad
    });
  } catch (error) {
    console.error('Error al crear especialidad:', error);
    res.status(500).json({ error: 'Error interno al crear la especialidad' });
  }
};
