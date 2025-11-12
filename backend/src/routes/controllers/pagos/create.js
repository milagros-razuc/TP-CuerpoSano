const { Pago, Miembro, MetodoPago, Membresia, TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id_miembro, id_tipo_membresia, id_metodoPago, monto } = req.body;

    if (!id_miembro || !id_tipo_membresia || !id_metodoPago || !monto) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (id_miembro, id_tipo_membresia, id_metodoPago, monto)' });
    }

    // Buscar miembro por id
    const miembro = await Miembro.findByPk(id_miembro);
    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    // Buscar tipo de membresía
    const tipo = await TipoMembresia.findByPk(id_tipo_membresia);
    if (!tipo) return res.status(404).json({ error: 'Tipo de membresía no encontrado' });

    // Buscar método de pago
    const metodoPago = await MetodoPago.findByPk(id_metodoPago);
    if (!metodoPago) return res.status(404).json({ error: 'Método de pago no válido' });

    // Crear una nueva membresía para este miembro basada en el tipo seleccionado
    const inicio = new Date();
    // Duración en días definida en el tipo
    const durDias = Number(tipo.duracion_dias) || 0;
    const fin = new Date(inicio.getTime() + durDias * 24 * 60 * 60 * 1000);

    const nuevaMembresia = await Membresia.create({
      id_miembro: miembro.id,
      id_tipo: tipo.id,
      fecha_inicio: inicio,
      fecha_fin: fin,
      estado: 'activa'
    });

    // Crear el pago asociado a la nueva membresía
    const nuevoPago = await Pago.create({
      fecha_pago: new Date(),
      monto,
      id_metodoPago,
      estado_pago: 'confirmado', // al registrarlo ya se confirma
      id_miembro: miembro.id,
      id_membresia: nuevaMembresia.id
    });

    res.status(201).json({
      message: 'Pago registrado correctamente y membresía creada/activada',
      pago: nuevoPago,
      membresia: nuevaMembresia
    });

  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
