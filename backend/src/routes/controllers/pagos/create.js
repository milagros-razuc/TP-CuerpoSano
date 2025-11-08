const { Pago, Miembro, MetodoPago, Membresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni, id_membresia, id_metodoPago, monto } = req.body;

    if (!dni || !id_membresia || !id_metodoPago || !monto) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (dni, id_membresia, id_metodoPago, monto)' });
    }

    // Buscar miembro por DNI
    const miembro = await Miembro.findOne({ where: { dni } });
    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    // Buscar membresía
    const membresia = await Membresia.findByPk(id_membresia);
    if (!membresia) return res.status(404).json({ error: 'Membresía no encontrada' });

    // Buscar método de pago
    const metodoPago = await MetodoPago.findByPk(id_metodoPago);
    if (!metodoPago) return res.status(404).json({ error: 'Método de pago no válido' });

    // Crear el pago
    const nuevoPago = await Pago.create({
      fecha_pago: new Date(),
      monto,
      id_metodoPago,
      estado_pago: 'confirmado', // al registrarlo ya se confirma
      id_miembro: miembro.id,
      id_membresia
    });

    // Si el pago fue confirmado, activar la membresía
    if (nuevoPago.estado_pago === 'confirmado') {
      if (membresia.estado !== 'activa') {
        membresia.estado = 'activa';
        await membresia.save();
      }
    }

    res.status(201).json({
      message: 'Pago registrado correctamente y membresía activada',
      pago: nuevoPago
    });

  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
