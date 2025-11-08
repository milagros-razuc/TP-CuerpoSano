const { AsistenciaClase, Miembro, Clase, Membresia, TipoMembresia } = require('../../../models');
const { Op } = require('sequelize');

module.exports = async (req, res) => {
  try {
    const { dni, id_miembro, id_clase } = req.body;

    if (!id_clase) {
      return res.status(400).json({ error: 'Debe seleccionar una clase (id_clase)' });
    }

    if (!dni && !id_miembro) {
      return res.status(400).json({ error: 'Debe enviar dni o id_miembro' });
    }

    const miembro = dni
      ? await Miembro.findOne({ where: { dni } })
      : await Miembro.findByPk(id_miembro);

    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    // ✅ Buscar membresía activa o vigente
    const hoy = new Date();
    const membresia = await Membresia.findOne({
      where: {
        id_miembro: miembro.id,
        fecha_inicio: { [Op.lte]: hoy },
        fecha_fin: { [Op.gte]: hoy }
      },
      include: [{ model: TipoMembresia, as: 'tipo', attributes: ['nombre'] }]
    });

    // Si no tiene membresía activa o si la última está vencida o cancelada
    if (!membresia) {
      return res.status(403).json({
        error: `El miembro ${miembro.nombre} ${miembro.apellido} no tiene una membresía activa o está vencida.`
      });
    }

    if (membresia.estado === 'cancelada') {
      return res.status(403).json({
        error: `La membresía de ${miembro.nombre} ${miembro.apellido} está cancelada.`
      });
    }

    const clase = await Clase.findByPk(id_clase);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });

    // ✅ Registrar asistencia
    const nuevaAsistencia = await AsistenciaClase.create({
      id_miembro: miembro.id,
      id_clase,
      fecha_hora: new Date()
    });

    res.status(201).json({
      message: 'Asistencia a clase registrada correctamente',
      asistencia: {
        ...nuevaAsistencia.dataValues,
        miembro: {
          id: miembro.id,
          nombre: miembro.nombre,
          apellido: miembro.apellido,
          dni: miembro.dni
        },
        clase: { id: clase.id, nombre: clase.nombre },
        membresia: {
          tipo: membresia.tipo.nombre,
          estado: membresia.estado,
          fecha_fin: membresia.fecha_fin
        }
      }
    });
  } catch (error) {
    console.error('Error al registrar asistencia a clase:', error);
    res.status(500).json({ error: 'Error interno al registrar asistencia a clase' });
  }
};
