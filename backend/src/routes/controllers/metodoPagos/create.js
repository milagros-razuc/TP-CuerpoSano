const { MetodoPago } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Debe enviar el nombre del método de pago' });
    }

    const metodoExistente = await MetodoPago.findOne({ where: { nombre } });
    if (metodoExistente) {
      return res.status(400).json({ error: 'Ya existe un método de pago con ese nombre' });
    }

    const nuevoMetodo = await MetodoPago.create({ nombre });

    res.status(201).json({
      message: 'Método de pago creado correctamente',
      metodoPago: nuevoMetodo
    });
  } catch (error) {
    console.error('Error al crear método de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
