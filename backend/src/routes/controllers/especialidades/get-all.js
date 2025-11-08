const { Especialidad } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll();
    res.json(especialidades);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.status(500).json({ error: 'Error interno al obtener las especialidades' });
  }
};
