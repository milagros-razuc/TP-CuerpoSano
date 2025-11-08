const { Membresia, Miembro, TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const membresias = await Membresia.findAll({
      include: [
        {
          model: Miembro,
          as: 'miembro', // 👈 debe coincidir con el alias definido en las relaciones
          attributes: ['id', 'nombre', 'apellido', 'dni']
        },
        {
          model: TipoMembresia,
          as: 'tipo', // 👈 también debe coincidir
          attributes: ['id', 'nombre', 'descripcion', 'precio', 'duracion_dias']
        }
      ],
      order: [['fecha_inicio', 'DESC']]
    });

    if (!membresias.length) {
      return res.status(404).json({ message: 'No hay membresías registradas.' });
    }

    res.json(
      membresias.map(m => ({
        id: m.id,
        miembro: m.miembro
          ? {
              id: m.miembro.id,
              nombre: m.miembro.nombre,
              apellido: m.miembro.apellido,
              dni: m.miembro.dni
            }
          : null,
        tipo: m.tipo
          ? {
              id: m.tipo.id,
              nombre: m.tipo.nombre,
              descripcion: m.tipo.descripcion,
              precio: m.tipo.precio,
              duracion_dias: m.tipo.duracion_dias
            }
          : null,
        fecha_inicio: m.fecha_inicio,
        fecha_fin: m.fecha_fin,
        estado: m.estado
      }))
    );
  } catch (error) {
    console.error('Error al obtener las membresías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
