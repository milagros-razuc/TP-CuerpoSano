const { Actividad } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const actividad = await Actividad.findByPk(id);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    await actividad.destroy();

    res.json({ message: 'Actividad eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    res.status(500).json({ error: 'Error interno al eliminar la actividad' });
  }
};
