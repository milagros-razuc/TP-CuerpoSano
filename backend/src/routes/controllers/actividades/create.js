// POST /actividades
const { Actividad, Clase } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { nombre, descripcion, nivel_dificultad, clasesIds } = req.body;

    if (!nombre)
      return res.status(400).json({ error: "El nombre es obligatorio" });

    const nueva = await Actividad.create({
      nombre,
      descripcion,
      nivel_dificultad
    });

    // Si recibe clases, vincula
    if (Array.isArray(clasesIds) && clasesIds.length > 0) {
      await nueva.setClases(clasesIds);
    }

    const actividadCompleta = await Actividad.findByPk(nueva.id, {
      include: [{ model: Clase, as: "clases" }]
    });

    res.status(201).json(actividadCompleta);

  } catch (error) {
    console.error("Error al crear actividad:", error);
    res.status(500).json({ error: "Error interno al crear la actividad" });
  }
};
