// controllers/asistencias/createClase.js
const { AsistenciaClase, Miembro, Clase } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni, id_miembro, id_clase } = req.body;

    if (!id_clase) {
      return res.status(400).json({ error: 'Debe seleccionar una clase (id_clase)' });
    }

    if (!dni && !id_miembro) {
      return res.status(400).json({ error: 'Debe enviar dni o id_miembro' });
    }

    const miembro = dni
      ? await Miembro.findOne({ where: { dni } })
      : await Miembro.findByPk(id_miembro);

    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    const clase = await Clase.findByPk(id_clase);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });

    const nuevaAsistencia = await AsistenciaClase.create({
      id_miembro: miembro.id,
      id_clase,
      fecha_hora: new Date()
    });

    res.status(201).json({
      message: 'Asistencia a clase registrada correctamente',
      asistencia: {
        ...nuevaAsistencia.dataValues,
        miembro: { id: miembro.id, nombre: miembro.nombre, apellido: miembro.apellido, dni: miembro.dni },
        clase: { id: clase.id, nombre: clase.nombre }
      }
    });
  } catch (error) {
    console.error('Error al registrar asistencia a clase:', error);
    res.status(500).json({ error: 'Error interno al registrar asistencia a clase' });
  }
};
