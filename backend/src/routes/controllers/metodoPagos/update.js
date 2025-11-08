const { MetodoPago } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Debe enviar el nuevo nombre' });
    }

    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) {
      return res.status(404).json({ error: 'Método de pago no encontrado' });
    }

    metodo.nombre = nombre;
    await metodo.save();

    res.status(200).json({
      message: 'Método de pago actualizado correctamente',
      metodoPago: metodo
    });
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
