const { Miembro, Membresia, TipoMembresia } = require('../../../models');
const { generarCodigoDeBarras } = require('../../utils/barcodeGenerator'); // 👈 importás tu util

// Crear miembro + membresía
module.exports = async (req, res) => {
  try {
    const data = req.body;

    // 🔹 Validación de campos obligatorios
    const camposObligatorios = ['nombre', 'apellido', 'dni', 'telefono', 'fecha_nacimiento', 'fecha_registro', 'metodo_identificacion'];
    const camposFaltantes = camposObligatorios.filter(campo => !data[campo]);
    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios',
        campos: camposFaltantes
      });
    }

     const metodo =
      Array.isArray(data.metodo_identificacion)
        ? data.metodo_identificacion[0]
        : data.metodo_identificacion;

    let codigoBarra = null;
    let codigoVisible = null;
    if (metodo === 'codigo_barras') {
      const { codigo, hash } = generarCodigoDeBarras(); // 🔸 llamado al util
      codigoBarra = hash; // lo que se guarda en BD
      codigoVisible = codigo; // lo que podés devolver al front
    }

     const existente = await Miembro.findOne({ where: { dni: data.dni } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe un miembro con ese DNI' });
    }

      
    // 1️⃣ Crear el miembro
    const nuevoMiembro = await Miembro.create({
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      telefono: data.telefono,
      email: data.email || null,
      fecha_nacimiento: data.fecha_nacimiento,
      fecha_registro: data.fecha_registro,
      activo: data.activo ?? true,
      metodo_identificacion: metodo,
      codigo_barra: codigoBarra,
      huella_digital: data.huella_digital || null,
      foto: data.foto || null
    });

    // 2️⃣ Crear la membresía si se envía un tipo
    if (data.tipo) {

      const tipoMembresia = await TipoMembresia.findByPk(data.tipo);
        if (!tipoMembresia) {
          return res.status(400).json({ error: 'Tipo de membresía inválido' });
        }

        const fechaInicio = new Date(data.fecha_registro);
        const fechaFin = new Date(fechaInicio.getTime() + tipoMembresia.duracion_dias * 24 * 60 * 60 * 1000);

      await Membresia.create({
        id_miembro: nuevoMiembro.id,
        id_tipo: Number(data.tipo), // aseguramos que sea un número
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado: 'pendiente'
      });
    }

    res.status(201).json({ message: 'Miembro creado con membresía', miembro: nuevoMiembro });

  } catch (error) {
  console.error(error);
  if (error.name === 'SequelizeValidationError') {
    const mensajes = error.errors.map(e => e.message);
    return res.status(400).json({ error: 'Error de validación', detalles: mensajes });
  }
  res.status(500).json({ error: 'No se pudo crear el miembro' });
  }
};