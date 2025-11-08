const { Entrenador, Especialidad, EntrenadorEspecialidad, Certificacion } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { nombre, apellido, dni, telefono, email, especialidades, certificaciones } = req.body;

    if (!nombre || !apellido || !dni || !telefono || !email) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Crear entrenador
    const nuevoEntrenador = await Entrenador.create({ nombre, apellido, dni, telefono, email });

    // Asociar especialidades
    if (Array.isArray(especialidades) && especialidades.length > 0) {
      const relaciones = especialidades.map(id_especialidad => ({
        id_entrenador: nuevoEntrenador.id,
        id_especialidad
      }));
      await EntrenadorEspecialidad.bulkCreate(relaciones);
    }

    // Crear certificaciones
    if (Array.isArray(certificaciones) && certificaciones.length > 0) {
      const certs = certificaciones.map(c => ({
        ...c,
        id_entrenador: nuevoEntrenador.id
      }));
      await Certificacion.bulkCreate(certs);
    }

    res.status(201).json({
      message: 'Entrenador creado correctamente',
      entrenador: nuevoEntrenador
    });

  } catch (error) {
    console.error('Error al crear entrenador:', error);
    res.status(500).json({ error: 'Error interno al crear el entrenador', detalles: error.message });
  }
};
