const { Entrenador, EntrenadorEspecialidad, Certificacion } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni } = req.params;

    const entrenador = await Entrenador.findOne({ where: { dni } });
    if (!entrenador) return res.status(404).json({ error: 'Entrenador no encontrado' });

    await EntrenadorEspecialidad.destroy({ where: { id_entrenador: entrenador.id } });
    await Certificacion.destroy({ where: { id_entrenador: entrenador.id } });
    await entrenador.destroy();

    res.json({ message: 'Entrenador eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar entrenador:', error);
    res.status(500).json({ error: 'Error interno al eliminar entrenador' });
  }
};
