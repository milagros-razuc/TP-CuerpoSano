const { Miembro, Membresia, TipoMembresia } = require('../../../models');


module.exports = async (req, res) => {
  try {
    const miembros = await Miembro.findAll({
      include: [
        {
          model: Membresia,
          as: 'membresias',
          include: [
            {
              model: TipoMembresia,
              as: 'tipo'
            }
          ]
        }
      ]
    });

    const miembrosFormateados = miembros.map(m => ({
      id: m.id,
      nombre: m.nombre,
      apellido: m.apellido,
      dni: m.dni,
      telefono: m.telefono,
      email: m.email || 'No informado',
      fecha_nacimiento: m.fecha_nacimiento,
      fecha_registro: m.fecha_registro,
      foto: m.foto, // si querés, podés convertirlo a base64
      activo: !!m.activo,
      metodo_identificacion: m.metodo_identificacion,
      codigo_barra: m.codigo_barra,
      huella_digital: m.huella_digital,
      membresias: m.membresias.map(mem => ({
        id: mem.id,
        fecha_inicio: mem.fecha_inicio,
        fecha_fin: mem.fecha_fin,
        estado: mem.estado,
        tipo: mem.tipo
          ? {
              id: mem.tipo.id,
              nombre: mem.tipo.nombre,
              descripcion: mem.tipo.descripcion,
              precio: mem.tipo.precio,
              duracion_dias: mem.tipo.duracion_dias
            }
          : null
      }))
    }));

    res.json(miembrosFormateados);
  } catch (error) {
    console.error('Error al obtener miembros:', error);
    res.status(500).json({ error: 'No se pudo cargar la lista de miembros' });
  }
};
