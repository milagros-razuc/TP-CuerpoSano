// controllers/membresias/delete.js
const { TipoMembresia, Membresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'Debe enviar el ID de la membresía' });

    const tipo = await TipoMembresia.findByPk(id);
    if (!tipo) return res.status(404).json({ error: 'Membresía no encontrada' });

    // Verificar si está en uso
    const usada = await Membresia.findOne({ where: { id_tipo: id } });
    if (usada) {
      return res.status(409).json({
        error: 'No se puede eliminar esta membresía porque está asociada a uno o más miembros'
      });
    }

    await tipo.destroy();

    res.status(200).json({ message: 'Membresía eliminada correctamente' });

  } catch (error) {
    console.error('Error al eliminar membresía:', error);
    res.status(500).json({ error: 'Error interno al eliminar la membresía', detalles: error.message });
  }
};
