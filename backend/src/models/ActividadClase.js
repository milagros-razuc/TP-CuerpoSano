// models/ActividadClase.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ActividadClase = sequelize.define('Actividad_Clase', {
  id_clase: { type: DataTypes.INTEGER, primaryKey: true },
  id_actividad: { type: DataTypes.INTEGER, primaryKey: true }
}, {
  tableName: 'Actividad_Clase',
  timestamps: false
});

module.exports = ActividadClase;
