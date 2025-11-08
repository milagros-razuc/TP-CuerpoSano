// controllers/asistencias/getAll.js
const { AsistenciaGimnasio, AsistenciaClase, Miembro, Clase } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const asistenciasGimnasio = await AsistenciaGimnasio.findAll({
      include: [
        { model: Miembro, as: 'miembro', attributes: ['id', 'nombre', 'apellido', 'dni'] }
      ],
      order: [['fecha_hora', 'DESC']]
    });

    const asistenciasClase = await AsistenciaClase.findAll({
      include: [
        { model: Miembro, as: 'miembro', attributes: ['id', 'nombre', 'apellido', 'dni'] },
        { model: Clase, as: 'clase', attributes: ['id', 'nombre'] }
      ],
      order: [['fecha_hora', 'DESC']]
    });

    res.status(200).json({
      gimnasio: asistenciasGimnasio,
      clases: asistenciasClase
    });
  } catch (error) {
    console.error('Error al obtener asistencias:', error);
    res.status(500).json({ error: 'Error interno al obtener asistencias' });
  }
};
