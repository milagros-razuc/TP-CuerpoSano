// controllers/asistencias/createGimnasio.js
const { AsistenciaGimnasio, Miembro, Membresia, TipoMembresia } = require('../../../models');
const { Op } = require('sequelize');

module.exports = async (req, res) => {
  try {
    const { dni, id_miembro, metodo_identificacion = 'manual' } = req.body;

    if (!dni && !id_miembro) {
      return res.status(400).json({ error: 'Debe enviar dni o id_miembro' });
    }

    // 🔍 Buscar el miembro
    const miembro = dni
      ? await Miembro.findOne({ where: { dni } })
      : await Miembro.findByPk(id_miembro);

    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    // 🔍 Verificar membresía activa
    const hoy = new Date();
    const membresia = await Membresia.findOne({
      where: {
        id_miembro: miembro.id,
        fecha_inicio: { [Op.lte]: hoy },
        fecha_fin: { [Op.gte]: hoy }
      },
      include: [{ model: TipoMembresia, as: 'tipo', attributes: ['nombre'] }]
    });

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

    // 🟢 Registrar asistencia
    const nuevaAsistencia = await AsistenciaGimnasio.create({
      id_miembro: miembro.id,
      fecha_hora: new Date(),
      metodo_identificacion
    });

    res.status(201).json({
      message: 'Asistencia al gimnasio registrada correctamente',
      asistencia: {
        ...nuevaAsistencia.dataValues,
        miembro: {
          id: miembro.id,
          nombre: miembro.nombre,
          apellido: miembro.apellido,
          dni: miembro.dni
        },
        membresia: {
          tipo: membresia.tipo.nombre,
          estado: membresia.estado,
          fecha_fin: membresia.fecha_fin
        }
      }
    });
  } catch (error) {
    console.error('Error al registrar asistencia al gimnasio:', error);
    res.status(500).json({ error: 'Error interno al registrar asistencia al gimnasio' });
  }
};
