const Miembro = require('./Miembro');
const TipoMembresia = require('./TipoMembresia');
const Membresia = require('./Membresia');
const Pago = require('./Pago');
const MetodoPago = require('./MetodoPago');
const Entrenador = require('./Entrenador');
const Certificacion = require('./Certificacion');
const Especialidad = require('./Especialidad');
const EntrenadorEspecialidad = require('./EntrenadorEspecialidad');
const Actividad = require('./Actividad');
const Clase = require('./Clase');
const ActividadClase = require('./ActividadClase');
const Inscripcion = require('./Inscripcion');
const AsistenciaGimnasio = require('./AsistenciaGimnasio');
const AsistenciaClase = require('./AsistenciaClase');
const ClaseDia = require('./ClaseDia');

// RELACIONES
Miembro.hasMany(Membresia, { foreignKey: 'id_miembro', as: 'membresias' });
Membresia.belongsTo(Miembro, { foreignKey: 'id_miembro', as:'miembro' });

TipoMembresia.hasMany(Membresia, { foreignKey: 'id_tipo' , as:'membresias'});
Membresia.belongsTo(TipoMembresia, { foreignKey: 'id_tipo', as: 'tipo' });

Membresia.hasMany(Pago, { foreignKey: 'id_membresia', as:'pago' });
Pago.belongsTo(Membresia, { foreignKey: 'id_membresia', as:'membresias' });

MetodoPago.hasMany(Pago, { foreignKey: 'id_metodoPago', as:'pago' });
Pago.belongsTo(MetodoPago, { foreignKey: 'id_metodoPago',as:'metodoPago' });

Entrenador.hasMany(Certificacion, { foreignKey: 'id_entrenador', as: 'certificaciones' });
Certificacion.belongsTo(Entrenador, { foreignKey: 'id_entrenador', as: 'entrenador' });

// 🧠 Entrenador ↔ Especialidad (muchos a muchos)
Entrenador.belongsToMany(Especialidad, {
  through: EntrenadorEspecialidad,
  foreignKey: 'id_entrenador',
  as: 'especialidades'
});
Especialidad.belongsToMany(Entrenador, {
  through: EntrenadorEspecialidad,
  foreignKey: 'id_especialidad',
  as: 'entrenadores'
});

// 🏋️‍♀️ Actividad ↔ Clase (muchos a muchos)
Actividad.belongsToMany(Clase, {
  through: ActividadClase,
  foreignKey: 'id_actividad',
  as: 'clases'
});
Clase.belongsToMany(Actividad, {
  through: ActividadClase,
  foreignKey: 'id_clase',
  as: 'actividades'
});

// 🧍‍♀️ Miembro ↔ Clase (muchos a muchos → Inscripciones)
Miembro.belongsToMany(Clase, {
  through: Inscripcion,
  foreignKey: 'id_miembro',
  as: 'clasesInscritas'
});
Clase.belongsToMany(Miembro, {
  through: Inscripcion,
  foreignKey: 'id_clase',
  as: 'inscriptos'
});
// 📋 Inscripción ↔ Relaciones directas
Inscripcion.belongsTo(Miembro, { foreignKey: 'id_miembro', as: 'miembro' });
Inscripcion.belongsTo(Clase, { foreignKey: 'id_clase', as: 'clase' });

//Asistencias
Miembro.hasMany(AsistenciaGimnasio, { foreignKey: 'id_miembro', as: 'asistenciasGimnasio' });
AsistenciaGimnasio.belongsTo(Miembro, { foreignKey: 'id_miembro', as: 'miembro' });

Miembro.hasMany(AsistenciaClase, { foreignKey: 'id_miembro', as: 'asistenciasClase' });
AsistenciaClase.belongsTo(Miembro, { foreignKey: 'id_miembro', as: 'miembro' });

Clase.hasMany(AsistenciaClase, { foreignKey: 'id_clase', as: 'asistenciasClase' });
AsistenciaClase.belongsTo(Clase, { foreignKey: 'id_clase', as: 'clase' });

Entrenador.hasMany(Clase, { foreignKey: 'id_entrenador', as: 'clases' });
Clase.belongsTo(Entrenador, { foreignKey: 'id_entrenador', as: 'entrenador' });

// Relación Clase → ClaseDia (1 a muchos)
Clase.hasMany(ClaseDia, { foreignKey: 'id_clase', as: 'dias' });
ClaseDia.belongsTo(Clase, { foreignKey: 'id_clase', as: 'clase' });


Miembro.hasMany(Pago, { foreignKey: 'id_miembro', as: 'pagos' });
Pago.belongsTo(Miembro, { foreignKey: 'id_miembro', as: 'miembro' });

module.exports = {
  Miembro,
  TipoMembresia,
  Membresia,
  Pago,
  MetodoPago,
  Entrenador,
  Certificacion,
  Especialidad,
  EntrenadorEspecialidad,
  Actividad,
  Clase,
  ClaseDia,
  ActividadClase,
  Inscripcion,
  AsistenciaGimnasio,
  AsistenciaClase
};
