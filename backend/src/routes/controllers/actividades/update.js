const { Actividad } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, nivel_dificultad } = req.body;

    const actividad = await Actividad.findByPk(id);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    await actividad.update({
      nombre,
      descripcion,
      nivel_dificultad
    });

    res.json({
      message: 'Actividad actualizada correctamente',
      actividad
    });
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    res.status(500).json({ error: 'Error interno al actualizar la actividad' });
  }
};
