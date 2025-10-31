// models/AsistenciaClase.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AsistenciaClase = sequelize.define('Asistencia_Clase', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_miembro: { type: DataTypes.INTEGER, allowNull: false },
  id_clase: { type: DataTypes.INTEGER, allowNull: false },
  fecha_hora: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'Asistencia_Clase',
  timestamps: false
});

module.exports = AsistenciaClase;
