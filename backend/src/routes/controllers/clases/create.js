// controllers/clases/create.js
const { Clase, ClaseDia, Entrenador } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const {nombre, hora_inicio, duracion_minutos, cupo_maximo, id_entrenador, dias } = req.body;

    if (!nombre||!hora_inicio || !duracion_minutos || !cupo_maximo || !id_entrenador || !dias || !Array.isArray(dias)) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o formato incorrecto' });
    }

    // Validar entrenador
    const entrenador = await Entrenador.findByPk(id_entrenador);
    if (!entrenador) {
      return res.status(400).json({ error: 'Entrenador no válido' });
    }

    // Crear clase
    const nuevaClase = await Clase.create({
      nombre,   
      hora_inicio,
      duracion_minutos,
      cupo_maximo,
      id_entrenador
    });

    // Crear los días asociados
    const diasData = dias.map(d => ({
      id_clase: nuevaClase.id,
      dia_semana: d
    }));
    await ClaseDia.bulkCreate(diasData);

    res.status(201).json({
      message: 'Clase creada correctamente',
      clase: {
        ...nuevaClase.toJSON(),
        dias
      }
    });

  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({ error: 'Error interno al crear la clase', detalles: error.message });
  }
};
