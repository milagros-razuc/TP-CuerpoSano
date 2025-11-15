const { Actividad, Clase } = require('../../../models'); // usa index.js

module.exports = async (req, res) => {
  try {
    const actividades = await Actividad.findAll({
      include: [
        {
          model: Clase,
          as: 'clases',
          through: { attributes: [] } // Oculta la tabla pivote
        }
      ]
    });

    res.json(actividades);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error interno al obtener las actividades' });
  }
};
