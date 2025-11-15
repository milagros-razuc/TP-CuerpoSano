// PUT /actividades/:id
const { Actividad, Clase } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, nivel_dificultad, clasesIds } = req.body;

    const actividad = await Actividad.findByPk(id);

    if (!actividad)
      return res.status(404).json({ error: "Actividad no encontrada" });

    await actividad.update({
      nombre,
      descripcion,
      nivel_dificultad
    });

    // Actualizar clases asociadas
    if (Array.isArray(clasesIds)) {
      await actividad.setClases(clasesIds); // reemplaza todas
    }

    const actividadActualizada = await Actividad.findByPk(id, {
      include: [{ model: Clase, as: "clases" }]
    });

    res.json(actividadActualizada);

  } catch (error) {
    console.error("Error al actualizar actividad:", error);
    res.status(500).json({ error: "Error interno al actualizar la actividad" });
  }
};
