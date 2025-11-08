const { Especialidad } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }

    await especialidad.update({ nombre });

    res.json({
      message: 'Especialidad actualizada correctamente',
      especialidad
    });
  } catch (error) {
    console.error('Error al actualizar especialidad:', error);
    res.status(500).json({ error: 'Error interno al actualizar la especialidad' });
  }
};
