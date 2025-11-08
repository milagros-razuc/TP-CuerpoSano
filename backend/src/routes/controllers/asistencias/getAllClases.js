const { AsistenciaClase, Miembro, Clase } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const asistencias = await AsistenciaClase.findAll({
      include: [
        {
          model: Miembro,
          as: 'miembro',
          attributes: ['id', 'nombre', 'apellido', 'dni']
        },
        {
          model: Clase,
          as: 'clase',
          attributes: ['id', 'nombre', 'hora_inicio'] // ✅ corregido
        }
      ],
      order: [['fecha_hora', 'DESC']]
    });

    res.status(200).json(asistencias);
  } catch (error) {
    console.error('Error al obtener asistencias de clase:', error);
    res.status(500).json({ error: 'Error al obtener asistencias de clase' });
  }
};
