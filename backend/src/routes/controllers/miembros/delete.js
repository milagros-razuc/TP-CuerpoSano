const { Miembro, Membresia, TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni } = req.params;

    // Buscamos al miembro por DNI
    const miembro = await Miembro.findOne({ where: { dni } });
    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

    // Desactivamos el miembro
    await miembro.update({ activo: false });

    // Si tiene membresía, la marcamos como cancelada (o inactiva)
    const membresia = await Membresia.findOne({ where: { id_miembro: miembro.id } });
    if (membresia) {
      await membresia.update({ estado: 'cancelada' });
    }

    res.json({ message: 'Miembro desactivado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo desactivar el miembro' });
  }
};