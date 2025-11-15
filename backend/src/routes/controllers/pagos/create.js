const { Pago, Miembro, MetodoPago, Membresia, TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id_miembro, id_tipo_membresia, id_metodoPago, monto } = req.body;

    if (!id_miembro || !id_tipo_membresia || !id_metodoPago || !monto) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (id_miembro, id_tipo_membresia, id_metodoPago, monto)' });
    }

    // 🔍 Buscar miembro
    const miembro = await Miembro.findByPk(id_miembro);
    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    // 🔍 Buscar tipo de membresía
    const tipo = await TipoMembresia.findByPk(id_tipo_membresia);
    if (!tipo) return res.status(404).json({ error: 'Tipo de membresía no encontrado' });

    // 🔍 Buscar método de pago
    const metodoPago = await MetodoPago.findByPk(id_metodoPago);
    if (!metodoPago) return res.status(404).json({ error: 'Método de pago no válido' });

    // 🔎 Buscar membresía pendiente o vencida
    let membresia = await Membresia.findOne({
      where: {
        id_miembro,
        estado: ['pendiente', 'vencida']
      },
      order: [['fecha_fin', 'DESC']]
    });

    // ⚠️ Validar tipo de membresía
if (membresia && membresia.id_tipo !== id_tipo_membresia) {
  if (!req.body.forzarCambio) {
    return res.status(409).json({
      warning: 'El tipo de membresía del miembro no coincide con el seleccionado.',
      current_membresia: membresia.id_tipo,
      selected_membresia: id_tipo_membresia,
      message: 'Si desea continuar, envíe "forzarCambio: true" para actualizar la membresía.'
    });
  } else {
    // Actualizar el tipo de membresía
    await membresia.update({ id_tipo: id_tipo_membresia });
  }
}

    // Si no hay membresía pendiente, crear una nueva
    if (!membresia) {
      const inicio = new Date();
      const durDias = Number(tipo.duracion_dias) || 0;
      const fin = new Date(inicio.getTime() + durDias * 24 * 60 * 60 * 1000);

      membresia = await Membresia.create({
        id_miembro,
        id_tipo: tipo.id,
        fecha_inicio: inicio,
        fecha_fin: fin,
        estado: 'activa'
      });
    } else {
      // Si existe una pendiente o vencida, reactivarla
      await membresia.update({
        estado: 'activa',
        fecha_inicio: new Date(),
        fecha_fin: new Date(Date.now() + (Number(tipo.duracion_dias) || 0) * 24 * 60 * 60 * 1000)
      });
    }

    // 💵 Crear el pago asociado a la membresía (existente o nueva)
    const nuevoPago = await Pago.create({
      fecha_pago: new Date(),
      monto,
      id_metodoPago,
      estado_pago: 'confirmado',
      id_miembro,
      id_membresia: membresia.id
    });

    // ✅ Activar al miembro si estaba inactivo
    if (!miembro.activo) {
      await miembro.update({ activo: 1 });
    }

    res.status(201).json({
      message: 'Pago registrado correctamente y membresía actualizada',
      pago: nuevoPago,
      membresia,
      miembro: { id: miembro.id, nombre: miembro.nombre, activo: 1 }
    });

  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
