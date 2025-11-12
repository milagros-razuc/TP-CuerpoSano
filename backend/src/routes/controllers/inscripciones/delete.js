const { Inscripcion, Miembro } = require('../../../models');

module.exports = async (req, res) => {
  try {
    // Ahora recibimos id_miembro en la ruta en lugar de dni_miembro
    const { id_miembro, id_clase } = req.params;

    // Buscar miembro por id
    const miembro = await Miembro.findByPk(id_miembro);
    if (!miembro) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }

    // Buscar inscripción
    const inscripcion = await Inscripcion.findOne({
      where: { id_miembro: miembro.id, id_clase }
    });
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada para este miembro y clase' });
    }

    await inscripcion.destroy();
    res.json({ message: 'Inscripción eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar inscripción:', error);
    res.status(500).json({ error: 'No se pudo eliminar la inscripción' });
  }
};
