// controllers/asistencias/createGimnasio.js
const { AsistenciaGimnasio, Miembro } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni, id_miembro, metodo_identificacion = 'manual' } = req.body;

    if (!dni && !id_miembro) {
      return res.status(400).json({ error: 'Debe enviar dni o id_miembro' });
    }

    const miembro = dni
      ? await Miembro.findOne({ where: { dni } })
      : await Miembro.findByPk(id_miembro);

    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    const nuevaAsistencia = await AsistenciaGimnasio.create({
      id_miembro: miembro.id,
      fecha_hora: new Date(),
      metodo_identificacion
    });

    res.status(201).json({
      message: 'Asistencia al gimnasio registrada correctamente',
      asistencia: {
        ...nuevaAsistencia.dataValues,
        miembro: { id: miembro.id, nombre: miembro.nombre, apellido: miembro.apellido, dni: miembro.dni }
      }
    });
  } catch (error) {
    console.error('Error al registrar asistencia al gimnasio:', error);
    res.status(500).json({ error: 'Error interno al registrar asistencia al gimnasio' });
  }
};
