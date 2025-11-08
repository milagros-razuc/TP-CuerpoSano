const { Especialidad } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }

    await especialidad.destroy();

    res.json({ message: 'Especialidad eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar especialidad:', error);
    res.status(500).json({ error: 'Error interno al eliminar la especialidad' });
  }
};
