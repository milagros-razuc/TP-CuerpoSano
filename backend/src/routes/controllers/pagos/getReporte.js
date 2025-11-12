const { Pago, Miembro, MetodoPago } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res) => {
  try {
    const { desde, hasta, metodo } = req.query

    const whereFecha = {}
    // Interpret 'desde' as start of day and 'hasta' as end of day to make date filters inclusive
    if (desde) {
      // build ISO start datetime to avoid timezone surprises
      const desdeDt = new Date(`${desde}T00:00:00`)
      whereFecha.fecha_pago = { [Op.gte]: desdeDt }
    }
    if (hasta) {
      // include entire 'hasta' day by setting to 23:59:59.999
      const hastaDt = new Date(`${hasta}T23:59:59.999`)
      whereFecha.fecha_pago = {
        ...(whereFecha.fecha_pago || {}),
        [Op.lte]: hastaDt
      }
    }

    const include = [
      { model: Miembro, as: 'miembro', attributes: ['id', 'nombre', 'apellido', 'dni'] },
      { model: MetodoPago, as: 'metodoPago', attributes: ['id', 'nombre'] }
    ]

    if (metodo) {
      include[1].where = { nombre: metodo }
      include[1].required = true
    }

    const pagos = await Pago.findAll({
      where: whereFecha,
      include,
      order: [['fecha_pago', 'DESC']],
      limit: 100
    })

    const rows = pagos.map(p => ({
      id: p.id,
      fecha_pago: p.fecha_pago,
      monto: p.monto,
      estado_pago: p.estado_pago,
      miembro: p.miembro ? { id: p.miembro.id, nombre: p.miembro.nombre, apellido: p.miembro.apellido, dni: p.miembro.dni } : null,
      metodo: p.metodoPago ? p.metodoPago.nombre : null
    }))

    if (!desde && !hasta && !metodo) return res.json(rows.slice(0, 20))

    res.json(rows)
  } catch (err) {
    console.error('Error al generar reporte de ingresos:', err)
    res.status(500).json({ error: 'Error interno al generar el reporte de ingresos' })
  }
}
