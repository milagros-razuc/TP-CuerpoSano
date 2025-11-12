const { AsistenciaGimnasio, AsistenciaClase, Miembro, Clase } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res) => {
  try {
    const { tipo = 'todas', desde, hasta } = req.query

    // Parámetros opcionales de rango de fechas
    const whereFecha = {}
    if (desde) whereFecha.fecha_hora = { [Op.gte]: new Date(desde) }
    if (hasta)
      whereFecha.fecha_hora = {
        ...(whereFecha.fecha_hora || {}),
        [Op.lte]: new Date(hasta)
      }

    let asistencias = []

    // --- 🔹 Traer asistencias de gimnasio ---
    if (tipo === 'todas' || tipo === 'gimnasio') {
      const gym = await AsistenciaGimnasio.findAll({
        where: whereFecha,
        include: [
          {
            model: Miembro,
            as: 'miembro',
            attributes: ['id', 'nombre', 'apellido', 'dni']
          }
        ],
        order: [['fecha_hora', 'DESC']],
        limit: 20
      })
      asistencias.push(...gym.map(a => ({ ...a.toJSON(), tipo: 'gimnasio' })))
    }

    // --- 🔹 Traer asistencias a clases ---
    if (tipo === 'todas' || tipo === 'clase') {
      const cls = await AsistenciaClase.findAll({
        where: whereFecha,
        include: [
          {
            model: Miembro,
            as: 'miembro',
            attributes: ['id', 'nombre', 'apellido', 'dni']
          },
          {
            model: Clase,
            as: 'clase',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['fecha_hora', 'DESC']],
        limit: 20
      })
      asistencias.push(...cls.map(a => ({ ...a.toJSON(), tipo: 'clase' })))
    }

    // Ordenar globalmente (por si se combinan)
    asistencias.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))

    // Limitar a las últimas 20 totales si no hay filtros
    if (!desde && !hasta && tipo === 'todas') asistencias = asistencias.slice(0, 20)

    res.json(asistencias)
  } catch (err) {
    console.error('Error al generar reporte de asistencias:', err)
    res.status(500).json({ error: 'Error interno al generar el reporte de asistencias' })
  }
}
