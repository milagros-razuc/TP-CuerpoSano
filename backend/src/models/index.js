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

// RELACIONES
Miembro.hasMany(Membresia, { foreignKey: 'id_miembro', as: 'membresias' });
Membresia.belongsTo(Miembro, { foreignKey: 'id_miembro', as:'miembro' });

TipoMembresia.hasMany(Membresia, { foreignKey: 'id_tipo' , as:'membresias'});
Membresia.belongsTo(TipoMembresia, { foreignKey: 'id_tipo', as: 'tipo' });

Membresia.hasMany(Pago, { foreignKey: 'id_membresia', as:'pago' });
Pago.belongsTo(Membresia, { foreignKey: 'id_membresia', as:'membresias' });

MetodoPago.hasMany(Pago, { foreignKey: 'id_metodoPago' });
Pago.belongsTo(MetodoPago, { foreignKey: 'id_metodoPago' });

Entrenador.hasMany(Certificacion, { foreignKey: 'id_entrenador' });
Certificacion.belongsTo(Entrenador, { foreignKey: 'id_entrenador' });

Entrenador.belongsToMany(Especialidad, {
  through: EntrenadorEspecialidad,
  foreignKey: 'id_entrenador'
});
Especialidad.belongsToMany(Entrenador, {
  through: EntrenadorEspecialidad,
  foreignKey: 'id_especialidad'
});

Actividad.belongsToMany(Clase, {
  through: ActividadClase,
  foreignKey: 'id_actividad'
});
Clase.belongsToMany(Actividad, {
  through: ActividadClase,
  foreignKey: 'id_clase'
});

Miembro.belongsToMany(Clase, {
  through: Inscripcion,
  foreignKey: 'id_miembro'
});
Clase.belongsToMany(Miembro, {
  through: Inscripcion,
  foreignKey: 'id_clase'
});

Miembro.hasMany(AsistenciaGimnasio, { foreignKey: 'id_miembro' });
Miembro.hasMany(AsistenciaClase, { foreignKey: 'id_miembro' });
Clase.hasMany(AsistenciaClase, { foreignKey: 'id_clase' });

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
  ActividadClase,
  Inscripcion,
  AsistenciaGimnasio,
  AsistenciaClase
};
