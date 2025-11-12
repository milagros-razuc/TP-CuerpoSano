const { Inscripcion, Miembro } = require('../../../models');

module.exports = async (req, res) => {
  try {
    // Ahora recibimos id_miembro en la ruta en lugar de dni_miembro
    const { id_miembro, id_clase } = req.params;
    const { fecha_inscripcion } = req.body;

    // Buscar miembro por id
    const miembro = await Miembro.findByPk(id_miembro);
    if (!miembro) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }

    // Buscar inscripción por ids
    const inscripcion = await Inscripcion.findOne({
      where: { id_miembro: miembro.id, id_clase }
    });
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada para este miembro y clase' });
    }

    // Actualizar fecha (comportamiento similar a create)
    await inscripcion.update({ fecha_inscripcion: fecha_inscripcion || new Date() });

    res.json({ message: 'Inscripción actualizada correctamente', inscripcion });
  } catch (error) {
    console.error('Error al actualizar inscripción:', error);
    res.status(500).json({ error: 'No se pudo actualizar la inscripción' });
  }
};
