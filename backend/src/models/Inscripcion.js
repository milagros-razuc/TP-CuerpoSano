// models/Inscripcion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Inscripcion = sequelize.define('Inscripcion', {
  id_clase: { type: DataTypes.INTEGER, primaryKey: true },
  id_miembro: { type: DataTypes.INTEGER, primaryKey: true },
  fecha_inscripcion: { type: DataTypes.DATEONLY, allowNull: false }
}, {
  tableName: 'Inscripcion',
  timestamps: false
});

module.exports = Inscripcion;
