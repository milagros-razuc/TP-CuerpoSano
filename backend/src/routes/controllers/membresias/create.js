const { Membresia, TipoMembresia, Miembro } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni_miembro, id_tipo } = req.body;

    if (!dni_miembro || !id_tipo) {
      return res.status(400).json({ error: 'Debe enviar dni_miembro e id_tipo de membresía' });
    }

    // Buscar miembro por DNI
    const miembro = await Miembro.findOne({ where: { dni: dni_miembro } });
    if (!miembro) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }

    // Buscar tipo de membresía
    const tipo = await TipoMembresia.findByPk(id_tipo);
    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de membresía no encontrado' });
    }

    // Verificar si el miembro ya tiene una membresía activa o pendiente
    const membresiaActiva = await Membresia.findOne({
      where: { id_miembro: miembro.id, estado: ['activa', 'pendiente'] },
      order: [['fecha_fin', 'DESC']]
    });

    // Calcular fechas sin usar date-fns
    const fecha_inicio = new Date();
    const fecha_fin = new Date(fecha_inicio.getTime() + tipo.duracion_dias * 24 * 60 * 60 * 1000);

    // Crear nueva membresía (sea inicial o renovación)
    const nuevaMembresia = await Membresia.create({
      id_miembro: miembro.id,
      id_tipo,
      fecha_inicio,
      fecha_fin,
      estado: 'pendiente' // pasa a 'activa' al confirmar el pago
    });

    res.status(201).json({
      message: membresiaActiva
        ? 'Renovación registrada correctamente'
        : 'Membresía creada correctamente',
      membresia: {
        id: nuevaMembresia.id,
        miembro: {
          nombre: miembro.nombre,
          apellido: miembro.apellido,
          dni: miembro.dni
        },
        tipo: tipo.nombre,
        duracion_dias: tipo.duracion_dias,
        fecha_inicio,
        fecha_fin,
        estado: nuevaMembresia.estado
      }
    });
  } catch (error) {
    console.error('Error al crear o renovar membresía:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
