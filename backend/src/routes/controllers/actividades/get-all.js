const { Actividad } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const actividades = await Actividad.findAll();
    res.json(actividades);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error interno al obtener las actividades' });
  }
};
