const { Actividad } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { nombre, descripcion, nivel_dificultad } = req.body;

    if (!nombre || !nivel_dificultad) {
      return res.status(400).json({ error: 'Los campos "nombre" y "nivel_dificultad" son obligatorios' });
    }

    const nuevaActividad = await Actividad.create({
      nombre,
      descripcion,
      nivel_dificultad
    });

    res.status(201).json({
      message: 'Actividad creada correctamente',
      actividad: nuevaActividad
    });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({ error: 'Error interno al crear la actividad' });
  }
};
