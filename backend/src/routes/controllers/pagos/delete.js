const { Pago } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const pago = await Pago.findByPk(id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

    // Si ya estaba confirmado, no se puede cancelar
    if (pago.estado_pago === 'confirmado') {
      return res.status(400).json({ error: 'No se puede cancelar un pago confirmado' });
    }

    pago.estado_pago = 'cancelado';
    await pago.save();

    res.json({ message: 'Pago cancelado correctamente', pago });
  } catch (error) {
    console.error('Error al cancelar pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
