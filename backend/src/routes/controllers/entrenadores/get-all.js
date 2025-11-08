// controllers/entrenadores/getAll.js
const { Entrenador, Especialidad, Certificacion } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const entrenadores = await Entrenador.findAll({
      include: [
        {
          model: Especialidad,
          as: 'especialidades',
          attributes: ['id', 'nombre'],
          through: { attributes: [] } // Oculta la tabla intermedia
        },
        {
          model: Certificacion,
          as: 'certificaciones',
          attributes: ['id', 'nombre', 'entidad_emisora', 'fecha_emision', 'fecha_vencimiento']
        }
      ],
      order: [['id', 'ASC']]
    });

    res.json(entrenadores);
  } catch (error) {
    console.error('Error al obtener entrenadores:', error);
    res.status(500).json({ error: 'Error interno al obtener entrenadores' });
  }
};
