// controllers/membresias/update.js
const { TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const tipo = await TipoMembresia.findByPk(id);
    if (!tipo) return res.status(404).json({ error: 'Membresía no encontrada' });

    await tipo.update({
      nombre: data.nombre ?? tipo.nombre,
      descripcion: data.descripcion ?? tipo.descripcion,
      precio: data.precio ?? tipo.precio,
      duracion_dias: data.duracion_dias ?? tipo.duracion_dias
    });

    res.status(200).json({ message: 'Membresía actualizada correctamente', membresia: tipo });

  } catch (error) {
    console.error('Error al actualizar membresía:', error);

    if (error.name === 'SequelizeValidationError') {
      const detalles = error.errors.map(e => e.message);
      return res.status(400).json({ error: 'Error de validación', detalles });
    }

    res.status(500).json({ error: 'Error interno al actualizar la membresía', detalles: error.message });
  }
};
