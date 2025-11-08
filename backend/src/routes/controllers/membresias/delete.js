const { Membresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const membresia = await Membresia.findByPk(id);
    if (!membresia) return res.status(404).json({ error: 'Membresía no encontrada' });

    if (membresia.estado === 'cancelada') {
      return res.status(400).json({ message: 'La membresía ya está cancelada' });
    }

    membresia.estado = 'cancelada';
    await membresia.save();

    res.status(200).json({ message: 'Membresía cancelada correctamente', membresia });
  } catch (error) {
    console.error('Error al cancelar membresía:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
