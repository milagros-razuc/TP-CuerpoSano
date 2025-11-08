const { AsistenciaGimnasio, Miembro } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const asistencias = await AsistenciaGimnasio.findAll({
      include: [
        {
          model: Miembro,
          as: 'miembro',
          attributes: ['id', 'nombre', 'apellido', 'dni']
        }
      ],
      order: [['fecha_hora', 'DESC']]
    });

    res.status(200).json(asistencias);
  } catch (error) {
    console.error('Error al obtener asistencias del gimnasio:', error);
    res.status(500).json({ error: 'Error al obtener asistencias del gimnasio' });
  }
};
