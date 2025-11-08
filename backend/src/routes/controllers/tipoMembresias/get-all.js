// controllers/membresias/getAll.js
const { TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const tipos = await TipoMembresia.findAll({
      attributes: ['id', 'nombre', 'descripcion', 'precio', 'duracion_dias']
    });

    if (!tipos || tipos.length === 0) {
      return res.status(404).json({ message: 'No hay tipos de membresía registrados' });
    }

    res.status(200).json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de membresía:', error);
    res.status(500).json({ error: 'No se pudo cargar la lista de tipos de membresía' });
  }
};
