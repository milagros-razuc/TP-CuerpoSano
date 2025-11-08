const { Entrenador, EntrenadorEspecialidad, Certificacion } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni } = req.params;
    const { nombre, apellido, telefono, email, especialidades, certificaciones } = req.body;

    const entrenador = await Entrenador.findOne({ where: { dni } });
    if (!entrenador) return res.status(404).json({ error: 'Entrenador no encontrado' });

    await entrenador.update({ nombre, apellido, telefono, email });

    // Actualizar especialidades
    if (Array.isArray(especialidades)) {
      await EntrenadorEspecialidad.destroy({ where: { id_entrenador: entrenador.id } });
      const relaciones = especialidades.map(id_especialidad => ({
        id_entrenador: entrenador.id,
        id_especialidad
      }));
      await EntrenadorEspecialidad.bulkCreate(relaciones);
    }

    // Actualizar certificaciones
    if (Array.isArray(certificaciones)) {
      await Certificacion.destroy({ where: { id_entrenador: entrenador.id } });
      const nuevasCertificaciones = certificaciones.map(c => ({
        ...c,
        id_entrenador: entrenador.id
      }));
      await Certificacion.bulkCreate(nuevasCertificaciones);
    }

    res.json({ message: 'Entrenador actualizado correctamente', entrenador });
  } catch (error) {
    console.error('Error al actualizar entrenador:', error);
    res.status(500).json({ error: 'Error interno al actualizar entrenador' });
  }
};
