const { MetodoPago } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const metodos = await MetodoPago.findAll({
      order: [['id', 'ASC']]
    });

    res.status(200).json(metodos);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
