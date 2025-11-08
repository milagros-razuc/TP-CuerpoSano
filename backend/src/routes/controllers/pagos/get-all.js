const { Pago, Miembro, MetodoPago, Membresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
  include: [
    { model: Miembro, as: 'miembro', attributes: ['nombre', 'apellido', 'dni'] },
    { model: MetodoPago, as: 'metodoPago', attributes: ['nombre'] },
    { model: Membresia, as: 'membresias', attributes: ['id', 'estado', 'fecha_inicio', 'fecha_fin'] }
  ],
  order: [['fecha_pago', 'DESC']]
});

    if (!pagos.length) {
      return res.status(404).json({ message: 'No hay pagos registrados.' });
    }

    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
