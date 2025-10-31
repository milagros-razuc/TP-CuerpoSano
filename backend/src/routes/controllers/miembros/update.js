const { Miembro, Membresia, TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni } = req.params;
    const data = req.body;

    const miembro = await Miembro.findOne({ where: { dni } });
    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    // Actualizar datos del miembro
    await miembro.update({
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      email: data.email || null,
      fecha_nacimiento: data.fecha_nacimiento,
      fecha_registro: data.fecha_registro,
      activo: data.activo ?? miembro.activo,
      metodo_identificacion: Array.isArray(data.metodo_identificacion)
            ? data.metodo_identificacion[0]  // toma el primer valor
            : data.metodo_identificacion,
      codigo_barra: data.codigo_barra || miembro.codigo_barra,
      huella_digital: data.huella_digital || miembro.huella_digital,
      foto: data.foto || miembro.foto
    });

    // Actualizar o crear membresía
    if (data.tipo) {
      const membresiaExistente = await Membresia.findOne({ where: { id_miembro: miembro.id } });
      if (membresiaExistente) {
        await membresiaExistente.update({ id_tipo: data.tipo });
      } else {
        await Membresia.create({
          id_miembro: miembro.id,
          id_tipo: data.tipo,
          fecha_inicio: data.fecha_registro,
          fecha_fin: new Date(new Date(data.fecha_registro).getTime() + 30*24*60*60*1000),
          estado: 'activa'
        });
      }
    }

    res.json({ message: 'Miembro actualizado', miembro });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo actualizar el miembro' });
  }
};
